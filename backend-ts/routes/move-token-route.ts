// * Route for moving player's token
import { Request, Response } from 'express';
import { Room } from '../models/room-model';

function moveToken(req: Request, res: Response) {
  const tokenNumber = req.body.token;

  Room.findById((req.session as any).playerId, (error: any, data: any) => {
    if (error) console.error(error);
    else {
      if (
        (req.session as any).playerNick === data.players[data.turn].nick &&
        (req.session as any).playerColor === data.players[data.turn].color
      ) {
        const square: number =
          data.players[data.turn].tokens[tokenNumber] + data.dice;

        if (
          data.players[data.turn].tokens[tokenNumber] === 0 &&
          (data.dice === 1 || data.dice === 6)
        ) {
          tokenGoOut(data, tokenNumber);
          res.send('moved');
        } else if (data.players[data.turn].tokens[tokenNumber] === 0) {
          res.send('cant move that token');
        } else if (
          data.players[data.turn].tokens[tokenNumber] <
            data.players[data.turn].goal &&
          data.players[data.turn].tokens[tokenNumber] + data.dice >
            data.players[data.turn].goal
        ) {
          tokenLastMove(data, tokenNumber);
          res.send('moved');
        } else {
          tokenMove(data, tokenNumber);
          res.send('moved');
        }

        if (data.players[data.turn].tokens[tokenNumber] === 0) {
          tokenCapture(
            data,
            square,
            (req.session as any).playerNick,
            (req.session as any).playerColor
          );
        }

        if (data.players[data.turn].tokens[tokenNumber] === data.players[data.turn].goal)
          data.players[data.turn].tokens.set(tokenNumber, data.players[data.turn].goal * 100);

        // TODO: change goal, (for color)
      } else {
        console.log('not ur turn');
        res.send('not your turn');
      }
    }
  });
}

function tokenGoOut(data: any, tokenNumber: number) {
  data.players[data.turn].tokens.set(tokenNumber, data.players[data.turn].goal);
}

function tokenMove(data: any, tokenNumber: number) {
  if (data.players[data.turn].tokens[data.turn] + data.dice > 40)
    data.players[data.turn].tokens.set(
      tokenNumber,
      data.players[data.turn].tokens[tokenNumber] + data.dice - 40
    );
  else
    data.players[data.turn].tokens.set(
      tokenNumber,
      data.players[data.turn].tokens[tokenNumber] + data.dice
    );
}

function tokenCapture(data: any, square: number, nick: string, color: string) {
  for (let player of data.players) {
    if (player.nick !== nick || player.color !== color) {
      for (let i = 0; i < player.tokens.length; i++) {
        if (player.tokens === square) player.tokens.set(i, 0);
      }
    }
  }
}

// TODO Test all functions
function tokenLastMove(data: any, tokenNumber: number) {
  let goal = data.players[data.turn].goal;

  if (goal === 1) goal += 40;

  data.players[data.turn].tokens.set(
    tokenNumber,
    data.players[data.turn].tokens[tokenNumber] -
      (data.dice -
        (2 *
          (data.players[data.turn].goal -
            data.players[data.turn].tokens[tokenNumber])))
  );
}

export { moveToken };
