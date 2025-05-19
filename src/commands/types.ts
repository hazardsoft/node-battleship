import {ClientRequest, ConnectionContext} from "../types.js";

export interface CommandContext {
    connectionContext: ConnectionContext,
    message: ClientRequest
}

export type Command = (context: CommandContext) => void
