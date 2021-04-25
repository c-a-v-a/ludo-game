function renderTime(data: any, interval: any) {
  const playerRow = document.getElementById('players-row');
  const playerPill = playerRow?.children[data.turn];
  const badge = document.createElement('span');

  badge.classList.add('badge', 'badge-danger');

  playerPill?.appendChild(badge);

  interval = setInterval(() => {
    badge.innerText = Math.floor(60 - (Date.now() - data.turnStartTime)).toString();
    console.log('time update');
  }, 100);
}

function clearTimers() {
  let badges = document.getElementsByClassName('badge');

  for (let i = 0; i < badges.length; i++) {
    badges[i].remove();
  }
}

export { renderTime, clearTimers };
