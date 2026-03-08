/* //snesUILab/modules/state.js */

export const STATE = {
    BOOT: "boot",
    MENU: "menu",
    LOADING: "loading",
    GAME: "game",
    GAME_OVER: "gameOver"
};

export let currentState = STATE.BOOT;

export function setState(newState) {
    currentState = newState
}