import WebSocket from "ws";
import {GameId, PlayerId, RoomId} from "./db/types.js";

export type ConnectionId = string;

export interface Connection {
    id: ConnectionId;
    socket: WebSocket;
    playerId?: PlayerId;
}

export const enum MessageType {
    REGISTER = "reg",
    CREATE_ROOM = "create_room",
    UPDATE_ROOMS = "update_room",
    JOIN_ROOM = "add_user_to_room",
    CREATE_GAME = "create_game"
}

export type MessageId = number

export type MessageData = string;

export type MessagePayload = object;

export interface ClientRequest {
    type: MessageType,
    id: MessageId,
    data: MessageData
}

export type ClientResponse = ClientRequest;

export interface RegisterRequstPayload {
    name: string;
    password: string;
}

export interface RegisterResponsePayload {
    name: string;
    index: PlayerId;
    error: boolean,
    errorText: string,
}

export type CreateRoomRequestPayload = never;

export interface RoomUserPayload {
    name: string,
    index: PlayerId,
}

export interface RoomPayload  {
    roomId: RoomId,
    roomUsers: RoomUserPayload[],
}

export type UpdateRoomsResponsePayload = RoomPayload[]

export interface JoinRoomRequestPayload {
    indexRoom: RoomId
}

export interface CreateGamePayload {
    idGame: GameId,  
    idPlayer: PlayerId // opponent's id
}