"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.whoseTurn = void 0;
const room_model_1 = require("../models/room-model");
/**
 * Function that check if its player turn
 * @param req {Request} - express request object
 * @param res {Response} - express response object
 */
function whoseTurn(req, res) {
    room_model_1.Room.findById(req.session.playerId, (error, data) => {
        if (error)
            console.error(error);
        if (data.players[data.turn].nick === req.session.playerNick &&
            data.players[data.turn].color === req.session.playerColor)
            res.json({ myTurn: true });
        else
            res.json({ myTurn: false });
    });
}
exports.whoseTurn = whoseTurn;
