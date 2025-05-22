import type {Command, CommandContext} from "./types";
import {MessageType, type AttackPayload, type AttackRequestPayload, type ClientResponse, type Connection} from "../types";
import {getConnectionByPlayerId} from "../connections";
import {getOpponentId} from "../utils";
import {turn} from "../notifications/turn";
import {getGameById} from "../db/games/games";
import {finishGame} from "../notifications/finishGame";
import type {PlayerId} from "../db/types";

export const attack: Command = (context: CommandContext) => {
    const {message, connectionContext} = context;
    const {gameId, x, y, indexPlayer: currentPlayerId} = JSON.parse(message.data) as AttackRequestPayload;

    const game = getGameById(gameId);
    if (!game) {
        throw new Error(`game ${gameId} does not exist`);
    }
    if (game.currentPlayerId !== currentPlayerId) {
        console.warn(`player id (${currentPlayerId}) tries to perform action not in theirs turn`);
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
    const positionsAroundShip = status === "killed" ? board.openCellsAroundShip({x, y}) : [];
    for (const playerId of game.playerIds) {
        const connection = getConnectionByPlayerId(playerId);
        if (!connection) {
            throw new Error(`connection for playerId ${playerId} does not exist`);
        }
        sendNotification(connection, currentPlayerId, {x, y}, status)
        positionsAroundShip.forEach(position => {
            sendNotification(connection, currentPlayerId, position, "miss")
        })
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

const sendNotification = (connection: Connection, currentPlayerId:PlayerId, position: {x:number, y:number}, status: "miss" | "shot" | "killed") => {
    const notification: ClientResponse = {
        id: 0,
        type: MessageType.ATTACK,
        data: JSON.stringify({
            currentPlayer: currentPlayerId,
            position,
            status
        } satisfies AttackPayload)
    }
    if (connection.socket.readyState === WebSocket.OPEN) {
        console.log(`--> command '${notification.type}', payload ${notification.data}`);
        connection.socket.send(JSON.stringify(notification))
    }
}