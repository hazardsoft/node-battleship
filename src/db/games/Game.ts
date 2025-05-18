import {GameId, PlayerId} from "../types.js";
import {Board} from "./Board.js";

const FIELD_SIZE = 10;

export class Game {
    public currentPlayerId?: PlayerId;
    private boards: Map<PlayerId, Board> = new Map();

    constructor(public gameId: GameId, public playerIds: PlayerId[]) {
        playerIds.forEach(playerId => {
            const board = new Board(FIELD_SIZE);
            this.boards.set(playerId, board);
        })
    }

    public getBoard(playerId:PlayerId):Board | null {
        return this.boards.get(playerId) ?? null;
    }

    public isReady():boolean {
        let fullBoardsCounter = 0;
        this.boards.values().forEach(board => {
            if (board.isFull()) fullBoardsCounter++;
        })
        return fullBoardsCounter === 2;
    }
}