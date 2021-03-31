import mongoose from 'mongoose';
const Schema = mongoose.Schema;

// * Creating schema
// _id - db record id
// hasGameStarted - true if game started in this room
// players - array of player objects
//    nick - player's nick
//    color - player's color (randomly picked)
// openColors - array of not chosen colors in this room
const roomSchema = new Schema({
  _id: Schema.Types.ObjectId,
  hasGameStarted: Boolean,
  players: [
    {
      nick: String,
      color: String,
    },
  ],
  availableColors: [ String ],
}, { timestamps: true, });

// * Creating model
const Room = mongoose.model('room', roomSchema);

// * Exporting model
export { Room };