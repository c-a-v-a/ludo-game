import { speakNumber } from './speak-module.js';

function diceRollRender(diceNumber: number) {
  const row = document.getElementById('rolled-number-row');

  if (row) row.innerHTML = '';
  if (diceNumber === 0) return;

  let diceImg = document.createElement('img');

  diceImg.classList.add('dice-image');
  diceImg.src = `../images/${diceNumber}.png`;

  row?.appendChild(diceImg);

  speakNumber(diceNumber);
}

export { diceRollRender };
