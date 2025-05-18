import {Command, CommandContext} from "./types.js";
import {addRoom} from "../db/rooms.js";
import {ClientResponse} from "../types.js";
import {updateRooms} from "./updateRooms.js";

export const createRoom: Command = (context: CommandContext) => {
    const {connectionContext, message} = context;

    const room = addRoom();
    console.log(`room ${room.id} created`);
    if (!connectionContext.connection.playerId) {
        throw new Error(`connection does not have associated player`);
    }

    const response: ClientResponse = {
        id: message.id,
        type: message.type,
        data: ''
    }
    connectionContext.connection.socket.send(JSON.stringify(response));
    // send updated list of rooms to ALL players
    updateRooms(context);
}