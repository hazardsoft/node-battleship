import {generateGameId} from "../../utils.js";
import {GameId, PlayerId} from "../types.js";
import {Game} from "./Game.js";

const games: Map<GameId, Game> = new Map();

const addGame = (playerIds: PlayerId[]): Game => {
    const gameId = generateGameId();
    const game: Game = new Game(gameId, playerIds);
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

const getGameByPlayerId = (playerId:PlayerId): Game | null => {
    for(const game of games.values()) {
        if (game.playerIds.includes(playerId)) {
            return game;
        }
    }
    return null;
}

export {addGame, removeGame, getGameById, getGameByPlayerId};