// * Rendering players for room.ts
;
/**
 * Function that renders player boxes
 * @param players {Array} - players array
 */
function renderPlayers(players) {
    const playersRow = document.getElementById('players-row');
    if (playersRow)
        playersRow.innerHTML = '';
    for (const player of players) {
        playersRow?.append(`${player.nick} - ${player.color} - ${player.ready} | `);
    }
}
export { renderPlayers };
