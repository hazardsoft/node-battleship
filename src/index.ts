import {env} from "process";
import {createServer} from "./server.js";

const port = Number(env.PORT) || 3000;
createServer(port);