/* //snesUILab/modules/games/survivalArena.js */

const COLS = 10
const ROWS = 18
const TILE_SIZE = 10;

let board = [];


let currentBlock = null;

let fallTimer = 0;
let fallInterval = 0.5;

export const tetris = {
    name: "Tetris",

    init() {
        console.log("Tetris starting...");

        // Create Empty Board
        board = [];

        for (let y = 0; y < ROWS; y++)

        board[y] = [];

        for (let x = 0; x < COLS; x++) {

            board[y][x] = 0
        }
    }

    spawnBlock();

    flassTimer = 0;

        block = {
            x: 15,
            y: 0
        };

        fallTimer = 0;
    },

    update(dt) {

        fallTimer += dt;

        if (fallTimer >= fallInterval) {
            block.y++;

            fallTimer = 0;
        }
    },

    render(ctx) {

        // Clear Screen
        ctx.fillStyle = "black";

        ctx.fillRect(
            0,
            0,
            ctx.canvas.width,
            ctx.canvas.height
        );

        // Draw Falling block
        ctx.fillStyle = "cyan";

        ctx.fillRect(
            block.x* tileSize,
            block.y * tileSize,
            tileSize,
            tileSize
        );
    },

    destroy() {

        console.log("Tetris shutting down...");
    }

};