"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkIfCanMove = void 0;
const room_model_1 = require("../models/room-model");
function checkIfCanMove(req, res) {
    room_model_1.Room.findById(req.session.playerId, (error, data) => {
        if (error)
            console.error(error);
        else {
            if (req.session.playerNick === data.players[data.turn].nick &&
                req.session.playerColor === data.players[data.turn].color) {
                const player = data.players[data.turn];
                let canMove = false;
                for (let tokenNumber = 0; tokenNumber < player.tokens.length; tokenNumber++) {
                    if (player.tokens[tokenNumber] === 0 && (data.dice === 1 || data.dice === 6)) {
                        canMove = true;
                        break;
                    }
                    else if (player.tokens[tokenNumber] === 0) {
                        canMove = false;
                    }
                    else if (player.tokens[tokenNumber] > 100) {
                        tokenMoveInHouse(data, tokenNumber, res, canMove);
                        if (canMove)
                            break;
                    }
                    else if (checkIfLastMove(data, tokenNumber)) {
                        tokenLastMove(data, tokenNumber, res, canMove);
                        if (canMove)
                            break;
                    }
                    else {
                        canMove = true;
                        break;
                    }
                }
                if (canMove === false) {
                    if (data.turn >= data.players.length - 1)
                        data.turn = 0;
                    else
                        data.turn++;
                    data.turnStartTime = Date.now();
                    data.dice = 0;
                    data.save();
                }
            }
        }
    });
}
exports.checkIfCanMove = checkIfCanMove;
function tokenLastMove(data, tokenNumber, res, canMove) {
    const player = data.players[data.turn];
    let goal = player.goal - 1;
    if (goal === 0)
        goal += 40;
    const tokenHouse = data.dice - (goal - player.tokens[tokenNumber]) - 1;
    if (player.house[tokenHouse] === 0) {
        canMove = true;
    }
    else
        canMove = false;
}
function checkIfLastMove(data, tokenNumber) {
    const player = data.players[data.turn];
    let goal = player.goal - 1;
    if (goal === 0)
        goal += 40;
    if (player.tokens[tokenNumber] < goal && player.tokens[tokenNumber] + data.dice > goal)
        return true;
    else
        return false;
}
function tokenMoveInHouse(data, tokenNumber, res, canMove) {
    const player = data.players[data.turn];
    const tokenHouseId = player.tokens[tokenNumber] - player.goal * 100;
    if (player.house[tokenHouseId + data.dice] === 0) {
        canMove = true;
    }
    else
        canMove = false;
}
