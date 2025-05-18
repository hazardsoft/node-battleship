import {addShipsToGameForPlayer, getGameById} from "../db/games.js";
import {AddShipsRequestPayload} from "../types.js";
import {startGame} from "../notifications/startGame.js";
import {Command, CommandContext} from "./types.js";
import {turn} from "../notifications/turn.js";

export const addShips: Command = (context: CommandContext) => {
    const {message, connectionContext} = context;

    const payload = JSON.parse(message.data) as AddShipsRequestPayload;
    const {gameId, indexPlayer: playerId, ships} = payload;

    const game = getGameById(payload.gameId);
    if (!game) {
        throw new Error(`game ${payload.gameId} does not exist`);
    }
    addShipsToGameForPlayer(gameId, playerId, ships);

    // start game if both players placed their ships
    if (game.playerShips.size === 2) {
        startGame({
            connectionContext,
            payload: {gameId}
        });
        turn({
            connectionContext,
            payload: {gameId}
        })
    }
}