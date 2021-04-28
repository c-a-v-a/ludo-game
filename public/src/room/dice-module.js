// * Dice module for room.ts
import { diceRollRender } from './dice-roll-render-module.js';
/**
 * Function that rolls the dice
 */
function rollTheDice() {
    document.getElementById('dice-row')?.classList.add('d-none');
    fetch('/diceRoll', { method: 'POST' })
        .then((response) => response.json())
        .then((data) => {
        diceRollRender(data.rolled);
        setTimeout(() => {
            if (data.canMove === false)
                window.alert('You have no possible moves. Skipping your turn.');
        }, 1500);
    });
}
export { rollTheDice };
