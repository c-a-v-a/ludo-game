// * Module for /changePlayerState route
import { Request, Response } from 'express';
import { Room } from '../models/room-model';

/**
 * Functions that changes player state (changes ready from player object for true|false)
 * @param req {Request} - express request object
 * @param res {Response} - express response object
 */
function changePlayerState(req: Request, res: Response) {
  if (req.body && req.session) {
    const ready: boolean = req.body.ready;
    const nick: string = (req.session as any).playerNick;

    Room.findById((req.session as any).playerId, (error: any, data: any) => {
      if (data.hasGameStarted) return;

      let players: Array<any> = data.players;

      for (let player of players) {
        if (
          player.nick === (req.session as any).playerNick &&
          player.color === (req.session as any).playerColor
        ) {
          player.ready = ready;
        }
      }

      data.players = players;

      data
        .save()
        .then(res.redirect(308, '/canGameStart'))
        .catch((err: any) => console.log(err));
    });
  }
}

export { changePlayerState };
