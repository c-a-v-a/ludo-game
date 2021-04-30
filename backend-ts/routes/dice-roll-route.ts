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
      (req.session as any).playerColor !== data.players[data.turn].color ||
      data.dice !== 0
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
      console.log('1d');
      break;
    } else if (player.tokens[i] === 0) {
      canMove = false;
      console.log('2d');
    } else if (player.tokens[i] > 100) {
      if (tokenMoveInHouse(data, i, canMove, diceRoll)) {
        canMove = true;
        break;
      }
      console.log('3d');
      if (canMove) break;
    } else if (checkIfLastMove(data, i, diceRoll)) {
      if (tokenLastMove(data, i, canMove, diceRoll)) {
        canMove = true;
        break;
      }
      console.log('4d');
      // if (canMove) break;
    } else {
      canMove = true;
      console.log('5d');
      break;
    }
  }
  console.log(canMove);
  if (!canMove) {
    if (data.turn >= data.players.length - 1) data.turn = 0;
    else data.turn++;

    data.dice = 0;

    data.turnStartTime = Date.now();
  }

  res.json({ canMove: canMove, rolled: diceRoll });
}

function tokenLastMove(data: any, tokenNumber: number, canMove: boolean, diceRoll: number) {
  const player = data.players[data.turn];
  let goal = player.goal - 1;

  if (goal === 0) goal += 40;

  const tokenHouse = diceRoll - (goal - player.tokens[tokenNumber]) - 1;

  // canMove = player.house[tokenHouse] === 0 ? true : false;

  if (player.house[tokenHouse] === 0) return true;
  else return false;

  // console.log(player, goal, tokenHouse, diceRoll, canMove);
}

function checkIfLastMove(data: any, tokenNumber: number, diceRoll: number): boolean {
  const player = data.players[data.turn];
  let goal = player.goal - 1;

  if (goal === 0) goal += 40;

  console.log(player, goal, diceRoll);

  if (player.tokens[tokenNumber] <= goal && player.tokens[tokenNumber] + diceRoll > goal)
    return true;
  else return false;
}

function tokenMoveInHouse(data: any, tokenNumber: number, canMove: boolean, diceRoll: number) {
  const player = data.players[data.turn];
  const tokenHouseId = player.tokens[tokenNumber] - player.goal * 100;

  // canMove = player.house[tokenHouseId + diceRoll] === 0 ? true : false;

  if (player.house[tokenHouseId + diceRoll] === 0) return true;
  else return false;
}

export { diceRoll };
