// * Main file for room.html
import { checkIfPlayerReady } from './ready-module.js';
import { updatePage } from './update-module.js';
import { rollTheDice } from './dice-module.js';
window.addEventListener('DOMContentLoaded', function () {
    // Add event to switch 
    if (document.getElementById('ready-switch'))
        document.getElementById('ready-switch').onchange = checkIfPlayerReady;
    if (document.getElementById('dice-button'))
        document.getElementById('dice-button').onclick = rollTheDice;
    updatePage();
    setInterval(updatePage, 3000);
});
