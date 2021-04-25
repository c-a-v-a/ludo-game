// * Rendering players for room.ts

// Creating interface for player
interface player {
  nick: string;
  color: string;
  ready: boolean;
  tokens: Array<Number>;
}

/**
 * Function that renders player boxes
 * @param players {Array} - players array
 */
function renderPlayers(players: Array<player>) {
  const playersRow = document.getElementById('players-row');

  if (playersRow) playersRow.innerHTML = '';

  for (const player of players) {
    // playersRow?.append(`${player.nick} - ${player.color} - ${player.ready} | `);
    createPill(player, playersRow as HTMLElement);
  }
}

function createPill(player: player, playersRow: HTMLElement) {
  const pillDiv: HTMLDivElement = document.createElement('div');
  const playerBox: HTMLDivElement = document.createElement('div');

  pillDiv.classList.add('col', 'd-flex', 'justify-content-center');
  playerBox.classList.add('player-pill');

  if (player.ready) playerBox.classList.add(`player-${player.color}`);

  playerBox.innerText = player.nick;

  pillDiv.appendChild(playerBox);
  playersRow.appendChild(pillDiv);
}

export { renderPlayers };
