import type {PlayerId} from "./types";

const winners: Map<PlayerId, number> = new Map();

const addWinner = (playerId:PlayerId) => {
    const curWins = winners.has(playerId) ? winners.get(playerId) || 0 : 0;
    winners.set(playerId, curWins + 1);
}

const getWins = (playerId:PlayerId):number => {
    return winners.get(playerId) || 0;
}

const getAllWinners = ():PlayerId[] => {
    return Array.from(winners.keys());
}

export {addWinner, getWins, getAllWinners}