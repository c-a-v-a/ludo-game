"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.changePlayerState = void 0;
const room_model_1 = require("../models/room-model");
/**
 * Functions that changes player state (changes ready from player object for true|false)
 * @param req {Request} - express request object
 * @param res {Response} - express response object
 */
function changePlayerState(req, res) {
    if (req.body && req.session) {
        const ready = req.body.ready;
        const nick = req.session.playerNick;
        room_model_1.Room.findById(req.session.playerId, (error, data) => {
            let players = data.players;
            for (let player of players) {
                if (player.nick === req.session.playerNick && player.color === req.session.playerColor) {
                    player.ready = ready;
                }
            }
            data.players = players;
            data.save()
                .then(res.redirect(308, '/canGameStart'))
                .catch((err) => console.log(err));
        });
    }
}
exports.changePlayerState = changePlayerState;
