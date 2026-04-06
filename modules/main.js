/* //snesUILab/modules/main.js */


/**
 * Engine   → game loop + rendering surface
 * Input    → controller interface
 * Game     → cartridge payload
 */

import { startLoop, ctx } from "./engine.js";
import { initInput, updateGamepad } from "./input.js";
import { flightSim } from "./games/flightSim.js";

let currentGame = null;

function update(dt){
    if(currentGame) {
        currentGame.update(dt);

        if(currentGame) {
            currentGame.update(dt);
        }
    }
}

function render() {
    ctx.fillStyle = "#000";
    ctx.fillRect(0,0,320,180);

    if (currentGame){
        currentGame.render();
    }
}

function startGame() {
    currentGame = flightSim;
    currentGame.init();
}

initInput();
startGame();

startLoop(update, render);