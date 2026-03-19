/* //snesUILab/modules/games/pong.js */

export const pong = {
    name: "Pong",
    ball: {x: 160, y: 90, vx: 100, vy:80},
    player: {y: 70},
    ai: {y: 70},

    init() {
        console.log( "Pong starting...");
        this.ball = {x: 160, y: 90, vx: 100, vy: 80};
        this.player.y = 70;
        this.ai.y = 70;
    },

    update(dt) {
        this.ball.x =+ this.ball.vx * dt;
        this.ball.y =+ this.ball.vy * dt;

        // Bounce
        if (this.ball.y < 0 || this.ball.y > 180) this.ball.vy *= -1;

        // Player
        if(keys["w"]) this.player.y -= 120 * dt;
        if(keys["s"]) this.player.y += 120 * dt;

        // Ai
        this.ai.y += (this.ball.y - this.ai.y) * dt;

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
    },


    render(ctx) {

        ctx.fillStyle = "white";

        ctx.fillRect(10, this.player.y, 6, 40);
        ctx.fillRect(304, this.ai.y, 6 40);
        ctx.fillRect(this.ball.x, this.ball.y, 6, 6);
    },

    destroy() {}
};