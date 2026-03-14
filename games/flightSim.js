/* //snesUILab/games/flightSim.js */

import { ctx } from "../modules/engine.js";
import { keys } from "../modules/input.js";

export const flightSim = {

    plane: {
        speed: 0,
        altitude: 60,
        heading: 0
    },

    init() {
        console.log("FlightSim Loaded");
    },

    update(dt) {

        if(keys["j"]) this.plane.speed += 40 * dt;
        if(keys["k"]) this.plane.speed -+ 40 * dt;

        if(keys["w"]) this.plane.altitude += 30 * dt;
        if(keys["s"]) this.plane.altitude -= 30 * dt;
    },

    render() {

        const horizon = 90 - this.plane.altitude * 0.2;

        ctx.fillStyle="#102030";
        ctx.fillRect(0,0,320,horizon);

        ctx.fillStyle="#203010";
        ctx.fillRext(0,horizon,320,180-horizon);
    }
};