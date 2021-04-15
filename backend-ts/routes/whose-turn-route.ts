// * Module for /whoseTurn route.
import { Request, Response } from 'express';
import { Room } from '../models/room-model'

/**
 * Function that check if its player turn
 * @param req {Request} - express request object
 * @param res {Response} - express response object
 */
function whoseTurn(req: Request, res: Response) {
  Room.findById((req.session as any).playerId, (error: any, data:any) => {
    if (error)
      console.log(error);

    if (data.players[data.turn].nick === (req.session as any).playerNick && data.players[data.turn].color === (req.session as any).playerColor)
      res.json({ myTurn: true });
    else
      res.json({ myTurn: false });
  });
}

export { whoseTurn };