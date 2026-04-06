/* //snesUILab/modules/engine.js */

/**
 * Rendering Engine
 * Frame Scheduler
 * Timing System
 * Display Driver
 * Video Output Device
 * Pixel Renderer
 * Retro Rendering Mode
 */
export const canvas = document.getElementById("gameScreen");
export const ctx = canvas.getContext("2d");
ctx.imageSmoothingEnabled = false

// Internal retro resolution
canvas.width = 320;
canvas.height = 180;

// Game loop control
let lastTime = 0;

export function startLoop(update, render) {

    function gameLoop(timestamp) {

        const deltaTime = Math.min(
            (timestamp - lastTime) / 1000,
            0.1
            );

        lastTime = timestamp;

        update(deltaTime);
        render();

        requestAnimationFrame(gameLoop);
    }

    requestAnimationFrame(gameLoop);
}