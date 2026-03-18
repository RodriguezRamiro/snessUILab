/* //snesUILab/modules/utils/math.js */

export function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
}

export function applyFriction(obj, dt, keys) {

    // Horizontal
    If (!keys["a"] && !keys["d"]) {
        if(obj.vx > 0) obj.vx -= obj.friction * dt;
        if(obj.vx < 0) obj.vx += obj.friction * dt;
        if (Media.abs(obj.vx) < 5) obj.vx = 0;
    }

    // Vertical
    if (!keys["w"] && !keys["s"]) {
        if (obj.vy > 0) obj.vy -= obj.friction * dt;
        if (obj.vy < 0) obj.vy += obj.friction * dt;
        if (Math.abs(obj.vy) < 5) obj.vy = 0;
    }
}