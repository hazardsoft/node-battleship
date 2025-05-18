import WebSocket, {WebSocketServer} from "ws";
import {GameId, Player, PlayerId, RoomId} from "./db/types.js";

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
    CREATE_GAME = "create_game",
    ADD_SHIPS = "add_ships",
    START_GAME = "start_game",
    CHANGE_TURN = "turn",
    ATTACK = "attack",
    RANDOM_ATTACK = "randomAttack",
    FINISH_GAME = "finish"
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

export interface ConnectionContext {
    server: WebSocketServer,
    connection: Connection
}

export interface RegisterRequestPayload {
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

export interface Ship {
    position: {
        x: number,
        y: number,
    },
    direction: boolean,
    length: number,
    type: "small"|"medium"|"large"|"huge"
}

export interface AddShipsRequestPayload {
    gameId: GameId,
    ships: Ship[],
    indexPlayer: PlayerId
}

export interface StartGamePayload {
    currentPlayerIndex: PlayerId,
    ships: Ship[]
}

export interface TurnPayload {
    currentPlayer: PlayerId
}

export interface AttackRequestPayload {
    gameId: GameId,
    x: number,
    y: number,
    indexPlayer: PlayerId
}

export interface AttackPayload {
    position: {
        x: number,
        y: number
    },
    currentPlayer: PlayerId,
    status: "miss" | "killed" | "shot",
}

export interface RandomAttackRequestPayload {
    gameId: GameId,
    indexPlayer: PlayerId
}

export interface FinishGamePayload {
    winPlayer: PlayerId;
}