import { Request, Response } from 'express';
import { Room } from '../models/room-model';

function checkIfGameWon(req: Request, res: Response) {
  Room.findById((req.session as any).playerId, (error: any, data: any) => {
    if (error) console.error(error);
    else {
      // if (data.players.length === 1) {
      //   res.redirect('/notFinished');
      //   return;
      // }

      for (let player of data.players) {
        let winner: boolean = true;

        for (let i = 0; i < player.house.length - 1; i++) {
          if (player.house[i] === 0) winner = false;
        }

        if (winner) {
          data.winner = {
            nick: player.nick,
            color: player.color,
          };
          break;
        }
      }

      data.save().then(() => {
        if (
          (req.session as any).playerNick === data.winner.nick &&
          (req.session as any).playerColor === data.winner.color
        )
          res.redirect('/winner');
        else if (data.winner.nick !== 'none' && data.winner.color !== 'none')
          res.redirect('/looser');
        else res.end();
      });
    }
  });
}

export { checkIfGameWon };
