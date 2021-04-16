"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.moveToken = void 0;
const room_model_1 = require("../models/room-model");
function moveToken(req, res) {
    const tokenNumber = req.body.token;
    console.log(tokenNumber);
    room_model_1.Room.findById(req.session.playerId, (error, data) => {
        if (error)
            console.error(error);
        else {
            if (req.session.playerNick === data.players[data.turn].nick && req.session.playerColor === data.players[data.turn].color) {
                data.players[data.turn].tokens.set(tokenNumber, data.players[data.turn].tokens[tokenNumber] + data.dice);
                data.dice = 0;
                if (data.turn >= data.players.length)
                    data.turn = 0;
                else
                    data.turn++;
                data.save()
                    .then(() => console.log('moved token'));
            }
            else
                console.log('not ur turn');
        }
    });
    res.end();
}
exports.moveToken = moveToken;
