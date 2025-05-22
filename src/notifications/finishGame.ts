import {getConnectionByPlayerId} from "../connections";
import {getGameByPlayerId} from "../db/games/games";
import type {PlayerId} from "../db/types";
import {addWinner} from "../db/winners";
import {MessageType, type ClientResponse, type FinishGamePayload} from "../types";
import type {NotificationContext} from "./types";
import {updateWinners} from "./updateWinners";

export const finishGame = (context: NotificationContext<{winPlayer: PlayerId}>) => {
    const {payload, connectionContext} = context;
    const winPlayerId = payload ? payload.winPlayer : "";

    const game = getGameByPlayerId(winPlayerId);
    if (!game) {
        throw new Error(`game for player ${winPlayerId} does not exist`);
    }

    // send notification about winner to the game players
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
            console.log(`--> command '${notification.type}', payload ${notification.data}`);
            connection.socket.send(JSON.stringify(notification))
        }
    }

    // update wins for win player
    addWinner(winPlayerId);
    // notify all players with updated win statistics
    updateWinners({connectionContext})
}