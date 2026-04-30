/* //snesUILab/modules/games/pong.js */

import { keys } from "../input.js";

export const pong = {
    name: "Pong",
    WIDTH: 320,
    HEIGHT: 180,
    state: playing, // "playing | "gameover"
    winner: null,
    WIN_SCORE: 5,


    ball: {x: 160, y: 90, vx: 100, vy: 80},

    player: {y: 70},

    ai: {y: 70},

    score: {
        player: 0,
        ai: 0
    },

    speedMultiplier: 1,



    init() {
        console.log( "Pong starting...");

        this.reset();
    },

    reset() {
        this.ball = {
            x: this.WIDTH / 2,
            y: this.HEIGHT / 2,
            vx: 100,
            vy: 80
        };

        this.player.y = 70;
        this.ai.y = 70;
    },

    update(dt) {

        // Stop updates if game is over
        if (this.state !== "playing") return;

        // Move ball
        this.ball.x += this.ball.vx * dt * this.speedMultiplier;
        this.ball.y += this.ball.vy * dt * this.speedMultiplier;

        // Bounce Top - Bottom
        if (this.ball.y < 0 || this.ball.y >= this.HEIGHT -6){
        this.ball.vy *= -1;
        }


        // Paddle Collisisons
        if (
            this.ball.x < 20 &&
            this.ball.y > this.player.y &&
            this.ball.y < this.player.y + 40
        ) {
            this.ball.vx *= -1;
            // Increase speed on collision
            this.speedMultiplier *= 0.1
            // Reset speed on reset
            this.speedMultiplier = 1

        }

        // Ai Paddle Collision
        if (
            this.ball.x > 300 &&
            this.ball.y > this.ai.y &&
            this.ball.y < this.ai.y + 40
        ) {
            this.ball.vx *= -1;
            // Increase speed on collision
            this.speedMultiplier *= 0.1
            // Reset speed on reset
            this.speedMultiplier = 1
        }

        // Score — AI point
        if (this.ball.x < 0) {
            this.score.ai++;
            this.checkWin();
            this.reset();
        }



        // Player Movement
        if(keys["w"]) this.player.y -= 120 * dt;
        if(keys["s"]) this.player.y += 120 * dt;

        // Clamp Player
        if (this.player.y < 0) this.player.y = 0;
        if (this.player.y > this.HEIGHT - 40)
            this.player.y = this.HEIGHT - 40;

        // Simple Ai Tracking
        this.ai.y += (this.ball.y - this.ai.y) * dt;

        // Clamp AI
        if (this.ai.y < 0) this.ai.y = 0;
        if (this.ai.y > this.HEIGHT - 40)
            this.ai.y = this.HEIGHT - 40;



        // Score — Player point
        if (this.ball.x > this.WIDTH) {
            this.score.player++;
            this.checkWin();
            this.reset();
        }
    },

    render(ctx) {
        console.log("Ball:", this.ball.x, this.ball.y);

        ctx.fillStyle = "white";

        // Player paddle
        ctx.fillRect(
            10,
            this.player.y,
            6,
            40
        );

        // AI paddle
        ctx.fillRect(
            304,
            this.ai.y,
            6,
            40
        );

        // Ball
        ctx.fillRect(
            this.ball.x,
            this.ball.y,
            6,
            6
        );

        // Score display
        ctx.font = "12px monospace";

        ctx.fillText(
            this.score.player,
            80,
            15
        );

        ctx.fillText(
            this.score.ai,
            230,
            15
        );

        if (this.state === "gameover") {
            ctx.fillText(`${this.winner} WINS`, 120, 90);
        }
    },

    checkWin() {
        if (this.score.player >= this.WIN_SCORE) {
            this.state = "gameover";
            this.winner = "PLAYER";
        }

        if (this.score.ai >= this.WIN_SCORE) {
            this.state = "gameover";
            this.winner = "AI";
        }
    },

    reset() {
        const direction = Math.random() < 0.5 ? -1 : 1;

        this.ball = {
            x: this.WIDTH / 2,
            y: this.HEIGHT / 2,
            vx: 120 * direction,
            vy: 80
        };

        this.player.y = 70;
        this.ai.y = 70;
    },


    destroy() {
        console.log("Pong destroyed");
    }
};