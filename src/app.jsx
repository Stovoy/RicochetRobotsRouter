import {render} from "./renderer";

class Space {
    constructor(properties) {
        this.west = null;
        this.north = null;
        this.east = null;
        this.south = null;

        for (let property of properties) {
            if (typeof property === "string") {
                switch (property) {
                    case "west":
                        this.westWall = true;
                        break;
                    case "north":
                        this.northWall = true;
                        break;
                    case "east":
                        this.eastWall = true;
                        break;
                    case "south":
                        this.southWall = true;
                        break;
                    case "solid":
                        this.solid = true;
                }
            } else {
                this.shape = property.shape;
                this.color = property.color;
            }
        }
    }
}

function parseBoard(board) {
    const height = board.length;
    const width = board[0].length;

    // Create spaces.
    const spaces = [];
    for (let y = 0; y < height; y++) {
        const row = [];
        for (let x = 0; x < width; x++) {
            row.push(new Space(board[y][x]));
        }
        spaces.push(row);
    }

    // Set pointers in spaces.
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            if (x > 0) {
                spaces[y][x].west = spaces[y][x - 1];
            }
            if (x < width - 1) {
                spaces[y][x].east = spaces[y][x + 1];
            }
            if (y > 0) {
                spaces[y][x].north = spaces[y - 1][x];
            }
            if (y < height - 1) {
                spaces[y][x].south = spaces[y + 1][x];
            }
        }
    }

    return spaces;
}

const board = require('../assets/board.json');
const spaces = parseBoard(board);

render(spaces);
