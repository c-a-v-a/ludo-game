// * Module for nick route
import { Response, Request } from 'express';
import mongoose from 'mongoose';
import { Room } from '../models/room-model.js';
// ! Used @ts-ignore because of module error, works fine for now.
// @ts-ignore
import { randomInteger } from '../../helper-functions/js/helper-functions.js';

/**
 * Function for /nick POST request 
 * @param req { Request } - request object from express 
 * @param res { Response } - response object from express
 */
function nickRouteFunction(req: Request, res: Response) {
  // * Finding existing room
  Room.findOne({ hasGameStarted: false })
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
};

/**
 * Creating new room, when no existing room is found
 * @param req { Request } - request object from express 
 * @param res { Response } - response object from express
 */
async function createNewRoom(req: Request, res: Response){
  const playerNick: string = req.body.nick; 
  const id = mongoose.Types.ObjectId();
  const tokens = [0, 0, 0, 0];
  let colors: Array<string> = [];
  let playerColor: string = '';

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
    const colorIndex: number = randomInteger(0, colors.length - 1);

    playerColor = colors[colorIndex];
    colors.splice(colorIndex, 1);
  }

  // Creating model object that will be inserted to mongodb
  const room = new Room({
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
    dice: 0,
  });

  // Inserting room object to mongodb
  room.save()
    .then((results) => { console.log('saved to db'); })
    .catch((err) => {console.log(err); });

  // Saving player info to player session
  (req.session as any).playerNick = playerNick;
  (req.session as any).playerId = id;
  (req.session as any).playerColor = playerColor;
}

/**
 * Adding player to room, when existing room is found
 * @param req { Request } - request object from express 
 * @param res { Response } - response object from express
 * @returns { Object | null } - returns object with players information, that will be saved to session
 */
async function addPlayerToRoom(req: Request, res: Response, doc: mongoose.Document) {
  const existingRoom = (doc as any);
  const id = existingRoom._id;
  const playerNick: string = req.body.nick;
  const tokens = [0, 0, 0, 0];
  let players: Array<object> = existingRoom.players;
  let availableColors: Array<string> = existingRoom.availableColors;
  let playerColor: string = '';

  // Set player color, from available colors
  if (availableColors) {
    const colorIndex: number = randomInteger(0, availableColors.length - 1);

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
    const player: object = {
      nick: playerNick,
      color: playerColor,
      ready: false,
      tokens: tokens,
    }

    players.push(player);
  }
  else {
    // Error msg
    console.error('Could not find players array id db record');
  }

  // Start game when there are four players in the room
  if (players.length === 4) {
    (doc as any).hasGameStarted = true;
  }

  // Update record
  (doc as any).players = players;
  (doc as any).availableColors = availableColors;

  // Save update in db
  doc.save()
    .then(() => console.log('added player to room'))
    .catch((err) => console.error(err));

  // Save player info to session
  (req.session as any).playerNick = playerNick;
  (req.session as any).playerId = id;
  (req.session as any).playerColor = playerColor;
};

export { nickRouteFunction };