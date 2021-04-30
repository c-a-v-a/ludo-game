// * Rendering players for room.ts
class RenderPlayerBoxes {
    /**
     * Function that renders player boxes
     * @param players {Array} - players array
     */
    static renderPlayers(players) {
        this.renderPlayers = this.renderPlayers.bind(this);
        const playersRow = document.getElementById('players-row');
        if (playersRow)
            playersRow.innerHTML = '';
        for (const player of players) {
            // playersRow?.append(`${player.nick} - ${player.color} - ${player.ready} | `);
            this.createPill(player, playersRow);
        }
    }
    static createPill(player, playersRow) {
        const pillDiv = document.createElement('div');
        const playerBox = document.createElement('div');
        pillDiv.classList.add('col', 'd-flex', 'justify-content-center');
        playerBox.classList.add('player-pill');
        if (player.ready)
            playerBox.classList.add(`player-${player.color}`);
        playerBox.innerText = player.nick;
        pillDiv.appendChild(playerBox);
        playersRow.appendChild(pillDiv);
    }
}
export { RenderPlayerBoxes };
