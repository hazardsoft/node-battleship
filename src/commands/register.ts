import {ClientResponse, RegisterRequestPayload, RegisterResponsePayload} from "../types.js";
import {Command, CommandContext} from "./types.js";
import {hasPlayer, loginPlayer, registerPlayer} from "../db/players.js";
import {Player} from "../db/types.js";
import {updateWinners} from "../notifications/updateWinners.js";

export const register: Command = (context: CommandContext) => {
    const {connectionContext, message} = context;

    const {name, password} = JSON.parse(message.data) as RegisterRequestPayload;
    const isPlayerExist = hasPlayer(name);
    let player: Player | null = null;
    if (isPlayerExist) {
        player = loginPlayer(name, password);
    } else {
        player = registerPlayer(name, password);
    }

    if (player) {
        connectionContext.connection.playerId = player.id;

        const response: ClientResponse = {
            id: message.id,
            type: message.type,
            data: JSON.stringify({
                name,
                index: player.id,
                error: false,
                errorText: '',
            } satisfies RegisterResponsePayload),
        }
        connectionContext.connection.socket.send(JSON.stringify(response));
    
        // send actual winners table to the logged in user only
        updateWinners({connectionContext, payload: {currentUserId: player.id}})
    } else {
        const response: ClientResponse = {
            id: message.id,
            type: message.type,
            data: JSON.stringify({
                name,
                index: '',
                error: true,
                errorText: 'incorrect credentials'
            } satisfies RegisterResponsePayload),
        }
        connectionContext.connection.socket.send(JSON.stringify(response));
    }
}