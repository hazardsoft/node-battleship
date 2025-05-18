import {getConnectionByPlayerId} from "../connections.js";
import {getGameById} from "../db/games.js";
import {AddShipsRequestPayload, ClientResponse, MessageType, StartGamePayload} from "../types.js";
import {Command, CommandContext} from "./types.js";

export const startGame: Command = (context: CommandContext) => {
    const {message} = context;
    const {gameId} = JSON.parse(message.data) as AddShipsRequestPayload;

    const game = getGameById(gameId);
    if (!game) {
        throw new Error(`game ${gameId} does not exist`);
    }
    for (const playerId of game.playerShips.keys()) {
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
            type: MessageType.START_GAME,
            data: JSON.stringify({
                currentPlayerIndex: playerId,
                ships
            } satisfies StartGamePayload)
        }
        if (connection.socket.readyState === WebSocket.OPEN) {
            connection.socket.send(JSON.stringify(notification))
        }
    }
}