// * Update module for room.js
import { renderPlayers } from './render-player-boxes-module.js';
import { checkIfMyTurn } from './turn-module.js';
import { updateTokensPosition, renderTokens } from './render-tokens.js';
import { diceRollRender } from './dice-roll-render-module.js';
import { timerBadgeRender } from './player-turn-time-module.js';
// TODO Add can game start to update
// TODO Clean files, add jsdoc
// TODO Put module in classes with static
// TODO Add timers
/**
 * Getting information about player's room
 */
function getRoomInfo() {
    const options = {
        method: 'POST',
    };
    return fetch('/roomInfo', options)
        .then((response) => response.json())
        .then((data) => {
        return data;
    });
}
let lastTurn = null;
/**
 * Function that updates gui
 */
function updatePage() {
    let info;
    // * Update
    getRoomInfo()
        .then((data) => {
        info = JSON.stringify(data);
    })
        .then(() => {
        // Render players boxes
        if (document.getElementById('players-row').children.length < JSON.parse(info).players.length) {
            console.log('redraw');
            renderPlayers(JSON.parse(info).players);
        }
        // Check if game has started
        if (JSON.parse(info).hasGameStarted) {
            if (lastTurn === null) {
                lastTurn = JSON.parse(info).turn;
                document.getElementById('badge')?.remove();
                timerBadgeRender(JSON.parse(info));
            }
            else if (lastTurn !== JSON.parse(info).turn) {
                document.getElementById('badge')?.remove();
                timerBadgeRender(JSON.parse(info));
            }
            // Hide the ready switch
            document.getElementById('ready-row').classList.add('d-none');
            document.getElementById('game-row').classList.remove('d-none');
            if (document.getElementsByClassName('player-token').length === 0) {
                renderTokens(JSON.parse(info).players);
            }
            if (!document.getElementById('ghost') &&
                document.getElementsByClassName('player-token').length !== 0 &&
                document.getElementsByClassName('opponent-token').length !== 0) {
                updateTokensPosition(JSON.parse(info).players);
            }
            fetch('/skipTurn', { method: 'POST' })
                .then((response) => response.json())
                .then((data) => {
                if (data.skipped)
                    document.getElementById('dice-row')?.classList.add('d-none');
            });
            checkIfMyTurn().then((response) => {
                if (response && JSON.parse(info).dice === 0)
                    document.getElementById('dice-row').classList.remove('d-none');
                else
                    document.getElementById('dice-row').classList.add('d-none');
            });
            if (JSON.parse(info).dice === 0)
                document.getElementById('rolled-number-row').innerText = '';
            else
                diceRollRender(JSON.parse(info).dice);
            fetch('/checkIfGameWon', { method: 'POST' }).then((data) => {
                window.location = data.url;
            });
        }
    });
}
export { updatePage };
