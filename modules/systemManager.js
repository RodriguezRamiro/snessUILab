/* //snesUILab/modules/systemManager.js */

import { on } from "./eventBus.js";
import { resetGameState } from "./gameState.js";
import { triggerGameOver } from "./uiManager.js";

/**
 * Listen to system events
 * Control pause
 * Handle game over
 * Restart games
 * Manage cartridges
 */

export function initSystem() {

    // Cartridge tracking
    on("gameLoaded", index => {

        console.log(
            "SYESTEM: Active cartridge",
            index
        );
    });

    // Pause Tracking
    on("pausedChanged", paused => {

        console.log(
            paused
            ? "SYSTEM: paused"
            : "SYSTEM: Resumed"
        );
    });

    // System Reset runtime only
    on("systemReset", () => {
        console.log("SYSTEM: Reset");

        resetGameState();
    });

    // Game over logging only
    on("gameOver", data => {

        console.log(
            "SYSTEM: Game Over",
            data
        );
    });
}
