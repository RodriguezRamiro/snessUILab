/* //snesUILab/modules/gameState.js */

import { emit } from "./eventBus.js";

const DEFAULT_STATE = {
    score: 0,
    lives: 3,
    level: 1,
    hitpoints: 100,
    paused: false,
};

let state = { ...DEFAULT_STATE };

export function resetGameState() {
    state = { ...DEFAULT_STATE };

    emit("stateChanged", state);

}

export function getStateValue(key) {
    return state[key];
}

export function setStateValue(key, value) {
    state[key] = value;

    emit("stateChanged", state);
}

export function updateScore(amount) {

    state.score += amount;

    emit("scoreChanged", state.score);
}

export function loseLife() {
    state.lives--;

    emit("livesChanged", state.lives);

    if (state.lives <= 0) {
        emit("gameOver");
    }
}

export function damagePlayer(amout) {
    state.health -= amount;

    emit("healthChanged", state.health);

    if(state.health <= 0) {

        loseLife();

        state.health = 100;
    }
}

export function togglePause() {
    state.paused = !state.paused;
    emit("pausedChanged", state.paused);
}