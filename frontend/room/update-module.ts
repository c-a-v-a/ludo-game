// * Update module for room.js
import { RenderPlayerBoxes } from './render-player-boxes-module.js';
import { TurnModule } from './turn-module.js';
import { RenderTokens } from './render-tokens.js';
import { DiceRoll } from './dice-roll-render-module.js';
import { PlayerTurnTime } from './player-turn-time-module.js';
// TODO Clean files, add jsdoc
// TODO Put module in classes with static
/**
 * Getting information about player's room
 */
class UpdateModule {
  public static getRoomInfo() {
    const options: Object = {
      method: 'POST',
    };

    return fetch('/roomInfo', options)
      .then((response) => response.json())
      .then((data) => {
        return data;
      });
  }

  public static lastTurn: any = null;

  /**
   * Function that updates gui
   */
  public static updatePage() {
    this.updatePage = this.updatePage.bind(this);

    let info: any;

    // * Update
    this.getRoomInfo()
      .then((data) => {
        info = JSON.stringify(data);
      })
      .then(() => {
        // Render players boxes
        // if (
        //   document.getElementById('players-row')!.children.length < JSON.parse(info).players.length
        // ) {
        console.log('redraw');
        RenderPlayerBoxes.renderPlayers(JSON.parse(info).players);
        // }

        // Check if game has started
        if (JSON.parse(info).hasGameStarted) {
          // if (lastTurn === null) {
          //   lastTurn = JSON.parse(info).turn;
          //   document.getElementById('badge')?.remove();
          //   timerBadgeRender(JSON.parse(info));
          // } else if (lastTurn !== JSON.parse(info).turn) {
          //   document.getElementById('badge')?.remove();
          //   timerBadgeRender(JSON.parse(info));
          // }

          PlayerTurnTime.timerBadgeRender(JSON.parse(info));

          // Hide the ready switch
          document.getElementById('ready-row')!.classList.add('d-none');
          document.getElementById('game-row')!.classList.remove('d-none');

          if (document.getElementsByClassName('player-token').length === 0) {
            RenderTokens.renderTokens(JSON.parse(info).players);
          }

          if (
            !document.getElementById('ghost') &&
            document.getElementsByClassName('player-token').length !== 0 &&
            document.getElementsByClassName('opponent-token').length !== 0
          ) {
            RenderTokens.updateTokensPosition(JSON.parse(info).players);
          }

          fetch('/skipTurn', { method: 'POST' })
            .then((response) => response.json())
            .then((data) => {
              if (data.skipped) document.getElementById('dice-row')?.classList.add('d-none');
            });

          TurnModule.checkIfMyTurn().then((response) => {
            if (response && JSON.parse(info).dice === 0)
              document.getElementById('dice-row')!.classList.remove('d-none');
            else document.getElementById('dice-row')!.classList.add('d-none');
          });

          if (JSON.parse(info).dice === 0)
            document.getElementById('rolled-number-row')!.innerText = '';
          else DiceRoll.diceRollRender(JSON.parse(info).dice);

          fetch('/checkIfGameWon', { method: 'POST' }).then((data) => {
            if (data.url !== 'http://https://cava-ludo.herokuapp.com/checkIfGameWon')
              (window.location as any) = data.url;
          });
        } else {
          fetch('/canGameStart', { method: 'POST' });
        }
      });
  }
}

export { UpdateModule };
