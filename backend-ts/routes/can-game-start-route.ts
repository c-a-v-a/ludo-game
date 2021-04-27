// * Module for /canGameStart route
import { Request, Response } from 'express';
import { Room } from '../models/room-model';

/**
 * Function that determines if game can start
 * @param req {Request} - express request object
 * @param res {Response} - express response object
 */
function canGameStart(req: Request, res: Response) {
  if (req.session) {
    Room.findById((req.session as any).playerId, (error: any, data: any) => {
      let players: Array<any> = data.players;
      let isEveryoneReady: boolean = true;

      if (players.length < 2) {
        res.end();
        return;
      }

      for (let player of players) {
        if (player.ready === false) {
          isEveryoneReady = false;
          break;
        }
      }

      if (isEveryoneReady) {
        data.hasGameStarted = true;
        data.turnStartTime = Date.now();

        for (let player of players) {
          player.ready = true;
        }
      }

      data.save().catch((error: any) => console.log(error));
    });
  }
  res.end();
}

export { canGameStart };
