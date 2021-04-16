"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.diceRoll = void 0;
const room_model_1 = require("../models/room-model");
// ! Used @ts-ignore because of module error, works fine for now.
// @ts-ignore
const helper_functions_js_1 = require("../../helper-functions/js/helper-functions.js");
function diceRoll(req, res) {
    room_model_1.Room.findById(req.session.playerId, (error, data) => {
        if (error)
            console.error(error);
        if (data) {
            let diceRoll = helper_functions_js_1.randomInteger(1, 6);
            data.dice = diceRoll;
            data.save()
                .then(console.log('dice rolled', diceRoll))
                .catch((error) => console.error(error));
        }
    });
    res.end();
}
exports.diceRoll = diceRoll;
