"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.skipPlayerTurn = void 0;
const room_model_1 = require("../models/room-model");
function skipPlayerTurn(req, res) {
    room_model_1.Room.findById(req.session.playerId, (error, data) => {
        if (error)
            console.error(error);
        else {
            if (hasTurnEnded(data)) {
                if (data.turn >= data.players.length - 1)
                    data.turn = 0;
                else
                    data.turn++;
                data.dice = 0;
                data.turnStartTime = Date.now();
                data.save();
                res.json({ skipped: true });
            }
            else
                res.json({ skipped: false });
        }
    });
}
exports.skipPlayerTurn = skipPlayerTurn;
function hasTurnEnded(data) {
    if (Date.now() - data.turnStartTime >= 60000)
        return true;
    else
        return false;
}
