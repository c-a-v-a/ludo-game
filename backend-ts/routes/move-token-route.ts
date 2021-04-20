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
        const square: number = player.tokens[tokenNumber] + data.dice;

        if (
          player.tokens[tokenNumber] === 0 &&
          (data.dice === 1 || data.dice === 6)
        ) {
          tokenGoOut(data, tokenNumber);
          console.log('went out')
        } 
        else if (player.tokens[tokenNumber] === 0) {
          console.log('cant go out')
        } 
        else if (player.tokens[tokenNumber] > 100) {
          tokenMoveInHouse(data, tokenNumber);
        } 
        else if (checkIfLastMove(data, tokenNumber)) {
          tokenLastMove(data, tokenNumber);
        } 
        else {
          tokenMove(data, tokenNumber);
          res.send('moved');
        }

        if (player.tokens[tokenNumber] !== 0) {
          tokenCapture(
            data,
            square,
            (req.session as any).playerNick,
            (req.session as any).playerColor
          );
        }

        data.save();

        // TODO: change goal, (for color)
      } else {
        console.log('not ur turn');
      }
    }
  });
}

function tokenGoOut(data: any, tokenNumber: number) {
  data.players[data.turn].tokens.set(tokenNumber, data.players[data.turn].goal);
  console.log(data.players[data.turn]);

  data.players[data.turn].tokens[tokenNumber] = data.players[data.turn].goal;
}

function tokenMove(data: any, tokenNumber: number) {
  const player = data.players[data.turn];

  if (player.tokens[data.turn] + data.dice > 40)
    player.tokens.set(tokenNumber, player.tokens[tokenNumber] + data.dice - 40);
  else player.tokens.set(tokenNumber, player.tokens[tokenNumber] + data.dice);

  console.log(player);
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
// TODO Create ghost route
// TODO Create board (table) and player (class) render
// TODO Add player timeout
// TODO Add speech synthesis
function tokenLastMove(data: any, tokenNumber: number) {
  const player = data.players[data.turn];
  let goal = player.goal - 1;

  if (goal === 0) goal += 40;

  const tokenHouse = data.dice - (goal - player.tokens[tokenNumber]) - 1;

  if (player.house[tokenHouse] === 0) {
    player.house.set(tokenHouse, 1);
    player.tokens.set(tokenNumber, player.goal * 100 + tokenHouse);

    console.log('moved to house');
  } else console.log('cant move');
}

function checkIfLastMove(data: any, tokenNumber: number): boolean {
  const player = data.players[data.turn];
  let goal = player.goal - 1;

  if (goal === 0) goal += 40;

  if (player.tokens[tokenNumber] < goal && player.tokens[tokenNumber] + data.dice > goal)
    return true;
  else
    return false;
}

function tokenMoveInHouse(data: any, tokenNumber: number) {
  const player = data.players[data.turn];
  const tokenHouseId = player.tokens[tokenNumber] - player.goal * 100;

  if (player.house[tokenHouseId + data.dice] === 0) {
    player.house.set(tokenHouseId, 0);
    player.house.set(tokenHouseId + data.dice, 1);
    player.tokens.set(tokenNumber, player.tokens[tokenNumber] + data.dice);

    console.log('moved in house');
  } else console.log('cant move in house');
}

export { moveToken };
