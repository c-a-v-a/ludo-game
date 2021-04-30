// * Rendering players for room.ts

// Creating interface for player
interface player {
  nick: string;
  color: string;
  ready: boolean;
  tokens: Array<Number>;
}
class RenderPlayerBoxes {
  /**
   * Function that renders player boxes
   * @param players {Array} - players array
   */
  static renderPlayers(players: Array<player>) {
    this.renderPlayers = this.renderPlayers.bind(this);

    const playersRow = document.getElementById('players-row');

    if (playersRow) playersRow.innerHTML = '';

    for (const player of players) {
      // playersRow?.append(`${player.nick} - ${player.color} - ${player.ready} | `);
      this.createPill(player, playersRow as HTMLElement);
    }
  }

  static createPill(player: player, playersRow: HTMLElement) {
    const pillDiv: HTMLDivElement = document.createElement('div');
    const playerBox: HTMLDivElement = document.createElement('div');

    pillDiv.classList.add('col', 'd-flex', 'justify-content-center');
    playerBox.classList.add('player-pill');

    if (player.ready) playerBox.classList.add(`player-${player.color}`);

    playerBox.innerText = player.nick;

    pillDiv.appendChild(playerBox);
    playersRow.appendChild(pillDiv);
  }
}

export { RenderPlayerBoxes };
