import {Ship} from "../../types.js";

const isPositionBelongToShip = (ship:Ship, position: {x: number, y: number}):boolean => {
    const {x, y} = position;
    if (ship.direction) {
        return x === ship.position.x && y >= ship.position.y && y <= ship.position.y + ship.length - 1;
    } else {
        return y === ship.position.y && x >= ship.position.x && x <= ship.position.x + ship.length - 1;
    }
}

const getCellByPosition = (cells: Cell[], position: {x:number, y:number}):Cell => {
    const size = Math.sqrt(cells.length);
    const cell = cells[position.x + position.y * size];
    if (!cell) {
        throw new Error(`invalid cell position: ${JSON.stringify(position)}`)
    }
    return cell;
}

const getAvailableCells = (cells: Cell[]):Cell[] => {
    return cells.filter(cell => !cell.isOpen);
}

const getPositionsAroundShip = (ship:Ship):{x:number, y:number}[] => {
    const startX = Math.max(ship.position.x - 1, 0);
    const startY = Math.max(ship.position.y - 1, 0);
    const endX = Math.min(ship.direction ? ship.position.x + 1 : ship.position.x + ship.length, SHIP_COUNT - 1);
    const endY = Math.min(ship.direction ? ship.position.y + ship.length : ship.position.y + 1, SHIP_COUNT - 1);
    
    const positions = [];
    for (let x = startX; x <= endX; x++) {
        for (let y = startY; y <= endY; y++) {
            if (!isPositionBelongToShip(ship, {x, y})) {
                positions.push({x, y});
            }
        }
    }
    return positions;
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

    public getHitResult(position: {x:number, y:number}): "miss" | "killed" | "shot" {
        const {x, y} = position;
        for (const ship of this.ships) {
            const cell = this.cells.find(cell => cell.position.x === x && cell.position.y === y);
            if (cell) cell.isOpen = true;
            if (isPositionBelongToShip(ship, position)) {
                return this.isShipKilled(ship) ? "killed" : "shot";
            }
        }
        return "miss";
    }

    public openCellsAroundShip(position: {x:number, y:number}):{x:number, y:number}[] {
        for (const ship of this.ships) {
            if (isPositionBelongToShip(ship, position)) {
                const positions = getPositionsAroundShip(ship);
                positions.forEach(position => {
                    const cell = getCellByPosition(this.cells, position);
                    if (cell) cell.isOpen = true
                })
                return positions;
            }
        }
        return [];
    }

    public isShipKilled(ship:Ship):boolean {
        let killedCellCounter = 0;
        let positions: {x: number, y:number}[] = [];
        if (ship.direction) {
            positions = Array.from({length: ship.length}, (_, index) => ({x: ship.position.x, y: ship.position.y + index}))
        } else {
            positions = Array.from({length: ship.length}, (_, index) => ({x: ship.position.x + index, y: ship.position.y}))
        }
        positions.forEach(position => {
            const cell = getCellByPosition(this.cells, position);
            killedCellCounter += cell.isOpen ? 1 : 0;
        })
        return killedCellCounter === ship.length;
    }

    public getRandomCell():Cell {
        const availableCells = getAvailableCells(this.cells);
        const randomIndex = Math.ceil(Math.random() * (availableCells.length - 1));
        return availableCells[randomIndex];
    }

    public isPlacedShips():boolean {
        return this.ships.length === SHIP_COUNT;
    }

    public isAllShipsKilled():boolean {
        let killedShipsCounter = 0;
        this.ships.forEach(ship => {
            if (this.isShipKilled(ship)) killedShipsCounter++;
        })
        return killedShipsCounter === SHIP_COUNT;
    }
}