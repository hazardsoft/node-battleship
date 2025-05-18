import {generateRoomId} from "../utils.js";
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

const startGameInRoom = (id:RoomId, gameId:GameId) => {
    const room = rooms.find(room => room.id === id);
    if (room) {
        room.gameId = gameId;
    }
}

const endGameInRoom = (id:RoomId) => {
    const room = rooms.find(room => room.id === id);
    if (room) {
        room.gameId = undefined;
    }
}

const getAllRooms = ():Room[] => {
    return rooms.slice();
}

export {addRoom, addPlayerToRoom, startGameInRoom, endGameInRoom, getAllRooms};
