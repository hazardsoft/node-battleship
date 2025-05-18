import {ClientRequest, ClientResponse, RegisterRequstPayload, RegisterResponsePayload} from "@src/types.js";
import {Command, ConnectionContext} from "./types.js";
import {hasPlayer, loginPlayer, registerPlayer} from "../db/players.js";
import {Player} from "@src/db/types.js";

export const register: Command = (context: ConnectionContext, message: ClientRequest) => {
    const {name, password} = JSON.parse(message.data) as RegisterRequstPayload;
    const isPlayerExist = hasPlayer(name);
    let player: Player | null = null;
    if (isPlayerExist) {
        player = loginPlayer(name, password);
    } else {
        player = registerPlayer(name, password);
    }
    
    const response: ClientResponse = {
        id: message.id,
        type: message.type,
        data: JSON.stringify({
            name,
            index: 0,
            error: !player,
            errorText: player ? '' : 'incorrect credentials'
        } satisfies RegisterResponsePayload),
    }
    context.connection.socket.send(JSON.stringify(response));
}