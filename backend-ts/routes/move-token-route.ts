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
        const player = data.players[data.turn];

        if (player.tokens[tokenNumber] === 0 && (data.dice === 1 || data.dice === 6)) {
          tokenGoOut(data, tokenNumber);
        } else if (player.tokens[tokenNumber] === 0) {
        } else if (player.tokens[tokenNumber] > 100) {
          tokenMoveInHouse(data, tokenNumber);
        } else if (checkIfLastMove(data, tokenNumber)) {
          tokenLastMove(data, tokenNumber);
        } else {
          tokenMove(data, tokenNumber);
          res.send('moved');
        }

        if (player.tokens[tokenNumber] !== 0) {
          tokenCapture(
            data,
            player.tokens[tokenNumber],
            (req.session as any).playerNick,
            (req.session as any).playerColor
          );
        }

        data.dice = 0;
        data.turnStartTime = Date.now();

        if (data.turn >= data.players.length - 1) data.turn = 0;
        else data.turn++;

        data.save();
      } else {
        res.end();
      }
    }
  });
}

function tokenGoOut(data: any, tokenNumber: number) {
  data.players[data.turn].tokens.set(tokenNumber, data.players[data.turn].goal);
  // data.players[data.turn].tokens[tokenNumber] = data.players[data.turn].goal;
}

function tokenMove(data: any, tokenNumber: number) {
  const player = data.players[data.turn];

  if (player.tokens[tokenNumber] + data.dice > 40)
    player.tokens.set(tokenNumber, player.tokens[tokenNumber] + data.dice - 40);
  else player.tokens.set(tokenNumber, player.tokens[tokenNumber] + data.dice);
}

function tokenCapture(data: any, square: number, nick: string, color: string) {
  for (let player of data.players) {
    if (player.nick !== nick || player.color !== color) {
      for (let i = 0; i < player.tokens.length; i++) {
        if (player.tokens[i] === square) player.tokens.set(i, 0);
      }
    }
  }
}

// TODO Add speech synthesis
function tokenLastMove(data: any, tokenNumber: number) {
  const player = data.players[data.turn];
  let goal = player.goal - 1;

  if (goal === 0) goal += 40;

  const tokenHouse = data.dice - (goal - player.tokens[tokenNumber]) - 1;

  if (player.house[tokenHouse] === 0) {
    player.house.set(tokenHouse, 1);
    player.tokens.set(tokenNumber, player.goal * 100 + tokenHouse);
  }
  console.log(player, data.dice);
}

function checkIfLastMove(data: any, tokenNumber: number): boolean {
  const player = data.players[data.turn];
  let goal = player.goal - 1;

  if (goal === 0) goal += 40;

  if (player.tokens[tokenNumber] <= goal && player.tokens[tokenNumber] + data.dice > goal)
    return true;
  else return false;
}

function tokenMoveInHouse(data: any, tokenNumber: number) {
  const player = data.players[data.turn];
  const tokenHouseId = player.tokens[tokenNumber] - player.goal * 100;

  if (player.house[tokenHouseId + data.dice] === 0) {
    player.house.set(tokenHouseId, 0);
    player.house.set(tokenHouseId + data.dice, 1);
    player.tokens.set(tokenNumber, player.tokens[tokenNumber] + data.dice);
  }

  console.log(player, data.dice);
}

export { moveToken };
