"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Room = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
// * Creating schema
// _id - db record id
// hasGameStarted - true if game started in this room
// players - array of player objects
//    nick - player's nick
//    color - player's color (randomly picked)
//    ready - is player ready
//    tokens - tokens position
//    goal - last field that token has to go to
// turn - whose turn
// dice - last dice roll or zero
// openColors - array of not chosen colors in this room
const roomSchema = new Schema({
    _id: Schema.Types.ObjectId,
    hasGameStarted: Boolean,
    players: [
        {
            nick: String,
            color: String,
            ready: Boolean,
            tokens: [Number],
            goal: Number,
            house: [Number],
        },
    ],
    availableColors: [String],
    turn: Number,
    dice: Number,
}, { timestamps: true, });
// * Creating model
const Room = mongoose_1.default.model('room', roomSchema);
exports.Room = Room;
