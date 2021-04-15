// * Turn module for room.ts
/**
 * Function that checks if if's player's turn
 * @returns {boolean} - true if it's player's turn
 */
function checkIfMyTurn() {
    return fetch('/whoseTurn', { method: 'POST' })
        .then((response) => response.json())
        .then((data) => { return data.myTurn; });
}
export { checkIfMyTurn };
