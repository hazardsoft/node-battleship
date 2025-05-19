import {AddShipsRequestPayload} from "../types.js";
import {startGame} from "../notifications/startGame.js";
import {Command, CommandContext} from "./types.js";
import {turn} from "../notifications/turn.js";
import {getGameById} from "../db/games/games.js";

export const addShips: Command = (context: CommandContext) => {
    const {message, connectionContext} = context;

    const payload = JSON.parse(message.data) as AddShipsRequestPayload;
    const {gameId, indexPlayer: playerId, ships} = payload;

    const game = getGameById(payload.gameId);
    if (!game) {
        throw new Error(`game ${payload.gameId} does not exist`);
    }
    game.getBoard(playerId)?.addShips(ships);

    // start game if both players placed their ships
    if (game.isReady()) {
        startGame({
            connectionContext,
            payload: {gameId}
        });
        turn({
            connectionContext,
            payload: {gameId, nextPlayerId: playerId}
        })
    }
}