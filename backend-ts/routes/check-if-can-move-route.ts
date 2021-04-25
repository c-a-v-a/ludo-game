// * Route for moving player's token
import { Request, Response } from 'express';
import { Room } from '../models/room-model';

function checkIfCanMove(req: Request, res: Response) {
  Room.findById((req.session as any).playerId, (error: any, data: any) => {
    if (error) console.error(error);
    else {
      if (
        (req.session as any).playerNick === data.players[data.turn].nick &&
        (req.session as any).playerColor === data.players[data.turn].color
      ) {
        const player = data.players[data.turn];
        let canMove = false;

        for (let tokenNumber = 0; tokenNumber < player.tokens.length; tokenNumber++) {
          if (player.tokens[tokenNumber] === 0 && (data.dice === 1 || data.dice === 6)) {
            canMove = true;
            break;
          } else if (player.tokens[tokenNumber] === 0) {
            canMove = false;
          } else if (player.tokens[tokenNumber] > 100) {
            tokenMoveInHouse(data, tokenNumber, res, canMove);
            if (canMove) break;
          } else if (checkIfLastMove(data, tokenNumber)) {
            tokenLastMove(data, tokenNumber, res, canMove);
            if (canMove) break;
          } else {
            canMove = true;
            break;
          }
        }

        if (canMove === false) {
          if (data.turn >= data.players.length - 1) data.turn = 0;
          else data.turn++;

          data.turnStartTime = Date.now();
          data.dice = 0;

          data.save();
        }
      }
    }
  });
}

function tokenLastMove(data: any, tokenNumber: number, res: Response, canMove: boolean) {
  const player = data.players[data.turn];
  let goal = player.goal - 1;

  if (goal === 0) goal += 40;

  const tokenHouse = data.dice - (goal - player.tokens[tokenNumber]) - 1;

  if (player.house[tokenHouse] === 0) {
    canMove = true;
  } else canMove = false;
}

function checkIfLastMove(data: any, tokenNumber: number): boolean {
  const player = data.players[data.turn];
  let goal = player.goal - 1;

  if (goal === 0) goal += 40;

  if (player.tokens[tokenNumber] < goal && player.tokens[tokenNumber] + data.dice > goal)
    return true;
  else return false;
}

function tokenMoveInHouse(data: any, tokenNumber: number, res: Response, canMove: boolean) {
  const player = data.players[data.turn];
  const tokenHouseId = player.tokens[tokenNumber] - player.goal * 100;

  if (player.house[tokenHouseId + data.dice] === 0) {
    canMove = true;
  } else canMove = false;
}

export { checkIfCanMove };
