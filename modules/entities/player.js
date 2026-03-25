/* //snesUILab/modules/enteties/player.js */

export function createPlayer() {
    return {
        x: 160,
        y: 90,
        size: 8,

        vx: 0,
        vy: 0,

        maxSpeed: 120,
        accel: 600,
        friction: 800,
    };
}
