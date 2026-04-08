/* //snesUILab/modules/systemManage.js */

import { on } from "./eventBus.js";
import { resetGameState } from "./gameState.js";
import { loadGame } from "./cartridgeManager.js";

let currentIndex = 0;

export function initSystem() {

    // Game Over

    on("gameOver", () => {

        console.log("SYSTEM: Game Over received");

        setTimeout(() => {

            console.log("SYSTEM: restarting game");

            resetGameState();
            loadGame(currentIndex);
        }, 2000);
    });
}