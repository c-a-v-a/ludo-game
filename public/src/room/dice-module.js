// * Dice module for room.ts
import { DiceRoll } from './dice-roll-render-module.js';
class DiceModule {
    /**
     * Function that rolls the dice
     */
    static rollTheDice() {
        document.getElementById('dice-row')?.classList.add('d-none');
        fetch('/diceRoll', { method: 'POST' })
            .then((response) => response.json())
            .then((data) => {
            DiceRoll.diceRollRender(data.rolled);
            setTimeout(() => {
                if (data.canMove === false)
                    window.alert('You have no possible moves. Skipping your turn.');
            }, 1500);
        });
    }
}
export { DiceModule };
