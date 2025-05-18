import {addPlayerToRoom, getRoomById} from "../db/rooms.js";
import {JoinRoomRequestPayload} from "../types.js";
import {createGame} from "./createGame.js";
import {Command, CommandContext} from "./types.js";
import {updateRooms} from "./updateRooms.js";

export const joinRoom: Command = (context: CommandContext) => {
    const {connectionContext, message} = context;
    if (!connectionContext.connection.playerId) {
        throw new Error(`connection does not have associated player`);
    }

    const payload = JSON.parse(message.data) as JoinRoomRequestPayload;
    const roomId = payload.indexRoom;
    const room = getRoomById(roomId);
    if (!room) {
        throw new Error(`room ${roomId} does not exist`);
    }
    addPlayerToRoom(roomId, connectionContext.connection.playerId);
    updateRooms(context);
    
    // if a room is full, let's start a game
    if (room.playersIds.length === 2) {
        createGame(context);
    }
}