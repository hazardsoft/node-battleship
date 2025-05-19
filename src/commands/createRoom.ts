import {Command, CommandContext} from "./types.js";
import {addPlayerToRoom, addRoom} from "../db/rooms.js";
import {updateRooms} from "../notifications/updateRooms.js";

export const createRoom: Command = (context: CommandContext) => {
    const {connectionContext} = context;
    if (!connectionContext.connection.playerId) {
        throw new Error(`connection does not have associated player`);
    }

    const room = addRoom();
    addPlayerToRoom(room.id, connectionContext.connection.playerId);

    // send updated list of rooms to all players
    updateRooms(context);
}