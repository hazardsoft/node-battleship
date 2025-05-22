import type {Command, CommandContext} from "./types";
import {addPlayerToRoom, addRoom} from "../db/rooms";
import {updateRooms} from "../notifications/updateRooms";

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