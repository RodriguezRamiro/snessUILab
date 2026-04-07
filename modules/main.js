/* //snesUILab/modules/main.js */


/**
 * Engine   → game loop + rendering surface
 * Input    → controller interface
 * Game     → cartridge payload
 */

import { startLoop, ctx } from "./engine.js";
import { initInput, updateGamepad } from "./input.js";
import { flightSim } from "./games/flightSim.js";

import { initInput } from "./input.js";
import { on } from "./eventBus.js";
import { triggerGameOver } from "./uiManager.js";

import {
    getGameList,
    loadGame,
    updateGame,
    renderGame
} from "./cartridgeManager.js";
import { getStateValue } from "./gameState.js";


let currentGame = null;

// Engine Loop
function update(dt){

    if (getStateValue("paused")) {
        return;
    }
    updateGame(dt);
}

function render() {
    ctx.fillStyle = "#000";
    ctx.fillRect(0,0,320,180);

    renderGame(ctx);
}

// System Initialization

initInput();

initUI(
    getGameList(),
    loadGame
);

// System Events

on(
    "gameOver",
    triggerGameOver
);



// Start Engine
startLoop(
    update,
    render
);