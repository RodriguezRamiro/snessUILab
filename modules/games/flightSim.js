/* //snesUILab/games/flightSim.js */

import { ctx } from "../engine.js";
import { keys } from "../input.js";
import { clamp } from "../utils/math.js";
import { emit } from "../eventBus.js";
import { updateScore, damagePlayer } from "../gameState.js";

export const flightSim = {

    name: "Flight Simulator",

    accumulator: 0,

    plane: {
        x: 160,
        y: 90,

        // Core motion
        speed: 0,
        thrust: 0,

        // Direction
        heading: 0,
        turnVelocity: 0,

        // Vertical physics
        altitude: 60,
        verticalSpeed: 0,

        // Visual / physics feedback
        bankAngle: 0,

        // World movement
        groundOffset: 0,
    },

    clouds: [
        { depth: 0.2, lane: -0.6, speed: 10 },
        { depth: 0.4, lane: 0.2, speed: 15 },
        { depth: 0.1, lane: 0.7, speed: 8 }
    ],

    lasers: [],
    obstacles: [],
    spawnTimer: 0,

    difficulty: 1,
    survivalTime: 0,

    isCrashed: false,
    explosionTimer: 0,

    init() {
        console.log("FlightSim Starting....");
        updateScore(100);
        damagePlayer(25);
    },

    physicsStep(dt) {
        // Reserved for future fixed physics logic
    },

    update(dt) {

        // Clamp first (important)
        dt = Math.min(dt, 0.033);

        // Fixed timestep support
        this.accumulator += dt;

        const FIXED_STEP = 1 / 60;

        while (this.accumulator >= FIXED_STEP) {
            this.physicsStep(FIXED_STEP);
            this.accumulator -= FIXED_STEP;
        }

        // Survival Time Tracker
        this.survivalTime += dt;

        // Spawn Obstacles
        this.spawnTimer -= dt;

        if (this.spawnTimer <= 0) {
            this.spawnObstacles();
            this.spawnTimer = (2 + Math.random() * 2) / this.difficulty;
        }

        updateScore(Math.floor(dt * 10));

        // Incremental difficulty
        this.difficulty = 1 + this.survivalTime * 0.1;

        // Stop movement after Crash
        if (this.isCrashed) {
            this.explosionTimer -= dt;

            if (this.explosionTimer <= 0) {
                this.gameOver();
            }

            return;
        }

        // Shoot
        if (keys["l"]) {
            this.lasers.push({
                depth: 0.1,
                lane: 0,
                altitude: this.plane.altitude,
                speed: 200
            });

            this.plane.speed *= 0.99;
        }

        // Update lasers
        this.lasers.forEach(l => {
            l.depth -= l.speed * dt * 0.002;
        });

        this.lasers = this.lasers.filter(l => l.depth > 0);

        // Throttle input
        if (keys["j"]) {
            this.plane.thrust = 1;
        }
        else if (keys["k"]) {
            this.plane.thrust = -1;
        }
        else {
            this.plane.thrust = 0;
        }

        const MAX_SPEED = 120;
        const THRUST_POWER = 80;
        const DRAG = 0.98;

        this.plane.speed += this.plane.thrust * THRUST_POWER * dt;
        this.plane.speed *= DRAG;

        // Lift / Gravity
        const LIFT_FACTOR = 0.06;
        const GRAVITY = 28;

        const lift = this.plane.speed * LIFT_FACTOR;

        this.plane.verticalSpeed += lift * dt;
        this.plane.verticalSpeed -= GRAVITY * dt;

        if (this.plane.speed < 25) {
            this.plane.verticalSpeed -= 40 * dt;
        }

        // Pitch control
        if (keys["w"]) this.plane.verticalSpeed += 40 * dt;
        if (keys["s"]) this.plane.verticalSpeed -= 40 * dt;

        this.plane.altitude += this.plane.verticalSpeed * dt;

        // Turning
        let turnInput = 0;

        if (keys["a"]) turnInput = -1;
        if (keys["d"]) turnInput = 1;

        const TURN_ACCEL = 220;
        const TURN_DAMPING = 0.92;

        this.plane.turnVelocity += turnInput * TURN_ACCEL * dt;
        this.plane.turnVelocity *= TURN_DAMPING;

        this.plane.heading += this.plane.turnVelocity * dt;

        // Banking
        this.plane.bankAngle = this.plane.turnVelocity * 0.25;

        // Move Clouds
        this.clouds.forEach(c => {
            c.depth -= (this.plane.speed * 0.3 + c.speed) * dt * 0.002;

            if (c.depth <= 0) {
                c.depth = 1;
                c.lane = Math.random() * 2 - 1;
            }
        });

        // Update ground Offset
        this.plane.groundOffset += this.plane.speed * dt * 20;

        // Clamp physics
        this.plane.speed = clamp(this.plane.speed, 0, MAX_SPEED);
        this.plane.altitude = clamp(this.plane.altitude, 10, 200);
        this.plane.verticalSpeed = clamp(this.plane.verticalSpeed, -80, 80);

        // Ground collision
        if (this.plane.altitude <= 10) {
            this.plane.altitude = 10;

            if (this.plane.speed > 20) {
                this.crash();
            }
        }

        // Move obstacles
        this.obstacles.forEach(o => {
            const worldSpeed = 60;
            o.depth -= (worldSpeed + o.speed) * dt * 0.002;
        });

        this.obstacles = this.obstacles.filter(o => o.depth > 0);

        // Plane collision
        this.obstacles.forEach(o => {

            const hitDepth = o.depth < 0.04;

            const hitAlt = Math.abs(
                o.altitude - this.plane.altitude
            ) < 12;

            if (hitDepth && hitAlt) {
                console.log("Obstacle Collision Detected");
                this.crash();
            }
        });

        // Laser collisions
        this.lasers.forEach(laser => {
            this.obstacles.forEach(obstacle => {

                const hitDepth = Math.abs(
                    laser.depth - obstacle.depth
                ) < 0.05;

                const hitAlt = Math.abs(
                    laser.altitude - obstacle.altitude
                ) < obstacle.height;

                if (hitDepth && hitAlt) {

                    console.log("Obstacle Destroyed");

                    obstacle.destroyed = true;
                    laser.hit = true;

                    updateScore(50);
                }
            });
        });

        this.obstacles = this.obstacles.filter(o => !o.destroyed);
        this.lasers = this.lasers.filter(l => !l.hit);
    },

    gameOver() {
        console.log("GAME OVER");
        this.isCrashed = false;
        emit("gameOver");
    },

    render() {

        // Sky
        ctx.fillStyle = '#102030';
        ctx.fillRect(0, 0, 320, 90);

        const fog = ctx.createLinearGradient(0, 70, 0, 120);
        fog.addColorStop(0, "rgba(0,0,0,0)");
        fog.addColorStop(1, "rgba(0,0,0,0.6)");

        ctx.fillStyle = fog;
        ctx.fillRect(0, 70, 320, 60);

        // Ground grid
        for (let i = 0; i < 30; i++) {
            const perspective = i / 30;
            const depth = perspective * perspective;

            const y = 90 + depth * 90 +
                (this.plane.groundOffset * (0.2 + depth * 2)) % 90;

            const shade = Math.floor(80 + depth * 120);
            ctx.strokeStyle = `rgb(0, ${shade}, 0)`;

            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(320, y);
            ctx.stroke();
        }

        // Horizon banking
        const bank = this.plane.bankAngle;

        ctx.strokeStyle = "#00ff88";
        ctx.beginPath();
        ctx.moveTo(0, 90 + bank);
        ctx.lineTo(320, 90 - bank);
        ctx.stroke();

        if (this.isCrashed) {
            ctx.fillStyle = "orange";

            ctx.beginPath();
            ctx.arc(
                160,
                90,
                10 + Math.random() * 8,
                0,
                Math.PI * 2
            );

            ctx.fill();
        }

        // Plane
        ctx.fillStyle = "#ffffff";

        drawPlane(
            this.plane.heading,
            this.plane.altitude,
            this.plane.bankAngle
        );

        // HUD
        ctx.fillStyle = "#00ff88";
        ctx.font = "8px monospace";

        ctx.fillText(`ALT ${Math.floor(this.plane.altitude)}`, 10, 15);
        ctx.fillText(`SPD ${Math.floor(this.plane.speed)}`, 10, 25);
        ctx.fillText(`HDG ${Math.floor(this.plane.heading)}`, 10, 35);

        // Clouds
        ctx.fillStyle = "#ffffff";

        this.clouds.forEach(c => {

            const perspective = 1 - c.depth;

            const screenY = 90 + perspective * 70;

            const screenX =
                160 + c.lane * perspective * 150;

            const size = 6 + perspective * 10;

            ctx.fillRect(
                screenX,
                screenY,
                size * 2,
                size
            );
        });

        this.obstacles.forEach(o => {
            const p = this.project(o.lane, o.altitude, o.depth);

            // Only  draw if tis in front of the camera

        if (o.depth > 0 && o.depth < 2 ) {
            ctx.fillStyle = o.destroyed ? "white" : "red";
            ctx.fillREct(p/x - p.size/2, p.y - p.size/2, p.size, p.size);
        }
        });

        // Obstacles
        ctx.fillStyle = "#ff4444";

        this.obstacles.forEach(o => {

            const perspective = 1 - o.depth;

            const screenY = 90 + perspective * 90;

            const screenX =
                160 + o.lane * perspective * 140;

            const size = perspective * 12;

            ctx.fillRect(
                screenX,
                screenY,
                size,
                size * 2
            );
        });

        ctx.fillText(
            `LVL ${this.difficulty.toFixed(1)}`,
            10,
            45
        );
    },

    crash() {
        console.log("CRASH!");
        this.plane.speed = 0;
        this.explosionTimer = 2;
        this.isCrashed = true;
    },

    destroy() {
        this.lasers = [];
        this.plane.speed = 0;
    },

    spawnObstacles() {

        const altitude = 20 + Math.random() * 150;

        this.obstacles.push({

            depth: 2.0,
            lane: Math.random() * 2 - 1,

            altitude: altitude,

            width: 10,
            height: 20,

            speed: 40 * this.difficulty,

            destroyed: false
        });
    }
};

