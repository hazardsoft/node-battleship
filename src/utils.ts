import type {GameId, PlayerId} from "./db/types";
import type {ConnectionId} from "./types";

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

const getOpponentId = (playerIds: PlayerId[], playerId:PlayerId): PlayerId | null => {
    for (const id of playerIds) {
        if (id !== playerId) {
            return id;
        }
    }
    return null;
}

export {generateConnectionId, generatePlayerId, generateRoomId, generateGameId, getOpponentId};