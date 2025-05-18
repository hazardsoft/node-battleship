import {ClientRequest, ClientResponse, RegisterRequstPayload, RegisterResponsePayload} from "@src/types.js";
import {Command, ConnectionContext} from "./types.js";
import {registerPlayer} from "../db/players.js";

export const register: Command = (context: ConnectionContext, message: ClientRequest) => {
    const {name, password} = JSON.parse(message.data) as RegisterRequstPayload;
    registerPlayer(name, password);
    
    const response: ClientResponse = {
        id: message.id,
        type: message.type,
        data: JSON.stringify({
            name,
            index: 0,
            error: false,
            errorText: ''
        } satisfies RegisterResponsePayload),
    }
    context.connection.socket.send(JSON.stringify(response));
}