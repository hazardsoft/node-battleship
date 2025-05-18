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

const isHit = (gameId:GameId, playerId:PlayerId, position: {x:number, y:number}): boolean => {
    const game = games.get(gameId);
    if (game) {
        const ships = game.playerShips.get(playerId);
        if (ships) {
            for (const ship of ships) {
                if (isPositionBelongToShip(ship, position)) {
                    return true;
                }
            }
        }
    }
    return false;
}

const isPositionBelongToShip = (ship:Ship, position: {x: number, y: number}):boolean => {
    const {x, y} = position;
    if (ship.direction) {
        return x === ship.position.x && y >= ship.position.y && y <= ship.position.y + ship.length - 1;
    } else {
        return y === ship.position.y && x >= ship.position.x && x <= ship.position.x + ship.length - 1;
    }
}

export {addGame, removeGame, getGameById, addShipsToGameForPlayer, isHit};