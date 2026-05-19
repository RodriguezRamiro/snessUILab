/* //snesUILab/modules/games/snake.js */

import { keys } from "../input.js";
import { emit } from "../eventBus.js";

let snakeBody;
let direction;
let nextDirection;
let canTurn = true;
let food;
let score = 0;

let tileSize = 10;
let cols, rows;

let moveTimer = 0;
let moveInterval = 0.1; // controls speed

let isGameOver = false;

export const snake = {
    name: "Snake",

    init({ canvas }) {
        console.log("Snake starting...");

        isGameOver = false;

        cols = Math.floor(canvas.width / tileSize);
        rows = Math.floor(canvas.height / tileSize);

        snakeBody = [{ x: 10, y: 10 }];
        direction = { x: 1, y: 0 };
        nextDirection = { x: 1, y: 0 };

        canTurn = true;

        score = 0;
        moveInterval = 0.1;
        moveTimer = 0;

        spawnFood();
    },

    update(dt) {

        //Freeze Game after collsion
        if (isGameOver)  return;

        handleInput();

        moveTimer += dt;

        if (moveTimer < moveInterval) return;
        moveTimer -= moveInterval;

        direction = nextDirection;
        canTurn = true

        const head = {
            x: snakeBody[0].x + direction.x,
            y: snakeBody[0].y + direction.y
        };

        // Collision
        const collided = (
            head.x < 0 ||
            head.y < 0 ||
            head.x >= cols ||
            head.y >= rows ||
            snakeBody.some(seg => seg.x === head.x && seg.y === head.y)
        );
            if (collided) {
                isGameOver = true;
                emit("gameOver", { score });

            return;
        }

        // Move Snake
        snakeBody.unshift(head);

        // Food Collision
        if (head.x === food.x && head.y === food.y) {
            score++;

            // Speed Increase
            moveInterval = Math.max(0.03, moveInterval *= 0.95);
            spawnFood();
        } else {
            snakeBody.pop();
        }
    },

    render(ctx) {


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

    // Food Border
    ctx.strokeStyle = "white";
    ctx.strokeRect(
        food.x * tileSize,
        food.y * tileSize,
        tileSize,
        tileSize
    );

    // Score Rendering
    ctx.fillStyle = "white";
    ctx.font = "16px monospace";
    ctx.fillText(`Score: ${score}`, 10, 20);
    },


    destroy() {
    console.log("Snake shutting down...");

    }
};


// Input (uses your system)

function handleInput() {
    if (!canTurn) return;

    if (keys["w"] || keys["arrowup"]) {
        if (direction.y !== 1)
        nextDirection = {x: 0, y: -1 };
        canTurn = false;
    }

    if (keys["s"] || keys["arrowdown"]) {
        if (direction.y !== -1)
        nextDirection = { x: 0, y: 1 };
        canTurn = false;
    }

    if(keys["a"] || keys["arrowleft"]) {
        if(direction.x !== 1) {
        nextDirection = { x: -1, y: 0};

        canTurn = false;
    }
}

    if (keys["d"] || keys["arrowright"]) {

        if(direction.x !== -1) {
        nextDirection = { x: 1, y: 0};

        canTurn = false;
        }
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