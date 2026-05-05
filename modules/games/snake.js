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

    init(canvas) {
        console.log("Snake staring...");

        cols = Math.floor(canvas.width / tileSize);
        rows = Math.floor(canvas.height / tileSize);

        snakeBody = [{ x: 10, y: 10 }];
        direction = { x: 1, y: 0 };
        nextDirection = { x: 1, y: 0 };

        spawnFood();
    },

    update(dt) {
    },

    render(ctx) {
        ctx.fillStyle = "lime";
        ctx.fillRect(50, 50, 10, 10);
    },

    destroy() {
        console.log("Snake shutting down...");
    }
};