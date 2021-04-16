// * Module for '/diceRoll' route
import { Request, Response } from 'express';
import { Room } from '../models/room-model';
// ! Used @ts-ignore because of module error, works fine for now.
// @ts-ignore
import { randomInteger } from '../../helper-functions/js/helper-functions.js';

function diceRoll(req: Request, res: Response) {
  Room.findById((req.session as any).playerId, (error: any, data: any) => {
    if (error)
      console.error(error);

    if (data) {
      let diceRoll = randomInteger(1, 6);

      data.dice = diceRoll;

      data.save()
        .then(console.log('dice rolled', diceRoll))
        .catch((error: any) => console.error(error));
    }
  });

  res.end();
}

export { diceRoll };