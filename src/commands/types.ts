import {ClientRequest, Connection} from "@src/types.js";
import {WebSocketServer} from "ws";

export interface ConnectionContext {
    server: WebSocketServer,
    connection: Connection
}

export type Command = (context: ConnectionContext, message: ClientRequest) => void