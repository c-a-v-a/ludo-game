// * Main file for room.html
import { checkIfPlayerReady } from './ready-module.js';
import { updatePage } from './update-module.js';
window.addEventListener('DOMContentLoaded', function () {
    // Add event to switch 
    if (document.getElementById('ready-switch'))
        document.getElementById('ready-switch').onchange = checkIfPlayerReady;
    updatePage();
    setInterval(updatePage, 3000);
});
