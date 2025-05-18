import {Player} from "./types.js";

const players: Map<string, Player> = new Map();

const registerPlayer = (username:string, password:string): Player => {
    players.set(username, {
        username, password
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

export {registerPlayer, hasPlayer, loginPlayer}