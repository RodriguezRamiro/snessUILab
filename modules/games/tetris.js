/* //snesUILab/modules/games/survivalArena.js */

let block ;

let tileSize = 10;
let fallTimer = 0;
let fallInterval = 0.5;

export const tetris = {
    name: "Tetris",

    init() {
        console.log("Tetris starting...");

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

        ctxRect(
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