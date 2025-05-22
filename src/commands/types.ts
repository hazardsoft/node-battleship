import type {ClientRequest, ConnectionContext} from "../types";

export interface CommandContext {
    connectionContext: ConnectionContext,
    message: ClientRequest
}

export type Command = (context: CommandContext) => void
