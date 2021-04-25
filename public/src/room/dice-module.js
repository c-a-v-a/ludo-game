// * Dice module for room.ts
// TODO: Add anti spam to dice button
import { updatePage } from './update-module';
/**
 * Function that rolls the dice
 */
function rollTheDice() {
    fetch('/diceRoll', { method: 'POST' })
        .then((response) => response.json())
        .then((data) => {
        updatePage();
        if (data.canMove === false)
            window.alert('You have no possible moves. Skipping your turn.');
    });
    document.getElementById('dice-row')?.classList.add('d-none');
}
export { rollTheDice };
