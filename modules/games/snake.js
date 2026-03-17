/* //snesUILab/modules/games/snake.js */

export const snake = {
    name: "Snake",

    init() {
        console.log( "Snake staring..." );
    },

    update(dt) {
        // game logic here later
    },

    render(ctx) {
        ctx.fillStyle = "lime";
        ctx.fillRect(50, 50, 10, 10);
    },

    destroy() {
        console.log("Snake shutting down...");
    }
};