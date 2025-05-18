import {addPlayerToRoom} from "../db/rooms.js";
import {JoinRoomRequestPayload} from "../types.js";
import {Command, CommandContext} from "./types.js";
import {updateRooms} from "./updateRooms.js";

export const joinRoom: Command = (context: CommandContext) => {
    const {connectionContext, message} = context;
    const payload = JSON.parse(message.data) as JoinRoomRequestPayload;

    if (!connectionContext.connection.playerId) {
        throw new Error(`connection does not have associated player`);
    }
    addPlayerToRoom(payload.indexRoom, connectionContext.connection.playerId);
    updateRooms(context);
}