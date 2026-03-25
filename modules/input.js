/* //snesUILab/modules/input.js */

/**
 * export const keys
 * keeps track of what buttons are currently held
 * keys["w"]
 * keys["a"]
 * keys["s"]
 * keys["d"]
 */

export const keys = {};

export function initInput({
    handleSystemInput = () => {},
    handleKnonami = () => {},
    press = () => {},
    release = () => {}
} = {}) {

    // Keyboard Press
    document.addEventListener("keydown", e => {

        const key = e.key.toLowerCase();

        if (keys[key]) return;

        keys[key] = true;

        handleKnonami(key);
        handleSystemInput(key);

        const btn =
            document.querySelector(
                `[data-key="${key}"]`
            );

        if (btn) press(btn);
    });

    // Keyboard Release
    document.addEventListener("keyup", e => {

        const key = e.key.toLowerCase();

        keys[key] = false;

        const btn =
            document.querySelector(
                `[data-key="${key}"]`
            );

        if (btn) release(btn);
    });
}