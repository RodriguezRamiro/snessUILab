/* //snesUILab/modules/cartridgeManager.js */

/**
 * Game registry
 * Game loading
 * Game switching
 * Game lifecycle
 * Game update/render delegation
 */

import { snake } from "./games/snake.js";
import { flightSim } from "./games/flightSim.js";
import { pong } from "./games/pong.js";
import { survivalArena } from "./games/survivalArena.js";
import { emit } from "./eventBus.js";

export const cartridges = [
    snake,
    flightSim,
    pong,
    survivalArena
];

let currentGame = null;

export function getGameList() {
    return cartridges.map(game => game.name);
}

function safeDestroy(game) {

    try {

        if (game && game.destroy) {
            game.destroy();
        }
    } catch (err) {
        console.error(
            "Cartridge destroy failed:",
            err
        );
    }
}

export function loadGame(index) {
    safeDestroy(currentGame)

    if (!cartridges[index]) {
        console.error("Invalid cartridge index:", index);
        return;
    }

    currentGame = cartridges[index];

    if (currentGame.init) {
        currentGame.init();
    }

    emit("gameLoaded", index);
}

export function updateGame(dt) {
    if (currentGame && currentGame.update) {
        currentGame.update(dt);
    }
}

export function renderGame(ctx) {
    if (currentGame && currentGame.render) {
        currentGame.render(ctx);
    } else

    ctx.fillStyle = "#00ff88";
    ctx.font = "8px monospace";

    ctx.fillText(
        "NO CARTRIDGE",
        110,
        90,
    );
};