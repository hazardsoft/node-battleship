import {generatePlayerId} from "../utils.js";
import {Player, PlayerId} from "./types.js";

const players: Map<string, Player> = new Map();

const registerPlayer = (username:string, password:string): Player => {
    players.set(username, {
        id: generatePlayerId(),
        username, 
        password
    })
    return players.get(username)!;
}

const loginPlayer = (username:string, password:string): Player | null => {
    if (players.has(username)) {
        const player = players.get(username)!;
        if (player.password === password) {
            return player;
        }
    }
    return null;
}

const hasPlayer = (username:string): boolean => {
    return players.has(username);
}

const getPlayerById = (id:PlayerId): Player | null => {
    for (const player of players.values()) {
        if (player.id === id) return player;
    }
    return null;
}

export {registerPlayer, hasPlayer, loginPlayer, getPlayerById}