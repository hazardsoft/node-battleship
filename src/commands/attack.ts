import {Command, CommandContext} from "./types.js";
import {AttackPayload, AttackRequestPayload, ClientResponse, MessageType} from "../types.js";
import {getGameById, isHit} from "../db/games.js";
import {getConnectionByPlayerId} from "../connections.js";
import {getOpponentId} from "../utils.js";
import {turn} from "../notifications/turn.js";

export const attack: Command = (context: CommandContext) => {
    const {message, connectionContext} = context;
    const {gameId, x, y, indexPlayer: currentPlayerId} = JSON.parse(message.data) as AttackRequestPayload;

    const game = getGameById(gameId);
    if (!game) {
        throw new Error(`game ${gameId} does not exist`);
    }
    if (game.currentPlayerId !== currentPlayerId) {
        console.warn(`player ${currentPlayerId} tries to perform action not in theirs turn`);
        return;
    }

    const playerIds = Array.from(game.playerShips.keys());
    const opponentPlayerId = getOpponentId(playerIds, currentPlayerId);
    if (!opponentPlayerId) {
        throw new Error(`could not find opponent to ${currentPlayerId} in game ${gameId}`);
    }
    const status = isHit(gameId, opponentPlayerId, {x, y}) ? 'shot' : 'miss';
    for (const playerId of playerIds) {
        const connection = getConnectionByPlayerId(playerId);
        if (!connection) {
            throw new Error(`connection for playerId ${playerId} does not exist`);
        }
        const ships = game.playerShips.get(playerId);
        if (!ships) {
            throw new Error(`player ${playerId} does not have ships`);
        }
        const notification: ClientResponse = {
            id: 0,
            type: MessageType.ATTACK,
            data: JSON.stringify({
                currentPlayer: currentPlayerId,
                position: {x, y},
                status
            } satisfies AttackPayload)
        }
        if (connection.socket.readyState === WebSocket.OPEN) {
            connection.socket.send(JSON.stringify(notification))
        }
    }

    // decide if we need to change current player
    const nextPlayerId = status === "miss" ? opponentPlayerId : currentPlayerId;
    turn({
        connectionContext,
        payload: {
            gameId,
            nextPlayerId
        }
    })
}