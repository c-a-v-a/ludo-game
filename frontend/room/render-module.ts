// * Rendering players for room.ts

// Creating interface for player
interface player {
  nick: string,
  color: string,
  ready: boolean,
  tokens: Array<Number>
};

/**
 * Function that renders player boxes
 * @param players {Array} - players array
 */
function renderPlayers(players: Array<player>) {
  const playersRow = document.getElementById('players-row');

  if (playersRow)
    playersRow.innerHTML = '';

  for (const player of players) {
    playersRow?.append(`${player.nick} - ${player.color} - ${player.ready} | `);
  }
}

export { renderPlayers };