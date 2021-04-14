"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRoomInfo = void 0;
const room_model_js_1 = require("../models/room-model.js");
require('dotenv').config();
function getRoomInfo(req, res) {
    room_model_js_1.Room.findById(req.session.playerId, (error, data) => {
        if (error)
            console.error(error);
        else {
            res.json(data);
        }
    });
}
exports.getRoomInfo = getRoomInfo;
