interface Player {
    username: string,
    password:string;
}

const players: Map<string, Player> = new Map();

const registerPlayer = (username:string, password:string) => {
    players.set(username, {
        username, password
    })
}

export {registerPlayer}