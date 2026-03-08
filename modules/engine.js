/* //snesUILab/modules/engine.js */

export const canvas = document.getElementById("gameScreen");
export const ctx = canvas.getContext("2d");

canvas.width = 320;
canvas.height = 180;

ctx.imageSmoothingEnabled = false;

let lastTime = 0;

export function startLoop(update, render) {

    function gameLoop(timestamp) {

        const dt = (timestamp - lastTime) / 1000;
        lastTime = timestamp;

        update(dt);
        render();

        requestAnimationFrame(gameLoop);
    }

    requestAnimationFrame(gameLoop);
}