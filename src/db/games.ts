import {Ship} from "../types.js";
import {generateGameId} from "../utils.js";
import {Game, GameId, PlayerId} from "./types.js";

const games: Map<GameId, Game> = new Map();

const addGame = (): Game => {
    const gameId = generateGameId();
    const game: Game = {
        gameId, 
        playerShips: new Map()
    }
    games.set(gameId, game);
    return game;
}

const removeGame = (id:GameId) => {
    const isGameExist = games.delete(id);
    if (!isGameExist) {
        throw new Error(`game ${id} does not exist`);
    }
}

const getGameById = (id:GameId):Game | null => {
    if (games.has(id)) {
        return games.get(id)!;
    }
    return null;
}

const addShipsToGameForPlayer = (gameId:GameId, playerId: PlayerId, ships: Ship[]) => {
    const game = games.get(gameId);
    if (game) {
        if (game.playerShips.has(playerId)) {
            game.playerShips.get(playerId)?.push(...ships);
        } else {
            game.playerShips.set(playerId, [...ships]);
        }
    }
}

export {addGame, removeGame, getGameById, addShipsToGameForPlayer};