import {getConnectionByPlayerId} from "../connections.js";
import {getGameById} from "../db/games.js";
import {GameId} from "../db/types.js";
import {ClientResponse, MessageType, TurnPayload} from "../types.js";
import {getOpponentId} from "../utils.js";
import {NotificationContext} from "./types.js";

export const turn = (context: NotificationContext<{gameId: GameId}>) => {
    const {payload} = context;
    const gameId = payload ? payload.gameId : "";

    const game = getGameById(gameId);
    if (!game) {
        throw new Error(`game ${gameId} does not exist`);
    }
    const playerIds = Array.from(game.playerShips.keys());
    const currentPlayerId = game.currentPlayerId || playerIds[0];
    const opponentId = getOpponentId(playerIds, currentPlayerId);
    if (!opponentId) {
        throw new Error(`could not find opponent to player ${currentPlayerId}`)
    }
    
    game.currentPlayerId = opponentId;
    // notify room players about change of turn
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
            type: MessageType.CHANGE_TURN,
            data: JSON.stringify({
                currentPlayer: opponentId,
            } satisfies TurnPayload)
        }
        if (connection.socket.readyState === WebSocket.OPEN) {
            connection.socket.send(JSON.stringify(notification))
        }
    }
}