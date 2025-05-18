import {getConnectionByPlayerId} from "../connections.js";
import {getGameByPlayerId} from "../db/games/games.js";
import {PlayerId} from "../db/types.js";
import {ClientResponse, FinishGamePayload, MessageType} from "../types.js";
import {NotificationContext} from "./types.js";

export const finishGame = (context: NotificationContext<{winPlayer: PlayerId}>) => {
    const {payload} = context;
    const winPlayerId = payload ? payload.winPlayer : "";

    const game = getGameByPlayerId(winPlayerId);
    if (!game) {
        throw new Error(`game for player ${winPlayerId} does not exist`);
    }
    for (const playerId of game.playerIds) {
        const connection = getConnectionByPlayerId(playerId);
        if (!connection) {
            throw new Error(`connection for playerId ${playerId} does not exist`);
        }
        const notification: ClientResponse = {
            id: 0,
            type: MessageType.FINISH_GAME,
            data: JSON.stringify({
                winPlayer: winPlayerId
            } satisfies FinishGamePayload)
        }
        if (connection.socket.readyState === WebSocket.OPEN) {
            connection.socket.send(JSON.stringify(notification))
        }
    }
}