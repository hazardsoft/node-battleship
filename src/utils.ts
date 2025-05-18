import {ConnectionId} from "./types.js";

let counter = 0;

const generateConnectionId = ():ConnectionId => {
    return `connection_${counter++}`;
}

export {generateConnectionId};