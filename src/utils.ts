import {GameId, PlayerId} from "./db/types.js";
import {ConnectionId} from "./types.js";

let connectionsCounter = 0;
let playersCounter = 0;
let roomsCounter = 0;
let gamesCounter = 0;

const generateConnectionId = ():ConnectionId => {
    return `connection_${connectionsCounter++}`;
}

const generatePlayerId = ():PlayerId => {
    return `player_${playersCounter++}`;
}

const generateRoomId = ():PlayerId => {
    return `room_${roomsCounter++}`;
}

const generateGameId = ():GameId => {
    return `game_${gamesCounter++}`;
}

export {generateConnectionId, generatePlayerId, generateRoomId, generateGameId};