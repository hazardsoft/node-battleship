import {getConnectionByPlayerId} from "../connections.js";
import {getPlayerById} from "../db/players.js";
import {PlayerId} from "../db/types.js";
import {getAllWinners, getWins} from "../db/winners.js";
import {ClientResponse, MessageType, WinnerPayload} from "../types.js";
import {NotificationContext} from "./types.js";

export const updateWinners = (context: NotificationContext<{currentUserId:PlayerId}>) => {
    const {payload} = context;
    const currentUserId = payload ? payload.currentUserId : "";

    const winnerIds = getAllWinners();
    const winners = winnerIds.map(winnerId => {
        return {
            name: getPlayerById(winnerId)?.username || "",
            wins: getWins(winnerId)
        } satisfies WinnerPayload;
    })

    const notification: ClientResponse = {
        id: 0,
        type: MessageType.UPDATE_WINNERS,
        data: JSON.stringify(winners)
    }
    if (currentUserId) {
        const connection = getConnectionByPlayerId(currentUserId);
        if (!connection) {
            throw new Error(`connection for playerId ${currentUserId} does not exist`);
        }
        connection.socket.send(JSON.stringify(notification));
    } else {
        context.connectionContext.server.clients.forEach((socket) => {
            if (socket.readyState === WebSocket.OPEN) {
                socket.send(JSON.stringify(notification));
            }
        });
    }
}