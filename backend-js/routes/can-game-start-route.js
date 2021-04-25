"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.canGameStart = void 0;
const room_model_1 = require("../models/room-model");
/**
 * Function that determines if game can start
 * @param req {Request} - express request object
 * @param res {Response} - express response object
 */
function canGameStart(req, res) {
    if (req.session) {
        room_model_1.Room.findById(req.session.playerId, (error, data) => {
            let players = data.players;
            let isEveryoneReady = true;
            if (players.length < 2) {
                res.end();
                return;
            }
            for (let player of players) {
                if (player.ready === false) {
                    isEveryoneReady = false;
                    break;
                }
            }
            if (isEveryoneReady) {
                data.hasGameStarted = true;
                data.turnStartTime = Date.now();
            }
            data.save().catch((error) => console.log(error));
        });
    }
    res.end();
}
exports.canGameStart = canGameStart;
