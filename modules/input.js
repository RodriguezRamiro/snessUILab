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

let gamepadIndex = null;

let handleSystemInput = () => {};
let handleKonami = () => {};
let press = () => {};
release = () => {};

export function initInput({
    handleSystemInput: sys = () => {},
    handleKonami: kon = () => {},
    press: p = () => {},
    release: r= () => {}
} = {}) {

    handleSystemInput = sys;
    handleKonami = kon;
    press = p;
    release = r;

    initKeyboard();
    initGamepad();
    initMouse();
}

// Keyboard Press
function initKeyboard() {

    document.addEventListener("keydown", e => {

        const key = e.key.toLowerCase();

        if (keys[key]) return;

        keys[key] = true;

        handleKonami(key);
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

function initGamepad() {
    window.addEventListener(
        "gamepadconnected",
        e => {

            gamepadIndex =
            e.gamepad.index;

            console.log(
                "gamepad connected:",
                e.gamepad.id
            );
        }
    );
}

export function updateGamepad() {
    if (gamepadIndex === null)
    return;

    const go =
    navigator.getGamepads()
    [gamepadIndex];

    if (!gp) return;

    // D-pad
    toggleEvent("w", gp.buttons[12].pressed);
    toggleEvent("s", gp.buttons[13].pressed);
    toggleEvent("a", gp.buttons[14].pressed);
    toggleEvent("d", gp.buttons[15].pressed);

    // Action Buttons
    toggleEvent("k", gp.buttons[0].pressed);
    toggleEvent("l", gp.buttons[1].pressed);
    toggleEvent("j", gp.buttons[2].pressed);
    toggleEvent("i", gp.buttons[3].pressed);

    // Start / Select
    toggle("enter",
    gp.buttons[9].pressed);

    toggle("shift",
    gp.buttons[8].pressed);
}

function toggle(key, pressed) {

    const el =
        document.querySelector(
            `[data-key="${key}"]`
            );

            if(!el) return;

            el.classList.toggle(
                "active",
                pressed
            );

            if (pressed) {
                handleSystemInput(key);
                handleKonami(key);
            }
    }

    // Mouse Events
    function initMouse() {

        document.addEventListener(
          "mousemove",
          e => {

            const controller =
              document.querySelector(
                ".controller"
              );

            if (!controller) return;

            const x =
              (window.innerWidth / 2
                - e.clientX) / 80;

            const y =
              (window.innerHeight / 2
                - e.clientY) / 80;

            controller.style.transform =
              `rotateX(${y}deg)
               rotateY(${x}deg)`;

            // Dynamic lighting

            const lightX =
              (e.clientX
                / window.innerWidth)
              * 100;

            const lightY =
              (e.clientY
                / window.innerHeight)
              * 100;

            controller.style.background = `
              radial-gradient(
                circle at
                ${lightX}%
                ${lightY}%,
                rgba(255,255,255,0.25),
                transparent 40%
              ),
              linear-gradient(
                to bottom,
                #f2f2f2 0%,
                #d9d9d9 45%,
                #bfbfbf 100%
              )
            `;

          }
        );

      }
