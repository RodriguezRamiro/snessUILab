/* //snesUILab/modules/games/snake.js */

import { keys } from "../input.js";

let snakeBody;
let direction;
let nextDirection;
let food;

let tileSize = 10;
let cols, rows;

let moveTimer = 0;
let moveInterval = 0.1; // controls speed

export const snake = {
    name: "Snake",

    init() {
        console.log( "Snake staring..." );
    },

    update(dt) {
        // game logic here later
    },

    render(ctx) {
        ctx.fillStyle = "lime";
        ctx.fillRect(50, 50, 10, 10);
    },

    destroy() {
        console.log("Snake shutting down...");
    }
};