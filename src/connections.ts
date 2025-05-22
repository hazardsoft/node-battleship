import WebSocket from 'ws';
import type {Connection, ConnectionId} from "./types";
import type {PlayerId} from './db/types';
import {generateConnectionId} from './utils';

const connections: Map<ConnectionId, Connection> = new Map();

const addConnection = (ws:WebSocket):Connection => {
    const connection: Connection = {
        id: generateConnectionId(),
        socket: ws
    };
    connections.set(connection.id, connection);
    return connection;
}

const removeConnection = (id:ConnectionId) => {
    const connectionExist = connections.delete(id);
    if (!connectionExist) {
        console.warn(`connection id (${id}) does not exist`);
    }
}

const getConnectionByPlayerId = (playerId:PlayerId): Connection | null => {
    for (const connection of connections.values()) {
        if (connection.playerId === playerId) return connection;
    }
    return null;
}

export {addConnection, removeConnection, getConnectionByPlayerId};