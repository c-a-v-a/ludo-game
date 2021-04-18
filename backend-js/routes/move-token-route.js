"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.moveToken = void 0;
const room_model_1 = require("../models/room-model");
function moveToken(req, res) {
    const tokenNumber = req.body.token;
    room_model_1.Room.findById(req.session.playerId, (error, data) => {
        if (error)
            console.error(error);
        else {
            if (req.session.playerNick === data.players[data.turn].nick &&
                req.session.playerColor === data.players[data.turn].color) {
                if (data.players[data.turn].tokens[tokenNumber] === 0 &&
                    (data.dice === 1 || data.dice === 6)) {
                    console.log('go out');
                }
                else if (data.players[data.turn].tokens[tokenNumber] === 0) {
                    console.log('cant go out');
                }
                else if (data.players[data.turn].tokens[tokenNumber] <
                    data.players[data.turn].goal &&
                    data.players[data.turn].tokens[tokenNumber] + data.dice >
                        data.players[data.turn].goal) {
                    console.log('move token + backwards');
                }
                else {
                    console.log('move token');
                }
            }
            else
                console.log('not ur turn');
        }
    });
    res.end();
}
exports.moveToken = moveToken;
function tokenGoOut(data, tokenNumber) {
    data.players[data.turn].tokens.set(tokenNumber, data.players[data.turn].goal);
}
function tokenMove(data, tokenNumber) {
    if (data.players[data.turn].tokens[data.turn] + data.dice > 40)
        data.players[data.turn].tokens.set(tokenNumber, data.players[data.turn].tokens[tokenNumber] + data.dice - 40);
    else
        data.players[data.turn].tokens.set(tokenNumber, data.players[data.turn].tokens[tokenNumber] + data.dice);
}
function tokenCapture(data, square, nick, color) {
    for (let player of data.players) {
        if (player.nick !== nick || player.color !== color) {
            for (let i = 0; i < player.tokens.length; i++) {
                if (player.tokens === square)
                    player.tokens.set(i, 0);
            }
        }
    }
}
// TODO Exact last move
// TODO Test all functions
function tokenLastMove(data, tokenNumber) { }
