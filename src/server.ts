import WebSocket, {WebSocketServer} from 'ws';
import {addConnection, removeConnection} from './connections.js';
import {ClientRequest, ConnectionId, MessageType} from './types.js';
import {generateConnectionId} from './utils.js';
import {register} from './commands/register.js';
import {createRoom} from './commands/createRoom.js';
import {CommandContext} from './commands/types.js';
import {joinRoom} from './commands/joinRoom.js';

const createServer = (port:number):WebSocketServer => {
    const server = new WebSocketServer({port});
    server.on('connection', (ws:WebSocket) => {
        initializeConnection(server, ws);
    })
    server.on('listening', () => {
        console.log(`server is running: ${JSON.stringify(server.address())}`);
    })
    return server;
}

const initializeConnection = (wss: WebSocketServer, ws:WebSocket) => {
    const connection = addConnection(generateConnectionId(), ws);
    const {id} = connection;
    console.log(`initialize connection: id ${id}`);

    ws.addEventListener('open', (event) => {
        console.log(`open: id ${id}, ${JSON.stringify(event)}`);
    })
    ws.addEventListener('message', (event) => {
        console.log(`received: id ${id}, ${JSON.stringify(event)}`);
        if (typeof event.data === 'string') {
            const message = JSON.parse(event.data) as ClientRequest;
            const context: CommandContext = {
                connectionContext: {server: wss, connection},
                message
            };
            switch (message.type) {
                case MessageType.REGISTER:
                    register(context);
                    break; 
                case MessageType.CREATE_ROOM:
                    createRoom(context);
                    break;
                case MessageType.JOIN_ROOM:
                    joinRoom(context);
                    break;
                default:
                    console.warn(`unrecognised message ${message.type}`);
                    break;
            }
        }
    })
    ws.addEventListener('error', (event) => {
        console.error(`error: id ${id}, ${JSON.stringify(event)}`)
        destroyConnection(id, ws);
    })
    ws.addEventListener('close', ()=> {
        console.log(`closed: id ${id}`)
        destroyConnection(id, ws);
    })
}

const destroyConnection = (id:ConnectionId, ws: WebSocket) => {
    removeConnection(id);
    ws.removeAllListeners();
}

export {createServer};