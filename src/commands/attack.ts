import {Command, CommandContext} from "./types.js";
import {AttackPayload, AttackRequestPayload, ClientResponse, MessageType} from "../types.js";
import {getConnectionByPlayerId} from "../connections.js";
import {getOpponentId} from "../utils.js";
import {turn} from "../notifications/turn.js";
import {getGameById} from "../db/games/games.js";
import {finishGame} from "../notifications/finishGame.js";

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

    const opponentPlayerId = getOpponentId(game.playerIds, currentPlayerId);
    if (!opponentPlayerId) {
        throw new Error(`could not find opponent to ${currentPlayerId} in game ${gameId}`);
    }
    const board = game.getBoard(opponentPlayerId);
    if (!board) {
        throw new Error(`no board for player ${opponentPlayerId}`);
    }
    const status = board.getHitResult({x, y});
    for (const playerId of game.playerIds) {
        const connection = getConnectionByPlayerId(playerId);
        if (!connection) {
            throw new Error(`connection for playerId ${playerId} does not exist`);
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

    // if a ship is killed check if it was the last one
    if (status === "killed") {
        if (board.isAllShipsKilled()) {
            finishGame({
                connectionContext,
                payload: {
                    winPlayer: currentPlayerId
                }
            })
            return;
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