import WebSocket from "ws";

export type ConnectionId = string;

export interface Connection {
    id:ConnectionId;
    connection:WebSocket;
}