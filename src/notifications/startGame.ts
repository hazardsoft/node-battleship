import {getConnectionByPlayerId} from "../connections.js";
import {getGameById} from "../db/games/games.js";
import {GameId} from "../db/types.js";
import {ClientResponse, MessageType, StartGamePayload} from "../types.js";
import {NotificationContext} from "./types.js";

export const startGame = (context: NotificationContext<{gameId: GameId}>) => {
    const {payload} = context;
    const gameId = payload ? payload.gameId : "";

    const game = getGameById(gameId);
    if (!game) {
        throw new Error(`game ${gameId} does not exist`);
    }
    for (const playerId of game.playerIds) {
        const connection = getConnectionByPlayerId(playerId);
        if (!connection) {
            throw new Error(`connection for playerId ${playerId} does not exist`);
        }
        const ships = game.getBoard(playerId)?.getShips();
        if (!ships) {
            throw new Error(`player ${playerId} does not have ships`);
        }
        const notification: ClientResponse = {
            id: 0,
            type: MessageType.START_GAME,
            data: JSON.stringify({
                currentPlayerIndex: playerId,
                ships
            } satisfies StartGamePayload)
        }
        if (connection.socket.readyState === WebSocket.OPEN) {
            console.log(`--> command '${notification.type}', payload ${notification.data}`);
            connection.socket.send(JSON.stringify(notification))
        }
    }
}