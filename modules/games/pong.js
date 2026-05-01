/* //snesUILab/modules/games/pong.js */

import { keys } from "../input.js";

export const pong = {
    name: "Pong",
    WIDTH: 320,
    HEIGHT: 180,

    state: "playing", // "playing" | | "paused" "gameover"
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
    aiSpeed: 2,

    init() {
        console.log( "Pong starting...");
        this.resetGame();
    },

    resetGame() {
        this.score.player = 0;
        this.score.ai = 0;
        this.state = "playing";
        this.winner = null;
        this.aiSpeed = 2;
        this.speedMultiplier = 1;
        this.resetRound();
    },

    resetRound() {
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

    update(dt) {
        // Pause toggle
        if (keys["p"]) {
        this.state = this.state === "paused" ? "playing" : "paused";
        }

        // Stop updates if paused or gameover
        if (this.state !== "playing") {
            if (this.state === "gameover" && keys["Enter"]) {
                this.resetGame();
            }
            return;
        }

        // Move ball
        this.ball.x += this.ball.vx * dt * this.speedMultiplier;
        this.ball.y += this.ball.vy * dt * this.speedMultiplier;

        // Wall bounce
        if (this.ball.y < 0) {
            this.ball.y = 0;
            this.ball.vy *= -1;
        }

        if (this.ball.y > this.HEIGHT - 6) {
            this.ball.y = this.HEIGHT - 6;
            this.ball.vy *= -1;
        }

        // Player paddle collision
        if (
            this.ball.x < 16 &&
            this.ball.y > this.player.y &&
            this.ball.y < this.player.y + 40
        ) {
            this.ball.vx *= -1;
            this.ball.x = 16; // prevent sticking

            this.speedMultiplier += 0.1;
            if (this.speedMultiplier > 2.5) this.speedMultiplier = 2.5;
        }

        // AI paddle collision
        if (
            this.ball.x > 298 &&
            this.ball.y > this.ai.y &&
            this.ball.y < this.ai.y + 40
        ) {
            this.ball.vx *= -1;
            this.ball.x = 298;

            this.speedMultiplier += 0.1;
            this.aiSpeed += 0.1;
        }

        // Cap AI difficulty
        if (this.aiSpeed > 6) this.aiSpeed = 6;

        // AI score
        if (this.ball.x < 0) {
            this.score.ai++;
            this.checkWin();
            if (this.state === "playing") this.resetRound();
        }

         // Player score
         if (this.ball.x > this.WIDTH) {
            this.score.player++;
            this.checkWin();
            if (this.state === "playing") this.resetRound();
        }

        // Player Movement
        if(keys["w"]) this.player.y -= 120 * dt;
        if(keys["s"]) this.player.y += 120 * dt;

        // Clamp player
        this.player.y = Math.max(0, Math.min(this.HEIGHT - 40, this.player.y));

        // AI movement
        const error = 10; // tweak this

        const target = this.ball.y + (Math.random() * error - error / 2);

        this.ai.y += (target - this.ai.y) * dt * this.aiSpeed;

        // Clamp AI
        this.ai.y = Math.max(0, Math.min(this.HEIGHT - 40, this.ai.y));
    },



    render(ctx) {
        ctx.fillStyle = "white";

        // Center line
        for (let y = 0; y < this.HEIGHT; y += 10) {
            ctx.fillRect(this.WIDTH / 2 - 1, y, 2, 5);
        }

        // Player paddle
        ctx.fillRect(10, this.player.y, 6, 40);

        // AI paddle
        ctx.fillRect(304, this.ai.y, 6, 40);

        // Ball
        ctx.fillRect(this.ball.x, this.ball.y, 6, 6);

        // Score
        ctx.font = "12px monospace";
        ctx.fillText(this.score.player, 80, 15);
        ctx.fillText(this.score.ai, 230, 15);

        // Render pause text
        if (this.state === "paused") {
            ctx.fillText("PAUSED", 120, 90);
        }

        // Game over
        if (this.state === "gameover") {
            ctx.fillText(`${this.winner} WINS`, 110, 80);
            ctx.fillText("Press Enter", 105, 100);
        }
    },

    // Paddle Collsion helper function

    handlePaddleCollsion(paddleY, isPlayer) {
        const paddleCenter = paddleY + 20;
        const ballCenter = this.ball.y + 3;

        // Distance from center (-1 to 1)
        let relative = (ballCenter - paddleCenter) / 20;

        // Clamp just in case
        relative = Math.max(-1, Math.min(1, relative));

        const maxAngle = Math.PI / 4; //45 degress
        const angle = relative * maxAngle;

        const speed = math.sqrt(this.ball.vx ** 2 + this.ball.vy ** 2);

        // Direciton depends on which paddle
        const direction = isPlayer ? 1 : -1;

        this.ball.vx = Math.cos(angle) * speed * direction;
        this.ball.vy = Math.sin(angle) * speed;

        // Prevent "too vertical" boring loops
        if (Math.abs(this.ball.vx) < 50) {
            this.ball.vx = 50 * direction;
        }
    }

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
}