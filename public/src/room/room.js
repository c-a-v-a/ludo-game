// * Main file for room.html
import { checkIfPlayerReady } from './ready-module.js';
import { updatePage } from './update-module.js';
import { rollTheDice } from './dice-module.js';
import { moveToken } from './move-token-module.js';
window.addEventListener('DOMContentLoaded', function () {
    // Add event to switch 
    if (document.getElementById('ready-switch'))
        document.getElementById('ready-switch').onchange = checkIfPlayerReady;
    if (document.getElementById('dice-button'))
        document.getElementById('dice-button').onclick = rollTheDice;
    if (document.getElementById('token-button'))
        document.getElementById('token-button').addEventListener('click', () => {
            moveToken(0);
        });
    updatePage();
    setInterval(updatePage, 3000);
});
