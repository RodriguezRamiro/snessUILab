/* //snesUILab/modules/games/snake.js */

import { keys } from "../input.js";
import { emit } from "../eventBus.js";

let snakeBody;
let direction;
let nextDirection;
let food;
let score = 0;

let tileSize = 10;
let cols, rows;

let moveTimer = 0;
let moveInterval = 0.1; // controls speed

let isGameOver = false

export const snake = {
    name: "Snake",

    init(canvas) {
        console.log("Snake staring...");

        isGameOver = false;

        cols = Math.floor(canvas.width / tileSize);
        rows = Math.floor(canvas.height / tileSize);

        snakeBody = [{ x: 10, y: 10 }];
        direction = { x: 1, y: 0 };
        nextDirection = { x: 1, y: 0 };

        score = 0;
        moveInterval = 0.1;
        moveTimer = 0;

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
            head.y < 0 ||
            head.x >= cols ||
            head.y >= rows ||
            snakeBody.some(seg => seg.x === head.x && seg.y === head.y)
        ) {
            if (!isGameOver) {
                isGameOver = true;
                emit("gameOver", { score });
            }
            return;
        }

        snakeBody.unshift(head);

        if (head.x === food.x && head.y === food.y) {
            score++;
            moveInterval *= 0.95;
            spawnFood();
        } else {
            snakeBody.pop();
        }
    },

    render(ctx) {

        // Clear
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        // Snake
        ctx.fillStyle = "lime";
        snakeBody.forEach( seg => {
            ctx.fillRect(
            seg.x * tileSize,
            seg.y * tileSize,
            tileSize,
            tileSize
        );
    });

    // Food
    ctx.fillStyle = "red";
    ctx.fillRect(
        food.x * tileSize,
        food.y * tileSize,
        tileSize,
        tileSize
    );
    console.log("FOOD:", food);
    },

    destroy() {
        console.log("Snake shutting down...");
    }
};

// Input (uses your system)

function handleInput() {
    if (keys["w"] || keys["arrowup"]) {
        if (direction.y !== 1)
        nextDirection = {x: 0, y: -1 };
    }

    if (keys["s"] || keys["arrowdown"]) {
        if (direction.y !== -1)
        nextDirection = { x: 0, y: 1 };
    }

    if(keys["a"] || keys["arrowleft"]) {
        if(direction.x !== 1)
        nextDirection = { x: -1, y: 0};
    }

    if (keys["d"] || keys["arrowright"]) {

        if(direction.x !== -1)
        nextDirection = { x: 1, y: 0};
    }
}

// Helper

function spawnFood() {
    let valid = false;

    while (!valid) {
        const newFood = {
        x: Math.floor(Math.random() * cols),
        y: Math.floor(Math.random() * rows)
    };

    const onSnake = snakeBody.some(
        seg => seg.x === newFood.x && seg.y === newFood.y
    );

    if (!onSnake) {
        food = newFood;
        valid = true;
    }
}
}