// * Update module for room.js
import { renderPlayers } from './render-module.js';

/**
 * Getting information about player's room
 */
function getRoomInfo() {
  let roomInfo;

  const options: Object = {
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
  let info: any;

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
        document.getElementById('ready-row')!.classList.add('d-none');
        document.getElementById('game-row')!.classList.remove('d-none');
      }
    });
}

export { updatePage };