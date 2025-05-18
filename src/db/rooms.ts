import {generateRoomId} from "../utils.js";
import {addGame} from "./games.js";
import {GameId, PlayerId, Room, RoomId} from "./types.js";

const rooms: Room[] = [];

const addRoom = (): Room => {
    const room: Room = {
        id: generateRoomId(),
        playersIds: []};
    rooms.push(room);
    return room;
}

const addPlayerToRoom = (id:RoomId, playerId:PlayerId) => {
    const room = rooms.find(room => room.id === id);
    if (room && !room.playersIds.includes(playerId)) {
        room.playersIds.push(playerId);
    }
}

const startGameInRoom = (id:RoomId): GameId | null => {
    const room = rooms.find(room => room.id === id);
    if (room) {
        const game = addGame();
        return room.gameId = game.gameId;
    }
    return null;
}

const endGameInRoom = (id:RoomId) => {
    const room = rooms.find(room => room.id === id);
    if (room) {
        room.gameId = undefined;
    }
}

const getRoomById = (id:RoomId): Room | null => {
    for (const room of rooms.values()) {
        if (room.id === id) return room;
    }
    return null;
}

const getAllRooms = ():Room[] => {
    return rooms.slice();
}

export {addRoom, addPlayerToRoom, startGameInRoom, endGameInRoom, getRoomById, getAllRooms};
