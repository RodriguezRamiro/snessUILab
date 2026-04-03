/* //snesUILab/modules/utils/math.js */

export function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
}

export function applyFriction(obj, dt, keys) {

    const frictionStrength = obj.friction * dt;

    // Horizontal
    if (!keys["a"] && !keys["d"]) {
        if (obj.vx > 0) obj.vx = Math.max(0, obj.vx - frictionStrength);
        if (obj.vx < 0) obj.vx = Math.min(0, obj.vx + frictionStrength);
    }

    // Vertical
    if (!keys["w"] && !keys["s"]) {
        if (obj.vy > 0) obj.vy = Math.max(0, obj.vy - frictionStrength);
        if (obj.vy < 0) obj.vy = Math.min(0, obj.vy + frictionStrength);
    }
}

export function project(lane, altitude, depth, planeAltitude) {
    const fov = 150;
    const centerX = 160;
    const centerY = 90;

    const scale = fov / (depth * fov + 0.1);

    return {
        x: centerX + (lane * 100) * scale,
        y: centerY - (altitude - planeAltitude) * scale,
        size: scale * 5
    };
}
