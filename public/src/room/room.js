// * Main file for room.html
import { ReadyModule } from './ready-module.js';
import { UpdateModule } from './update-module.js';
import { DiceModule } from './dice-module.js';
import { GameBoard } from './game-board-table-module.js';
window.addEventListener('DOMContentLoaded', function () {
    // Add event to switch
    if (document.getElementById('ready-switch'))
        document.getElementById('ready-switch').onchange = ReadyModule.checkIfPlayerReady;
    if (document.getElementById('dice-button'))
        document.getElementById('dice-button').onclick = DiceModule.rollTheDice;
    GameBoard.createGameBoardTable();
    UpdateModule.updatePage();
    setInterval(UpdateModule.updatePage, 3000);
});
// TODO Clean up/add comments
