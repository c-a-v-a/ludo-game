"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const room_model_1 = require("../models/room-model");
function checkIfGameWon(req, res) {
    room_model_1.Room.findById(req.session.playerId, (error, data) => {
        if (error)
            console.error(error);
        else {
            for (let player of data.players) {
                let winner = true;
                for (let i = 0; i < player.house.length - 1; i++) {
                    if (player.house[i] === 0)
                        winner = false;
                }
                if (winner) {
                    data.winner = {
                        nick: player.nick,
                        color: player.color,
                    };
                    data.save()
                        .then(() => {
                        if (req.session.playerNick === data.winner.nick && req.session.playerColor === data.winner.color)
                            res.redirect('/winner');
                        else
                            res.redirect('/looser');
                    });
                }
            }
            res.end();
        }
    });
}