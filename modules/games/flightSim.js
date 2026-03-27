/* //snesUILab/games/flightSim.js */

import { ctx } from "../engine.js";
import { keys } from "../input.js";
import { clamp } from "../utils/math.js";
import { emit } from "../eventBus.js";
import { updateScore, damagePlayer } from "../gameState.js";


export const flightSim = {

    name: "Flight Simulator",
    
    plane: {
        x: 160,
        y: 90,

        speed: 0,
        acceleration: 0,

        altitude: 60,
        verticalSpeed: 0,

        heading: 0,
        groundOffset: 0,
    },

    clouds: [
        {x: 40, y: 20, speed: 10},
        {x: 120, y: 30, speed: 15},
        {x:220, y:25, speed:8},
    ],

    lasers: [],
    obstacles: [],
    spawnTimer: 0,

    isCrashed: false,
    explosionTimer: 0,


    init() {
        console.log("FlightSim Starting....");
        updateScore(100);
        damagePlayer(25);
    },

    update(dt) {

        // Stop movement after Crash
        if (this.isCrashed) {
            this.explosionTimer -= dt;

            if (this.explosionTimer <= 0) {
                this.gameOver();
            }

            return
        }

        //Shoot (a button = "l"
        if(keys["l"]) {
            this.lasers.push({
                x: 160,
                y: 90,
                speed: 200
            });

            this.plane.speed *= 0.99;       // speed drag
        };

        this.lasers.forEach(l => {
            l.y -= l.speed * dt;
        });

        // Clean up offScreen lasers
        this.lasers = this.lasers.filter(l => l.y > 0)

        // Throttle input
        if(keys["j"]) {
            this.plane.acceleration = 60;
        }
        else if (keys["k"]) {
            this.plane.acceleration = -60;
        }
        else {
            this.plane.acceleration = 0;
        }

        // Apply acceleration
        this.plane.speed +=
        this.plane.acceleration * dt;

        // Drag
        this.plane.speed *= 0.995;

        // Gravity
        this.plane.verticalSpeed -= 20 * dt;

        // Lift from Speed
        const lift =
        this.plane.speed * 0.08;

        this.plane.verticalSpeed +=
        lift * dt;

        // Player Pitch control
        if (keys["w"])
        this.plane.verticalSpeed += 40 * dt;

        if (keys["s"])
        this.plane.verticalSpeed -= 40 * dt;

        // Apply vertical motion
        this.plane.altitude +=
        this.plane.verticalSpeed * dt;

        // Plane Heading
        let turnRate = 0;

        if (keys["a"])
        turnRate = -80;

        if (keys["d"])
        turnRate = 80;

        // Speed affects turning
        turnRate *=
        this.plane.speed / 60;

        this.plane.heading +=
        turnRate * dt;

        // Move Clouds
        this.clouds.forEach(c => {
            c.x -= (this.plane.speed * 0.2 + c.speed) * dt * (this.plane.altitude /50);
        });

        // Update ground Offset
        this.plane.groundOffset += this.plane.speed * dt * 20;

        // Clamp plane Physics
        this.plane.speed = clamp(this.plane.speed, 0, 120);
        this.plane.altitude = clamp(this.plane.altitude, 10, 200);
        this.plane.verticalSpeed = clamp(this.plane.verticalSpeed, -80, 80)

        // Ground collision detection
        if (this.plane.altitude <= 10) {
            this.plane.altitude = 10;

            if (this.plane.speed > 20) {
                this.crash();
            }
        }
    },

        // Game Over State
        gameOver() {
            console.log("GAME OVER");
            this.isCrashed = false;

            emit("gameOver");
        },




    render() {

        // Sky
        ctx.fillStyle = '#102030';
        ctx.fillRect(0,0,320,90);

        const fog = ctx.createLinearGradient(0,70,0, 120);
        fog.addColorStop(0, "rgba(0,0,0,0)");
        fog.addColorStop(1, "rgba(0,0,0,0.6)");

        ctx.fillStyle = fog;
        ctx.fillRect(0,70,320,60);

        // Ground
        for (let i = 0; i< 30; i++){
            const perspective = i / 30

            const depth = perspective * perspective
            // Quadratic depth curve (lines compress)

            const y = 90 + depth * 90 + (this.plane.groundOffset * (0.2 + depth * 2)) % 90;

            const shade = Math.floor(80 + depth * 120);
            ctx.strokeStyle = `rgb(0, ${shade}, 0)`;

            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(320, y);
            ctx.stroke();
        }

        ctx.strokeStyle = "#406030";

        for (let i = 0; i < 10; i++) {
            const depth = i / 10;
            const width = depth * 160;
            const y = 90 + depth * 90;

            ctx.beginPath();
            ctx.moveTo(160 - width, y);
            ctx.lineTo(160 + width, y)
            ctx.stroke();
        }

        // Horizon Banking
        const bank = this.plane.heading * 0.2;
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
        drawPlane(this.plane.heading,
            this.plane.altitude);

        // HUD
        ctx.fillStyle = "#00ff88";
        ctx.font = "8px monospace";
        ctx.fillText(`ALT
            ${Math.floor(this.plane.altitude)}`, 10, 15);
            ctx.fillText(`SPD
            ${Math.floor(this.plane.speed)}`, 10, 25);
        ctx.fillText(`HDG
        ${Math.floor(this.plane.heading)}`, 10, 35);

        ctx.save();

        // Clouds
        ctx.translate(this.plane.heading * -0.5, 0);
        ctx.fillStyle = "#ffffff";

        this.clouds.forEach(c => {
            const depth = c.y/40;
            const size = 6 + depth * 8;

            ctx.fillRect(c.x, c.y, size * 2, size);
            ctx.fillRect(c.x + size, c.y - size/2, size * 1.5, size);
        });

        ctx.restore();

        // Pseudo 3d_ ground lines
        ctx.strokeStyle = "#305020";
        for (let i = 0; i < 30; i++) {
            const perspective = i / 30;

            const y = 90 + (perspective * 90) +
            (this.plane.groundOffset * perspective) % 90;

            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(320, y);
            ctx.stroke();
        }

        // Speed lines (forward motion effect)
        ctx.strokeStyle = "#204020";

        for (let i = 0; i < 20; i ++) {
            const x = (i * 20 + this.plane.heading * 2 ) % 320;

            ctx.beginPath();
            ctx.moveTo(x, 90);
            ctx.lineTo(x, 180);
            ctx.stroke();
        }
    },

    crash() {
        console.log("CRASH!");
        this.plane.speed = 0;
        this.explosionTimer = 2; // seconds
        this.isCrashed = true;
    },

    destroy() {
        this.lasers = [];
        this.plane.speed = 0;
    }
};

function drawPlane(heading, altitude) {
    ctx.save();

    ctx.translate(160, 90);
    ctx.rotate(heading * Math.PI / 180);

    ctx.beginPath();
    ctx.moveTo(0, -6);
    ctx.lineTo(4, 6);
    ctx.lineTo(-4, 6);
    ctx.closePath();

    ctx.fill();

    ctx.restore();

}