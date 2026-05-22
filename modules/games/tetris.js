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

        for (let y = 0; y < ROWS; y++) {

        board[y] = [];

        for (let x = 0; x < COLS; x++) {

            board[y][x] = 0
        }
    }

    spawnBlock();

    fallTimer = 0;
},

    update(dt) {

        fallTimer += dt;

        if (fallTimer >= fallInterval) {

            moveBlockDown();

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

        // Draw Board
        for (let y = 0; y < ROWS; y++) {

            for (let x = 0; x < COLS; x++) {

                if (board[y][x]) {

                    ctx.fillStyle = "cyan",

                    ctx.fillRect(
                        x * TILE_SIZE,
                        y * TILE_SIZE,
                        TILE_SIZE,
                        TILE_SIZE
                    );
            }

        // Grid Lines
        ctx.strokeStyle = "#111";

        ctx.strokeRect(
            x * TILE_SIZE,
            y * TILE_SIZE,
            TILE_SIZE,
            TILE_SIZE
        );
    }
}
    // Draw Active Block
    if (currentBlock) {

        ctx.fillStyle = "cyan";

        ctx.fillRect(
            currentBlock.x * TILE_SIZE,
            currentBlock.y * TILE_SIZE,
            TILE_SIZE,
            TILE_SIZE
        );

    }
},

    destroy() {

        console.log("Tetris shutting down...");
    }
};

/* Block System */

function spawnBlock() {

    currentBlock = {

        x: Math.floor(COLS / 2),

        y: 0
    };
}

function moveBlockDown() {

    // Colission with floor

    if (currentBlock.y >= ROWS - 1) {

        lockBlock();

        return;
    }

    // Collision with settled blocks

    if (
        board[currentBlock.y + 1][currentBlock.x]
    ){
        lockBlock();

        return;
    }

    currentBlock.y++;
}

function lockBlock() {
    board[currentBlock.y][currentBlock.x] = 1;

    spawnBlock();
}