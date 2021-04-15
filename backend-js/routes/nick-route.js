"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.nickRouteFunction = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const room_model_js_1 = require("../models/room-model.js");
// ! Used @ts-ignore because of module error, works fine for now.
// @ts-ignore
const helper_functions_js_1 = require("../../helper-functions/js/helper-functions.js");
require('dotenv').config();
/**
 * Function for /nick POST request
 * @param req { Request } - request object from express
 * @param res { Response } - response object from express
 */
function nickRouteFunction(req, res) {
    // * Finding existing room
    room_model_js_1.Room.findOne({ hasGameStarted: false })
        .then((doc) => {
        if (doc) {
            // If room is found
            addPlayerToRoom(req, res, doc)
                .then(() => res.redirect('/room'));
        }
        else {
            // If no room was found
            createNewRoom(req, res)
                .then(() => res.redirect('/room'));
        }
    })
        .catch((err) => console.error(err));
}
exports.nickRouteFunction = nickRouteFunction;
;
/**
 * Creating new room, when no existing room is found
 * @param req { Request } - request object from express
 * @param res { Response } - response object from express
 */
async function createNewRoom(req, res) {
    const playerNick = req.body.nick;
    const id = mongoose_1.default.Types.ObjectId();
    const tokens = [0, 0, 0, 0];
    let colors = [];
    let playerColor = '';
    // Creating color array
    if (process.env.COLORS_ARRAY) {
        colors = process.env.COLORS_ARRAY.split(',');
    }
    else {
        console.error('Could not find COLORS_ARRAY in environment variables');
        return;
    }
    // Assign color to player and remove this colors from available colors array
    if (colors) {
        const colorIndex = helper_functions_js_1.randomInteger(0, colors.length - 1);
        playerColor = colors[colorIndex];
        colors.splice(colorIndex, 1);
    }
    // Creating model object that will be inserted to mongodb
    const room = new room_model_js_1.Room({
        _id: id,
        hasGameStarted: false,
        players: [
            {
                nick: playerNick,
                color: playerColor,
                ready: false,
                tokens: tokens,
            },
        ],
        availableColors: colors,
        turn: 0,
    });
    // Inserting room object to mongodb
    room.save()
        .then((results) => { console.log('saved to db'); })
        .catch((err) => { console.log(err); });
    // Saving player info to player session
    req.session.playerNick = playerNick;
    req.session.playerId = id;
    req.session.playerColor = playerColor;
}
/**
 * Adding player to room, when existing room is found
 * @param req { Request } - request object from express
 * @param res { Response } - response object from express
 * @returns { Object | null } - returns object with players information, that will be saved to session
 */
async function addPlayerToRoom(req, res, doc) {
    const existingRoom = doc;
    const id = existingRoom._id;
    const playerNick = req.body.nick;
    const tokens = [0, 0, 0, 0];
    let players = existingRoom.players;
    let availableColors = existingRoom.availableColors;
    let playerColor = '';
    // Set player color, from available colors
    if (availableColors) {
        const colorIndex = helper_functions_js_1.randomInteger(0, availableColors.length - 1);
        playerColor = availableColors[colorIndex];
        availableColors.splice(colorIndex, 1);
    }
    else {
        // Error msg
        console.error('Could not find color array in db record');
        return;
    }
    // Setup player object and push it to players array
    if (players) {
        const player = {
            nick: playerNick,
            color: playerColor,
            ready: false,
            tokens: tokens,
        };
        players.push(player);
    }
    else {
        // Error msg
        console.error('Could not find players array id db record');
    }
    // Start game when there are four players in the room
    if (players.length === 4) {
        doc.hasGameStarted = true;
    }
    // Update record
    doc.players = players;
    doc.availableColors = availableColors;
    // Save update in db
    doc.save()
        .then(() => console.log('added player to room'))
        .catch((err) => console.error(err));
    // Save player info to session
    req.session.playerNick = playerNick;
    req.session.playerId = id;
    req.session.playerColor = playerColor;
}
;
