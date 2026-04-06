/* //snesUILab/modules/eventBus.js */

/**
 * Game over signals
 * UI updates
 * Cartridge communication
 * System events
 */

const listeners = {};

export function on(event, handler) {
    if (!listeners[event]) {
        listeners[event] = [];
    }

    listeners[event].push(handler);
}

export function off(event, handler) {
    if (!listeners[event]) return;

    listeners[event] =
    listeners[event].filter(
        h => h !== handler
        );
}

export function emit(event, data) {
    if(!listeners[event]) return;

    listeners[event].forEach(
        handler => handler(data)
    );
}