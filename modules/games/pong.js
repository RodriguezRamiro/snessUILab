/* //snesUILab/modules/games/pong.js */

export const pong = {
    name: "Pong",

    init() {
        console.log( "Pong starting...");
    },

    update(dt) {

        // Game logic here later
    },

    render(ctx) {

        ctx.fillStyle = "white";
        ctx.fillRect(140, 80, 40, 10);
    },

    destroy() {}
};