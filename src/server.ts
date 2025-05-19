import WebSocket, {WebSocketServer} from 'ws';
import {addConnection, removeConnection} from './connections.js';
import {ClientRequest, ConnectionId, MessageType} from './types.js';
import {register} from './commands/register.js';
import {createRoom} from './commands/createRoom.js';
import {CommandContext} from './commands/types.js';
import {joinRoom} from './commands/joinRoom.js';
import {addShips} from './commands/addShips.js';
import {attack} from './commands/attack.js';
import {randomAttack} from './commands/randomAttack.js';

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
    const connection = addConnection(ws);
    const {id} = connection;
    console.log(`initialize: connection id (${id})`);

    ws.addEventListener('open', () => {
        console.log(`open: connection id (${id})`);
    })
    ws.addEventListener('message', (event) => {
        if (typeof event.data === 'string') {
            const message = JSON.parse(event.data) as ClientRequest;
            const context: CommandContext = {
                connectionContext: {server: wss, connection},
                message
            };
            console.log(`received: connection id (${id})`);
            console.log(`<-- command '${message.type}', payload ${message.data || null}`);
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
                case MessageType.ADD_SHIPS:
                    addShips(context);
                    break;
                case MessageType.ATTACK:
                    attack(context);
                    break;
                case MessageType.RANDOM_ATTACK:
                    randomAttack(context);
                    break;
                default:
                    console.warn(`unrecognised command '${message.type}'`);
                    break;
            }
        }
    })
    ws.addEventListener('error', (event) => {
        console.error(`error: connection id (${id}), ${JSON.stringify(event)}`)
        destroyConnection(id, ws);
    })
    ws.addEventListener('close', ()=> {
        console.log(`closed: connection id (${id})`)
        destroyConnection(id, ws);
    })
}

const destroyConnection = (id:ConnectionId, ws: WebSocket) => {
    removeConnection(id);
    ws.removeAllListeners();
}

export {createServer};