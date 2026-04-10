/* //snesUILab/modules/systemManager.js */

import { on } from "./eventBus.js";
import { resetGameState } from "./gameState.js";
import { loadGame } from "./cartridgeManager.js";
import { getState, STATES } from "./uiManager.js";

/**
 * Listen to system events
 * Control pause
 * Handle game over
 * Restart games
 * Manage cartridges
 */

let currentIndex = 0;

export function initSystem() {

    // Track active cartridge

    on("gameLoaded", index => {

        currentIndex = index;

        console.log(
            "SYESTEM: Active cartridge",
            index
        );
    });

    // Game Over

    on("gameOver", () => {

        console.log("SYSTEM: Game Over received");

        setTimeout(() => {

            if (
                getState() === STATES.GAME
            ){ console.log(
                "SYSTEM: restarting game"
                );

            resetGameState();
            loadGame(currentIndex);
            }
        }, 2000);
    });

    // Pause Status

    on("pausedChanged", paused => {

        console.log(
            paused
            ? "SYSTEM: paused"
            : "SYSTEM: Resumed"
        );
    });

    // System Reset

    on("systemReset", () => {
        console.log("SYSTEM: Reset");

        resetGameState();
        loadGame(currentIndex);
    });
}
