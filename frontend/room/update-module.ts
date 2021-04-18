// * Update module for room.js
import { renderPlayers } from './render-module.js';
import { checkIfMyTurn } from './turn-module.js';
// TODO Add can game start to update
// TODO Clean files, add jsdocs
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

      console.log(JSON.parse(info).hasGameStarted);

      // Check if game has started
      if (JSON.parse(info).hasGameStarted) {
        // Hide the ready switch
        document.getElementById('ready-row')!.classList.add('d-none');
        document.getElementById('game-row')!.classList.remove('d-none');
        
        checkIfMyTurn()
        .then((response) => {
          if (response)
            document.getElementById('dice-row')!.classList.remove('d-none');
          else 
            document.getElementById('dice-row')!.classList.add('d-none');
        });

        if (JSON.parse(info).dice === 0)
          document.getElementById('rolled-number-row')!.innerText = '';
        else
          document.getElementById('rolled-number-row')!.innerText = JSON.parse(info).dice;
      }
    });
}

export { updatePage };