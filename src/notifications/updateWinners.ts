import {getConnectionByPlayerId} from "../connections";
import {getPlayerById} from "../db/players";
import type {PlayerId} from "../db/types";
import {getAllWinners, getWins} from "../db/winners";
import {MessageType, type ClientResponse, type WinnerPayload} from "../types";
import type {NotificationContext} from "./types";

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
        console.log(`--> command '${notification.type}', payload ${notification.data}`);
        connection.socket.send(JSON.stringify(notification));
    } else {
        context.connectionContext.server.clients.forEach((socket) => {
            if (socket.readyState === WebSocket.OPEN) {
                console.log(`--> command '${notification.type}', payload ${notification.data}`);
                socket.send(JSON.stringify(notification));
            }
        });
    }
}