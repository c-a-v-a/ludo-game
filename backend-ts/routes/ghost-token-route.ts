// * Route for moving player's token
import { Request, Response } from 'express';
import { Room } from '../models/room-model';

function ghostToken(req: Request, res: Response) {
  const tokenNumber = req.body.token;

  Room.findById((req.session as any).playerId, (error: any, data: any) => {
    if (error) console.error(error);
    else {
      if (
        (req.session as any).playerNick === data.players[data.turn].nick &&
        (req.session as any).playerColor === data.players[data.turn].color
      ) {
        const player = data.players[data.turn];

        if (player.tokens[tokenNumber] === 0 && (data.dice === 1 || data.dice === 6)) {
          tokenGoOut(data, tokenNumber, res);
        } else if (player.tokens[tokenNumber] === 0) {
          res.json({ canMove: false, position: 0 });
        } else if (player.tokens[tokenNumber] > 100) {
          tokenMoveInHouse(data, tokenNumber, res);
        } else if (checkIfLastMove(data, tokenNumber)) {
          tokenLastMove(data, tokenNumber, res);
        } else {
          tokenMove(data, tokenNumber, res);
        }
      } else {
        res.json({ canMove: false });
      }
    }
  });
}

function tokenGoOut(data: any, tokenNumber: number, res: Response) {
  res.json({ canMove: true, position: data.players[data.turn].goal });
}

function tokenMove(data: any, tokenNumber: number, res: Response) {
  const player = data.players[data.turn];

  if (player.tokens[tokenNumber] + data.dice > 40)
    res.json({
      canMove: true,
      position: player.tokens[tokenNumber] + data.dice - 40,
    });
  else
    res.json({
      canMove: true,
      position: player.tokens[tokenNumber] + data.dice,
    });
}

function tokenLastMove(data: any, tokenNumber: number, res: Response) {
  const player = data.players[data.turn];
  let goal = player.goal - 1;

  if (goal === 0) goal += 40;

  const tokenHouse = data.dice - (goal - player.tokens[tokenNumber]) - 1;

  if (player.house[tokenHouse] === 0) {
    res.json({ canMove: true, position: player.goal * 100 + tokenHouse });
  } else res.json({ canMove: false, position: 0 });
}

function checkIfLastMove(data: any, tokenNumber: number): boolean {
  const player = data.players[data.turn];
  let goal = player.goal - 1;

  if (goal === 0) goal += 40;

  if (player.tokens[tokenNumber] <= goal && player.tokens[tokenNumber] + data.dice > goal)
    return true;
  else return false;
}

function tokenMoveInHouse(data: any, tokenNumber: number, res: Response) {
  const player = data.players[data.turn];
  const tokenHouseId = player.tokens[tokenNumber] - player.goal * 100;

  if (player.house[tokenHouseId + data.dice] === 0) {
    res.json({
      canMove: true,
      position: player.tokens[tokenNumber] + data.dice,
    });
  } else res.json({ canMove: false, position: 0 });
}

export { ghostToken };
