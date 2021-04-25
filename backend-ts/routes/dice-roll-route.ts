// * Module for '/diceRoll' route
import { Request, Response } from 'express';
import { Room } from '../models/room-model';
// ! Used @ts-ignore because of module error, works fine for now.
// @ts-ignore
import { randomInteger } from '../../helper-functions/js/helper-functions.js';

function diceRoll(req: Request, res: Response) {
  Room.findById((req.session as any).playerId, (error: any, data: any) => {
    if (error) console.error(error);

    if (
      (req.session as any).playerNick !== data.players[data.turn].nick ||
      (req.session as any).playerColor !== data.players[data.turn].color
    )
      return;

    if (data) {
      let diceRoll = randomInteger(1, 6);

      data.dice = diceRoll;

      checkIfPlayerCanMove(data, res, diceRoll);

      data
        .save()
        .then(console.log('dice rolled', diceRoll))
        .catch((error: any) => console.error(error));
    }
  });
}

function checkIfPlayerCanMove(data: any, res: Response, diceRoll: number) {
  let player = data.players[data.turn];
  let canMove: boolean = false;

  for (let i = 0; i < player.tokens.length; i++) {
    if (player.tokens[i] === 0 && (data.dice === 1 || data.dice === 6)) {
      canMove = true;
      break;
    } else if (player.tokens[i] === 0) {
      canMove = false;
    } else if (player.tokens[i] > 100) {
      tokenMoveInHouse(data, i, res, canMove);
      if (canMove) break;
    } else if (checkIfLastMove(data, i)) {
      tokenLastMove(data, i, res, canMove);
      if (canMove) break;
    } else {
      canMove = true;
      break;
    }
  }

  if (!canMove) {
    if (data.turn >= data.players.length - 1) data.turn = 0;
    else data.turn++;
  }

  res.json({ canMove: canMove });
}

function tokenLastMove(data: any, tokenNumber: number, res: Response, canMove: boolean) {
  const player = data.players[data.turn];
  let goal = player.goal - 1;

  if (goal === 0) goal += 40;

  const tokenHouse = data.dice - (goal - player.tokens[tokenNumber]) - 1;

  canMove = player.house[tokenHouse] === 0 ? true : false;
}

function checkIfLastMove(data: any, tokenNumber: number): boolean {
  const player = data.players[data.turn];
  let goal = player.goal - 1;

  if (goal === 0) goal += 40;

  if (player.tokens[tokenNumber] <= goal && player.tokens[tokenNumber] + data.dice > goal)
    return true;
  else return false;
}

function tokenMoveInHouse(data: any, tokenNumber: number, res: Response, canMove: boolean) {
  const player = data.players[data.turn];
  const tokenHouseId = player.tokens[tokenNumber] - player.goal * 100;

  canMove = player.house[tokenHouseId + data.dice] === 0 ? true : false;
}

export { diceRoll };
