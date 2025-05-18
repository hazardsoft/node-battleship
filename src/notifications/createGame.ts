import {getConnectionByPlayerId} from "../connections.js";
import {getRoomById, startGameInRoom} from "../db/rooms.js";
import {PlayerId, Room, RoomId} from "../db/types.js";
import {ClientResponse, CreateGamePayload, MessageType} from "../types.js";
import WebSocket from 'ws';
import {NotificationContext} from "./types.js";
import {getOpponentId} from "../utils.js";

export const createGame = (context: NotificationContext<{roomId:RoomId}>) => {
    const {connectionContext, payload} = context;
    const roomId = payload ? payload.roomId : "";

    if (!connectionContext.connection.playerId) {
        throw new Error(`connection does not have associated player`);
    }
    const room = getRoomById(roomId);
    if (!room) {
        throw new Error(`room ${roomId} does not exist`);
    }
    const gameId = startGameInRoom(roomId);
    if (!gameId) {
        throw new Error(`could not create game in room ${roomId}`);
    }
    room.playersIds.forEach(playerId => {
        const connection = getConnectionByPlayerId(playerId);
        if (!connection) {
            throw new Error(`connection for playerId ${playerId} does not exist`);
        }
        const opponentId = getOpponentId(room.playersIds, playerId);
        if (!opponentId) {
            throw new Error('could not find opponent id');
        }
        const notification: ClientResponse = {
            id: 0,
            type: MessageType.CREATE_GAME,
            data: JSON.stringify({
                idGame: gameId,
                idPlayer: playerId
            } satisfies CreateGamePayload)
        }
        if (connection.socket.readyState === WebSocket.OPEN) {
            connection.socket.send(JSON.stringify(notification))
        }
    })
}