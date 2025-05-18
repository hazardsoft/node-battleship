import {getPlayerById} from "../db/players.js";
import {PlayerId} from "../db/types.js";
import {addWinner, getAllWinners, getWins} from "../db/winners.js";
import {ClientResponse, MessageType, WinnerPayload} from "../types.js";
import {NotificationContext} from "./types.js";

export const updateWinners = (context: NotificationContext<{winnerId:PlayerId}>) => {
    const {payload} = context;
    const winnerId = payload ? payload.winnerId : "";
    if (!winnerId) {
        throw new Error(`winnerId is empty`)
    }
    // increase number of wins of a winner
    addWinner(winnerId);

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
    context.connectionContext.server.clients.forEach((socket) => {
        if (socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify(notification));
        }
    });
}