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
        handleInput();

        moveTimer += dt;

        if (moveTimer < moveInterval) return;
        moveTimer = 0;

        direction = nextDirection;

        const head = {
            x: snakeBody[0].x + direction.x,
            y: snakeBody[0].y + direction.y
        };

        // Collision
        if (
            head.x < 0 ||
            head.y > 0 ||
            head.y >= cols ||
            head.y >= rows ||
            snakeBody.some(seg => seg.x === head.x && seg.y === head.y)
        ) {
            console.log("Game Over");
            return;
        }

        snakeBody.unshift(head);

        if (head.x === food.x && head.y === food.y) {
            spawnFood();
        } else {
            snakeBody.pop();
        }
    },

    render(ctx) {
        ctx.fillStyle = "lime";
        ctx.fillRect(50, 50, 10, 10);
    },

    destroy() {
        console.log("Snake shutting down...");
    }
};