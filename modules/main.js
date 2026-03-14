/* //snesUILab/modules/main.js */

import { startLoop, ctx } from "./engine";
import { initInput } from "./input.js";
import { flightSim } from "./games/flightSim.js";

let currentGame = null;

function update(dt){
    if(currentGame) {
        currentGame.update(dt);
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