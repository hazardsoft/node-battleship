import WebSocket from "ws";

export type ConnectionId = string;

export interface Connection {
    id:ConnectionId;
    connection:WebSocket;
}

export const enum MessageType {
    REGISTER = "reg"
}

export type MessageId = string

export type MessageData = string;

export type MessagePayload = object;

export interface ClientRequest {
    type: MessageType,
    id: MessageId,
    data: MessageData
}

export interface ClientResponse {
    type: MessageType,
    id: MessageId,
    data: MessagePayload
}

export interface RegisterRequstPayload {
    name:string;
    password:string;
}

export interface RegisterResponsePayload {
    name:string;
    index: number;
    error: boolean,
    errorText: string,
}