/* //snesUILab/modules/main.js */


/**
 * Engine   → game loop + rendering surface
 * Input    → controller interface
 * Game     → cartridge payload
 */

import { startLoop, ctx } from "./engine.js";
import { initInput, } from "./input.js";
import { initSystem } from "./systemManager.js";

import { initUI, triggerGameOver } from './uiManger.js";

import { on } from "./eventBus.js";
import {
    getGameList,
    loadGame,
    updateGame,
    renderGame
} from "./cartridgeManager.js";
import { getStateValue } from "./gameState.js";


// Engine Loop
function update(dt){
    updateGame(dt);
}

function render() {
    ctx.fillStyle = "#000";
    ctx.fillRect(0,0,320,180);

    // Pause overlay Visual Confirmation
    if (getStateValue("paused")) {

        ctx.fillStyle = "white";
        ctx.font = "10px monospace";

        ctx.fillText(
            "PAUSED",
            130,
            90,
        );
    }
}

// System Initialization

initInput();

initSystem();

initUI(
    getGameList(),
    loadGame
);

// System Events

on(
    "gameOver",
    triggerGameOver
);


// Load first cartridge
loadGame(0);

// Start Engine
startLoop(
    update,
    render
);