import { Request, Response } from 'express';
import { Room } from '../models/room-model';

function skipPlayerTurn(req: Request, res: Response) {
  Room.findById((req.session as any).playerId, (error: any, data: any) => {
    if (error) console.error(error);
    else {
      if (hasTurnEnded(data)) {
        if (data.turn >= data.players.length - 1) data.turn = 0;
        else data.turn++;

        data.turnStartTime = Date.now();
        data.dice = 0;

        data.save();

        res.json({ skipped: true });
      } else res.json({ skipped: false });
    }
  });
}

function hasTurnEnded(data: any) {
  if (Date.now() - data.turnStartTime >= 60000) return true;
  else return false;
}

export { skipPlayerTurn };
