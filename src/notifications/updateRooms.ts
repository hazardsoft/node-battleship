import {getPlayerById} from "../db/players";
import {getAllRooms} from "../db/rooms";
import {MessageType, type ClientResponse, type RoomPayload, type RoomUserPayload} from "../types";
import WebSocket from 'ws';
import type {NotificationContext} from "./types";
import {getConnectionByPlayerId} from "../connections";
import type {PlayerId} from "../db/types";

export const updateRooms = (context: NotificationContext<{currentUserId:PlayerId}>) => {
    const {payload} = context;
    const currentUserId = payload ? payload.currentUserId : "";

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

    const notification: ClientResponse = {
        id: 0,
        type: MessageType.UPDATE_ROOMS,
        data: JSON.stringify(roomsPayload),
    }
    
    if (currentUserId) {
        const connection = getConnectionByPlayerId(currentUserId);
        if (!connection) {
            throw new Error(`connection for playerId ${currentUserId} does not exist`);
        }
        console.log(`--> command '${notification.type}', payload ${notification.data}`);
        connection.socket.send(JSON.stringify(notification));
    } else {
        context.connectionContext.server.clients.forEach((socket) => {
            if (socket.readyState === WebSocket.OPEN) {
                console.log(`--> command '${notification.type}', payload ${notification.data}`);
                socket.send(JSON.stringify(notification));
            }
        });
    }
}