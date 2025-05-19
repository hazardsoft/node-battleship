import {getConnectionByPlayerId} from "../connections.js";
import {getGameById} from "../db/games/games.js";
import {GameId, PlayerId} from "../db/types.js";
import {ClientResponse, MessageType, TurnPayload} from "../types.js";
import {NotificationContext} from "./types.js";

export const turn = (context: NotificationContext<{gameId:GameId, nextPlayerId: PlayerId}>) => {
    const {payload} = context;
    const gameId = payload ? payload.gameId : "";
    const nextPlayerId = payload ? payload.nextPlayerId : "";

    const game = getGameById(gameId);
    if (!game) {
        throw new Error(`game ${gameId} does not exist`);
    }
    
    game.currentPlayerId = nextPlayerId;
    // notify room players about change of turn
    const playerIds = game.playerIds;
    for (const playerId of playerIds) {
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
            type: MessageType.CHANGE_TURN,
            data: JSON.stringify({
                currentPlayer: nextPlayerId,
            } satisfies TurnPayload)
        }
        if (connection.socket.readyState === WebSocket.OPEN) {
            console.log(`--> command '${notification.type}', payload ${notification.data}`);
            connection.socket.send(JSON.stringify(notification))
        }
    }
}