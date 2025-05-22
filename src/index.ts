import {env} from "node:process";
import {createServer} from "./server";

const port = Number(env.PORT) || 3000;
createServer(port);