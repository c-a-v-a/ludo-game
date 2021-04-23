// * Update module for room.js
import { renderPlayers } from './render-module.js';
import { checkIfMyTurn } from './turn-module.js';
import { updateTokensPosition, renderTokens } from './render-tokens.js';
// TODO Add can game start to update
// TODO Hide dice button when dice !== 0
// TODO Clean files, add jsdoc
// TODO Put module in classes with static
/**
 * Getting information about player's room
 */
function getRoomInfo() {
    let roomInfo;
    const options = {
        method: 'POST',
    };
    return fetch('/roomInfo', options)
        .then((response) => response.json())
        .then((data) => {
        return data;
    });
}
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
        renderPlayers(JSON.parse(info).players);
        // Check if game has started
        if (JSON.parse(info).hasGameStarted) {
            // Hide the ready switch
            document.getElementById('ready-row').classList.add('d-none');
            document.getElementById('game-row').classList.remove('d-none');
            if (document.getElementsByClassName('player-token').length === 0) {
                console.log(document.getElementsByClassName('player-token'));
                renderTokens(JSON.parse(info).players);
                console.log('renderTokens');
            }
            if (!document.getElementById('ghost') &&
                document.getElementsByClassName('player-token').length !== 0 &&
                document.getElementsByClassName('opponent-token').length !== 0) {
                updateTokensPosition(JSON.parse(info).players);
                console.log('updateTokensPosition');
            }
            checkIfMyTurn().then((response) => {
                if (response)
                    document.getElementById('dice-row').classList.remove('d-none');
                else
                    document.getElementById('dice-row').classList.add('d-none');
            });
            if (JSON.parse(info).dice === 0)
                document.getElementById('rolled-number-row').innerText = '';
            else
                document.getElementById('rolled-number-row').innerText = JSON.parse(info).dice;
        }
    });
}
export { updatePage };
