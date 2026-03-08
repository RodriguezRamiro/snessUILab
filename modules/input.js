/* //snesUILab/modules/input.js */

export const keys = {}

export function initInput() {

    document.addEventListener("keydown", e => {
        keys[e.key.toLowerCase()] = true;
    });

    document.addEventListener("keyup", e => {
        keys[e.key.toLowerCase()] = false;
    });
}