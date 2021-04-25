"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ghostToken = void 0;
const room_model_1 = require("../models/room-model");
function ghostToken(req, res) {
    const tokenNumber = req.body.token;
    room_model_1.Room.findById(req.session.playerId, (error, data) => {
        if (error)
            console.error(error);
        else {
            if (req.session.playerNick === data.players[data.turn].nick &&
                req.session.playerColor === data.players[data.turn].color) {
                const player = data.players[data.turn];
                if (player.tokens[tokenNumber] === 0 && (data.dice === 1 || data.dice === 6)) {
                    tokenGoOut(data, tokenNumber, res);
                    console.log(1);
                }
                else if (player.tokens[tokenNumber] === 0) {
                    res.json({ canMove: false, position: 0 });
                    console.log(2);
                }
                else if (player.tokens[tokenNumber] > 100) {
                    tokenMoveInHouse(data, tokenNumber, res);
                    console.log(3);
                }
                else if (checkIfLastMove(data, tokenNumber)) {
                    tokenLastMove(data, tokenNumber, res);
                    console.log(4);
                }
                else {
                    tokenMove(data, tokenNumber, res);
                    console.log(5);
                }
            }
            else {
                res.json({ canMove: false });
            }
        }
    });
}
exports.ghostToken = ghostToken;
function tokenGoOut(data, tokenNumber, res) {
    res.json({ canMove: true, position: data.players[data.turn].goal });
    console.log(data.players[data.turn]);
}
function tokenMove(data, tokenNumber, res) {
    const player = data.players[data.turn];
    if (player.tokens[tokenNumber] + data.dice > 40)
        res.json({
            canMove: true,
            position: player.tokens[tokenNumber] + data.dice - 40,
        });
    else
        res.json({
            canMove: true,
            position: player.tokens[tokenNumber] + data.dice,
        });
}
function tokenLastMove(data, tokenNumber, res) {
    const player = data.players[data.turn];
    let goal = player.goal - 1;
    if (goal === 0)
        goal += 40;
    const tokenHouse = data.dice - (goal - player.tokens[tokenNumber]) - 1;
    if (player.house[tokenHouse] === 0) {
        res.json({ canMove: true, position: player.goal * 100 + tokenHouse });
        console.log('moved to house');
    }
    else
        res.json({ canMove: false, position: 0 });
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
function tokenMoveInHouse(data, tokenNumber, res) {
    const player = data.players[data.turn];
    const tokenHouseId = player.tokens[tokenNumber] - player.goal * 100;
    if (player.house[tokenHouseId + data.dice] === 0) {
        res.json({
            canMove: true,
            position: player.tokens[tokenNumber] + data.dice,
        });
    }
    else
        res.json({ canMove: false, position: 0 });
}
