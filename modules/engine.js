/* //snesUILab/modules/engine.js */

const canvas = document.getElementById("gameScreen");
const ctx = canvas.getContext("2d");
ctx.imageSmoothingEnabled = false

// Internal retro resolution
canvas.width = 320;
canvas.height = 180;

// Game loop control
let lastTime = 0;

export function startLoop(update, render) {

    function gameLoop(timestamp) {

        const deltaTime = (timestamp - lastTime) / 1000;
        lastTime = timestamp;

        update(deltaTime);
        render();

        requestAnimationFrame(gameLoop);
    }

    requestAnimationFrame(gameLoop);
}