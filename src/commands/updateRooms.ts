import {getPlayerById} from "../db/players.js";
import {getAllRooms} from "../db/rooms.js";
import {ClientResponse, MessageType, RoomPayload, RoomUserPayload} from "../types.js";
import {Command, CommandContext} from "./types.js";
import WebSocket from 'ws';

export const updateRooms: Command = (context: CommandContext) => {
    const {connectionContext} = context;

    const rooms = getAllRooms();
    const availableRooms = rooms.filter(room => room.playersIds.length < 2);
    const roomsPayload = availableRooms.map(room => {
        return {
            roomId: room.id,
            roomUsers: room.playersIds.map(playerId => {
                const player = getPlayerById(playerId)
                if (!player) {
                    throw new Error(`player ${playerId} does not exist in db`);
                }
                return {
                    name: player.username,
                    index: player.id
                } satisfies RoomUserPayload;
            })
        } satisfies RoomPayload;
    })

    const response: ClientResponse = {
        id: 0,
        type: MessageType.UPDATE_ROOMS,
        data: JSON.stringify(roomsPayload),
    }
    connectionContext.server.clients.forEach((socket) => {
        if (socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify(response));
        }
    });
}