"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.diceRoll = void 0;
const room_model_1 = require("../models/room-model");
// ! Used @ts-ignore because of module error, works fine for now.
// @ts-ignore
const helper_functions_js_1 = require("../../helper-functions/js/helper-functions.js");
function diceRoll(req, res) {
    room_model_1.Room.findById(req.session.playerId, (error, data) => {
        if (error)
            console.error(error);
        if (req.session.playerNick !== data.players[data.turn].nick ||
            req.session.playerColor !== data.players[data.turn].color)
            return;
        if (data) {
            let diceRoll = helper_functions_js_1.randomInteger(1, 6);
            data.dice = diceRoll;
            checkIfPlayerCanMove(data, res, diceRoll);
            data
                .save()
                .then(console.log('dice rolled', diceRoll))
                .catch((error) => console.error(error));
        }
    });
}
exports.diceRoll = diceRoll;
function checkIfPlayerCanMove(data, res, diceRoll) {
    let player = data.players[data.turn];
    let canMove = false;
    for (let i = 0; i < player.tokens.length; i++) {
        if (player.tokens[i] === 0 && (data.dice === 1 || data.dice === 6)) {
            canMove = true;
            break;
        }
        else if (player.tokens[i] === 0) {
            canMove = false;
        }
        else if (player.tokens[i] > 100) {
            tokenMoveInHouse(data, i, res, canMove);
            if (canMove)
                break;
        }
        else if (checkIfLastMove(data, i)) {
            tokenLastMove(data, i, res, canMove);
            if (canMove)
                break;
        }
        else {
            canMove = true;
            break;
        }
    }
    if (!canMove) {
        if (data.turn >= data.players.length - 1)
            data.turn = 0;
        else
            data.turn++;
    }
    res.json({ canMove: canMove });
}
function tokenLastMove(data, tokenNumber, res, canMove) {
    const player = data.players[data.turn];
    let goal = player.goal - 1;
    if (goal === 0)
        goal += 40;
    const tokenHouse = data.dice - (goal - player.tokens[tokenNumber]) - 1;
    canMove = player.house[tokenHouse] === 0 ? true : false;
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
function tokenMoveInHouse(data, tokenNumber, res, canMove) {
    const player = data.players[data.turn];
    const tokenHouseId = player.tokens[tokenNumber] - player.goal * 100;
    canMove = player.house[tokenHouseId + data.dice] === 0 ? true : false;
}
