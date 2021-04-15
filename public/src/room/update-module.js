import { renderPlayers } from './render-module.js';
import { checkIfMyTurn } from './turn-module.js';
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
        console.log(JSON.parse(info).hasGameStarted);
        // Check if game has started
        if (JSON.parse(info).hasGameStarted) {
            // Hide the ready switch
            document.getElementById('ready-row').classList.add('d-none');
            document.getElementById('game-row').classList.remove('d-none');
            checkIfMyTurn()
                .then((response) => {
                if (response)
                    document.getElementById('dice-row').classList.remove('d-none');
                else
                    document.getElementById('dice-row').classList.add('d-none');
            });
        }
    });
}
export { updatePage };
