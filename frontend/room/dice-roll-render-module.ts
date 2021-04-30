import { SpeakModule } from './speak-module.js';

class DiceRoll {
  static diceRollRender(diceNumber: number) {
    const row = document.getElementById('rolled-number-row');

    if (row) row.innerHTML = '';
    if (diceNumber === 0) return;

    let diceImg = document.createElement('img');

    diceImg.classList.add('dice-image');
    diceImg.src = `../images/${diceNumber}.png`;

    row?.appendChild(diceImg);

    SpeakModule.speakNumber(diceNumber);
  }
}

export { DiceRoll };
