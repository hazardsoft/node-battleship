import {getConnectionByPlayerId} from "../connections.js";
import {getRoomById, startGameInRoom} from "../db/rooms.js";
import {PlayerId, Room} from "../db/types.js";
import {ClientResponse, CreateGamePayload, JoinRoomRequestPayload, MessageType} from "../types.js";
import {Command, CommandContext} from "./types.js";
import WebSocket from 'ws';

export const createGame: Command = (context: CommandContext) => {
    const {connectionContext, message} = context;
    const payload = JSON.parse(message.data) as JoinRoomRequestPayload;
    const roomId = payload.indexRoom;

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
        const opponentId = getOpponentId(room, playerId);
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
const getOpponentId = (room: Room, playerId:PlayerId): PlayerId | null => {
    for (const id of room.playersIds) {
        if (id !== playerId) {
            return id;
        }
    }
    return null;
}