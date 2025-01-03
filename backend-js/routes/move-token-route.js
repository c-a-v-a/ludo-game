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
                const player = data.players[data.turn];
                if (player.tokens[tokenNumber] === 0 && (data.dice === 1 || data.dice === 6)) {
                    tokenGoOut(data, tokenNumber);
                }
                else if (player.tokens[tokenNumber] === 0) {
                }
                else if (player.tokens[tokenNumber] > 100) {
                    tokenMoveInHouse(data, tokenNumber);
                }
                else if (checkIfLastMove(data, tokenNumber)) {
                    tokenLastMove(data, tokenNumber);
                }
                else {
                    tokenMove(data, tokenNumber);
                    res.send('moved');
                }
                if (player.tokens[tokenNumber] !== 0) {
                    tokenCapture(data, player.tokens[tokenNumber], req.session.playerNick, req.session.playerColor);
                }
                data.dice = 0;
                if (data.turn >= data.players.length - 1)
                    data.turn = 0;
                else
                    data.turn++;
                data.turnStartTime = Date.now();
                data.save();
            }
            else {
                res.end();
            }
        }
    });
}
exports.moveToken = moveToken;
function tokenGoOut(data, tokenNumber) {
    data.players[data.turn].tokens.set(tokenNumber, data.players[data.turn].goal);
    // data.players[data.turn].tokens[tokenNumber] = data.players[data.turn].goal;
}
function tokenMove(data, tokenNumber) {
    const player = data.players[data.turn];
    if (player.tokens[tokenNumber] + data.dice > 40)
        player.tokens.set(tokenNumber, player.tokens[tokenNumber] + data.dice - 40);
    else
        player.tokens.set(tokenNumber, player.tokens[tokenNumber] + data.dice);
}
function tokenCapture(data, square, nick, color) {
    for (let player of data.players) {
        if (player.nick !== nick || player.color !== color) {
            for (let i = 0; i < player.tokens.length; i++) {
                if (player.tokens[i] === square)
                    player.tokens.set(i, 0);
            }
        }
    }
}
function tokenLastMove(data, tokenNumber) {
    const player = data.players[data.turn];
    let goal = player.goal - 1;
    if (goal === 0)
        goal += 40;
    const tokenHouse = data.dice - (goal - player.tokens[tokenNumber]) - 1;
    if (player.house[tokenHouse] === 0) {
        player.house.set(tokenHouse, 1);
        player.tokens.set(tokenNumber, player.goal * 100 + tokenHouse);
    }
    console.log(player, data.dice);
}
function checkIfLastMove(data, tokenNumber) {
    const player = data.players[data.turn];
    let goal = player.goal - 1;
    if (goal === 0)
        goal += 40;
    if (player.tokens[tokenNumber] <= goal && player.tokens[tokenNumber] + data.dice > goal)
        return true;
    else
        return false;
}
function tokenMoveInHouse(data, tokenNumber) {
    const player = data.players[data.turn];
    const tokenHouseId = player.tokens[tokenNumber] - player.goal * 100;
    if (player.house[tokenHouseId + data.dice] === 0) {
        player.house.set(tokenHouseId, 0);
        player.house.set(tokenHouseId + data.dice, 1);
        player.tokens.set(tokenNumber, player.tokens[tokenNumber] + data.dice);
    }
    console.log(player, data.dice);
}
