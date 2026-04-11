/* //snesUILab/modules/gameState.js */


/* Module Controls
* Score
* Lives
* Health
* Level
* Pause State
* Game reset
* Game over Trigger
*/


import { emit } from "./eventBus.js";

const DEFAULT_STATE = {
    score: 0,
    lives: 3,
    level: 1,
    health: 100,
    paused: false,
};

let state = { ...DEFAULT_STATE };

export function resetGameState() {
    state = { ...DEFAULT_STATE };

    emit("stateChanged", state);

    emit("scoreChanged", state.score);
    emit("livesChanged", state.lives);
    emit("healthChanged", state.health);
    emit("pausedChanged", state.paused);


}

export function getStateValue(key) {
    return state[key];
}

export function setStateValue(key, value) {

    if (!(key in state)) {

        console.warn(
            "Invalid state key:",
            key
        );

        return;

    }

    state[key] = value;

    emit("stateChanged", state);

}

export function updateScore(amount) {

    state.score = Math.max(
        0,
        state.score + amount
    );

    emit("scoreChanged", state.score);
}

export function loseLife() {
    if (state.lives <= 0) {
        return;
    }

    state.lives--;


    emit("livesChanged", state.lives);

    if (state.lives === 0) {
        emit("gameOver");
    }
}

export function damagePlayer(amount) {

    state.health -= amount;

    emit("healthChanged", state.health);

    if(state.health <= 0) {

        loseLife();

        state.health = DEFAULT_STATE.health;

        emit("healthChanged", state.health);
    }
}

export function togglePause() {
    state.paused = !state.paused;
    emit("pausedChanged", state.paused);
}

export function getFullState() {
    return { ...state };
}

