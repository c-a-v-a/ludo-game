// * Route for moving player's token
import { Request, Response } from 'express';
import { Room } from '../models/room-model';

function moveToken(req: Request, res: Response) {
  const tokenNumber = req.body.token;

  console.log(tokenNumber);

  Room.findById((req.session as any).playerId, (error: any, data: any) => {
    if (error)
      console.error(error);
    else {
      if ((req.session as any).playerNick === data.players[data.turn].nick && (req.session as any).playerColor === data.players[data.turn].color) {
        data.players[data.turn].tokens.set(tokenNumber, data.players[data.turn].tokens[tokenNumber] + data.dice);
        data.dice = 0;

        if (data.turn >= data.players.length)
          data.turn = 0
        else
          data.turn++;

        data.save()
          .then(() => console.log('moved token'));
      }
      else
        console.log('not ur turn');
    }
  });

  res.end();
}

export { moveToken };