function drawPlane(heading, altitude, bank) {

    ctx.save();

    const xPos = 160 + (bank * 0.5);
    const yPos = 180 - (altitude * 0.4)
    ctx.translate(xPos, yPos);

    // Apply rotations
    ctx.rotate(bank * Math.PI / 180);

    // Draw shadow for depth
    ctx.fillStyle = "rgba(0,0,0,0.03)";
    ctx.beginPath();
    ctx.moveTo(0, -20);
    ctx.lineTo(12, 30);
    ctx.lineTo(0, 25);
    ctx.lineTo(-12, 30);

    ctx.fill();

    // Draw Delta Wing
    const wingStretch = Math.cos(bank * Math.PI / 180);
    const wingWidth = 15 * Math.abs(wingStretch);
    ctx.fillStyle = "#ffffff";
    ctx.strokeStyle = "#00ff88";
    ctx.lineWidth = 2;

    ctx.beginPath();
    // Nose (Top point)
    ctx.moveTo(0, -12);

    // Right Wing
    ctx.lineTo(wingWidth, 8);

    // Rear Notch (Star Fox Arwing style)
    ctx.lineTo(0, 2);

    // Left Wing
    ctx.lineTo(-wingWidth, 8);

    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // 5. Add a simple "Engine Glow"
    ctx.fillStyle = "#00ffff";
    ctx.fillRect(-2, 2, 4, 3);

    ctx.restore();
}
