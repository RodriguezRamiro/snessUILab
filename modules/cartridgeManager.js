/* //snesUILab/modules/cartridgeManager.js */

import { snake } from "./games/snake.js";
import { flightSim } from "./games/flightSim.js";
import { pong } from "./games/pong.js";
import { survivalArena } from "./games/survivalArena.js";

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

export function loadGame(index) {
    if (currentGame && currentGame.destroy) {
        currentGame.destroy();
    }

    currentGame = cartridges[index];

    if (currentGame.init) {
        currentGame.init();
    }
}

export function updateGame(dt) {
    if (currentGame && currentGame.update) {
        currentGame.update(dt);
    }
}

export function renderGame(ctx) {
    if (currentGame && currentGame.render) {
        currentGame.render(ctx);
    }
}