// * Dice module for room.ts
/**
 * Function that rolls the dice
 */
function rollTheDice() {
    fetch('/diceRoll', { method: 'POST' })
        .then((response) => response.json())
        .then((data) => console.log(data));
}
export { rollTheDice };
