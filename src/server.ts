import WebSocket, {WebSocketServer} from 'ws';
import {addConnection, removeConnection} from './connections.js';
import {ConnectionId} from './types.js';
import {generateConnectionId} from './utils.js';

const createServer = (port:number):WebSocketServer => {
    const server = new WebSocketServer({port});
    server.on('connection', (ws:WebSocket) => {
        initializeConnection(ws);
    })
    server.on('listening', () => {
        console.log(`server is running: ${JSON.stringify(server.address())}`);
    })
    return server;
}

const initializeConnection = (ws:WebSocket) => {
    const {id, connection} = addConnection(generateConnectionId(), ws);
    console.log(`initialize connection: id ${id}`);

    ws.addEventListener('open', (event) => {
        console.log(`open: id ${id}, ${JSON.stringify(event)}`);
    })
    ws.addEventListener('message', (event) => {
        console.log(`received: id ${id}, ${JSON.stringify(event)}`);
    })
    ws.addEventListener('error', (event) => {
        console.error(`error: id ${id}, ${JSON.stringify(event)}`)
        destroyConnection(id, connection);
    })
    ws.addEventListener('close', ()=> {
        console.log(`closed: id ${id}`)
        destroyConnection(id, connection);
    })
}

const destroyConnection = (id:ConnectionId, ws: WebSocket) => {
    removeConnection(id);
    ws.removeAllListeners();
}

export {createServer};