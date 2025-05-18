import {ClientRequest, Connection} from "../types.js";
import {WebSocketServer} from "ws";

export interface CommandContext {
    connectionContext: ConnectionContext,
    message: ClientRequest
}

export interface ConnectionContext {
    server: WebSocketServer,
    connection: Connection
}

export type Command = (context: CommandContext) => void