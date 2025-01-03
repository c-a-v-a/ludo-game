import mongoose from 'mongoose';
const Schema = mongoose.Schema;

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
const roomSchema = new Schema(
  {
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
    turnStartTime: Number,
    dice: Number,
    winner: {
      nick: String,
      color: String,
    },
  },
  { timestamps: true }
);

// * Creating model
const Room = mongoose.model('room', roomSchema);

// * Exporting model
export { Room };
