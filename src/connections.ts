import WebSocket from 'ws';
import {Connection, ConnectionId} from "./types.js";

const connectionsById: Map<ConnectionId, WebSocket> = new Map();
const connections: Map<WebSocket, ConnectionId> = new Map();

const addConnection = (id:ConnectionId, connection:WebSocket):Connection => {
    connectionsById.set(id, connection);
    connections.set(connection, id);
    return {
        id, socket: connection
    }
}

const removeConnection = (id:ConnectionId) => {
    const connectionExist = connectionsById.delete(id);
    if (!connectionExist) {
        console.warn(`connection ${id} does not exist`);
    }
}

const getConnectionById = (id:ConnectionId):Connection | null => {
    if (connectionsById.has(id)) {
        return {
            id, socket: connectionsById.get(id)!
        }
    }
    return null;
}

const getConnectionBySocket = (ws:WebSocket):Connection | null => {
    if (connections.has(ws)) {
        return {
            id: connections.get(ws)!, socket: ws
        }
    }
    return null;
}

export {addConnection, removeConnection, getConnectionById, getConnectionBySocket};