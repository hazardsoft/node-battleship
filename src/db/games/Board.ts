import {Ship} from "../../types.js";

const isPositionBelongToShip = (ship:Ship, position: {x: number, y: number}):boolean => {
    const {x, y} = position;
    if (ship.direction) {
        return x === ship.position.x && y >= ship.position.y && y <= ship.position.y + ship.length - 1;
    } else {
        return y === ship.position.y && x >= ship.position.x && x <= ship.position.x + ship.length - 1;
    }
}

interface Cell {
    position: {
        x:number,
        y:number
    },
    isOpen: boolean
}

const SHIP_COUNT = 10;

export class Board {
    private readonly cells: Cell[] = [];
    private readonly ships: Ship[] = [];

    constructor(size: number) {
        this.cells = Array.from({length: size * size}, (_, index) => {
            return {
                position: {
                    x: index % size,
                    y: Math.floor(index / size),
                },
                isOpen: false
             };
        })
    }

    public addShips(ships: Ship[]):void {
        this.ships.push(...ships);
    }

    public getShips():Ship[] {
        return this.ships.slice();
    }

    public isHit(position: {x:number, y:number}): boolean {
        const {x, y} = position;
        for (const ship of this.ships) {
            const cell = this.cells.find(cell => cell.position.x === x && cell.position.y === y);
            if (cell) cell.isOpen = true;
            if (isPositionBelongToShip(ship, position)) {
                return true;
            }
        }
        return false;
    }

    public isFull():boolean {
        return this.ships.length === SHIP_COUNT;
    }
}