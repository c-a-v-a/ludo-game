class PlayerTurnTime {
    static timerBadgeRender(data) {
        const playerRow = document.getElementById('players-row');
        const playerPill = playerRow?.children[data.turn];
        const badge = document.createElement('span');
        let i = 0;
        badge.classList.add('badge', 'rounded-pill', 'bg-danger');
        badge.id = 'badge';
        playerPill?.appendChild(badge);
        let interval = setInterval(() => {
            if (i >= 3000) {
                badge.remove();
                clearInterval(interval);
                return;
            }
            if (Math.floor(60 - (Date.now() - data.turnStartTime) / 1000) <= 1) {
                badge.remove();
                clearInterval(interval);
                return;
            }
            badge.innerText = Math.floor(60 - (Date.now() - data.turnStartTime) / 1000).toString();
            i += 300;
        }, 300);
    }
}
export { PlayerTurnTime };
