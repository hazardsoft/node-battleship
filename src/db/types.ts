import type {Ship} from "../types";

export type PlayerId = string;

export interface Player {
    id: PlayerId,
    username: string,
    password:string
}

export type RoomId = string;

export type GameId = string;

export interface Room {
    id: RoomId,
    gameId?: GameId,
    playersIds: PlayerId[],
}