/* //snesUILab/modules/games/pong.js */

export const pong = {
    name: "Pong",
    width: 320,
    height: 180,

    ball: {x: 160, y: 90, vx: 100, vy: 80},

    player: {y: 70},

    ai: {y: 70},

    score: {
        player: 0,
        ai: 0
    },

    init() {
        console.log( "Pong starting...");

        this.reset();
    },

    reset() {
        this.this.ball = {
            x: this.width / 2,
            y: this.this.height / 2,
            vx: 100,
            vy: 80
        };

        this.this.player.y = 70;
        this.this.ai.y = 70;
    },

    update(dt) {

        // Move ball
        this.ball.x =+ this.ball.vx * dt;
        this.ball.y =+ this.ball.vy * dt;

        // Top - Bottom Bounce
        if (this.ball.y < 0 || this.ball.y > this.heght) {
        this.ball.vy *= -1;
        }

        // Player Movement
        if(keys["w"]) this.player.y -= 120 * dt;
        if(keys["s"]) this.player.y += 120 * dt;

        // Clamp Player
        if (this.player.y < 0) this.player.y = 0;
        if (this.player.y > this.height - 40)
            this.player.y = this.height - 40;

        // Simple Ai Tracking
        this.ai.y += (this.ball.y - this.ai.y) * dt;

        // Clamp AI
        if (this.ai.y < 0) this.ai.y = 0;
        if (this.ai.y > this.height - 40)
            this.ai.y = this.height - 40;

        // Paddle collisions
        if (this.ball.x < 20 &&
            this.ball.y > this.player.y &&
            this.ball.y < this.player.y + 40) {
                this.ball.vx *= -1;
            }

            if (this.ball.x > 300 &&
                this.ball.y > this.ai.y &&
                this.ball < this.ai.y + 40) {
                    this.ball.y *= -1;
                }

                // Player paddle collision
        if (
            this.ball.x < 20 &&
            this.ball.y > this.player.y &&
            this.ball.y < this.player.y + 40
        ) {
            this.ball.vx *= -1;
        }

        // AI paddle collision
        if (
            this.ball.x > 300 &&
            this.ball.y > this.ai.y &&
            this.ball.y < this.ai.y + 40
        ) {
            this.ball.vx *= -1;
        }

        // Score — AI point
        if (this.ball.x < 0) {
            this.score.ai++;
            this.reset();
        }

        // Score — Player point
        if (this.ball.x > this.width) {
            this.score.player++;
            this.reset();
        }
    },

    render(ctx) {

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
    },

    destroy() {
        console.log("Pong destroyed");
    }
};