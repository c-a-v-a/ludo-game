import { boardPositions } from './position-to-array.js';
import { MoveToken } from './move-token-module.js';

class PlayerToken {
  color: string;
  position: number;
  goal: number;
  tokenIndex: number;
  gameBoard: HTMLElement;
  htmlElement: HTMLImageElement | null;

  constructor(color: string, position: number, goal: number, tokenIndex: number) {
    this.color = color;
    this.position = position;
    this.goal = goal;
    this.tokenIndex = tokenIndex;
    this.gameBoard = document.getElementById('game-board-table') as HTMLElement;
    this.htmlElement = null;
    this.displayGhost = this.displayGhost.bind(this);
  }

  placeOnGameBoard() {
    // prettier-ignore
    this.htmlElement = document.createElement('img') as HTMLImageElement;
    let realPosition;

    if (this.position === 0)
      realPosition = (boardPositions[this.position] as any)[this.goal * -100 - this.tokenIndex];
    else if (this.position > 40) realPosition = (boardPositions[41] as any)[this.position];
    else realPosition = boardPositions[this.position];

    this.htmlElement.style.width = '30px';
    this.htmlElement.style.height = '30px';
    // this.htmlElement.style.position = 'absolute';

    this.htmlElement.src = `../images/${this.color}.png`;
    this.htmlElement.id = `${this.color}-${this.tokenIndex}`;
    this.htmlElement.classList.add('player-token');
    this.htmlElement.onclick = () => {
      if (document.getElementById('ghost')) document.getElementById('ghost')?.remove();
      fetch('/ghostToken', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: this.tokenIndex }),
      })
        .then((response) => response.json())
        .then(async (data) => {
          if (data.canMove) {
            await MoveToken.moveToken(this.tokenIndex);
            this.updatePosition(data.position);
          }
        });
    };
    this.htmlElement.onmouseenter = this.displayGhost;
    this.htmlElement.onmouseleave = () => {
      if (document.getElementById('ghost')) document.getElementById('ghost')?.remove();
    };

    this.gameBoard.children[realPosition.x].children[realPosition.y].appendChild(this.htmlElement);
  }

  updatePosition(newPosition: number) {
    this.removeFromPosition();

    this.position = newPosition;

    let realPosition;

    if (this.position === 0)
      realPosition = (boardPositions[this.position] as any)[this.goal * -100 - this.tokenIndex];
    else if (this.position > 40) realPosition = (boardPositions[41] as any)[this.position];
    else realPosition = boardPositions[this.position];

    this.gameBoard.children[realPosition.x].children[realPosition.y].appendChild(
      this.htmlElement as HTMLImageElement
    );
  }

  removeFromPosition() {
    let realPosition;

    if (this.position === 0)
      realPosition = (boardPositions[this.position] as any)[this.goal * -100 - this.tokenIndex];
    else if (this.position > 40) realPosition = (boardPositions[41] as any)[this.position];
    else realPosition = boardPositions[this.position];

    this.gameBoard.children[realPosition.x].children[realPosition.y].removeChild(
      this.htmlElement as HTMLImageElement
    );
  }

  displayGhost() {
    if (document.getElementById('ghost')) document.getElementById('ghost')?.remove();

    console.log(this.htmlElement, this.tokenIndex, 'dg');

    fetch('/ghostToken', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: this.tokenIndex }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        if (data.canMove) {
          // this.resetOnClick()
          this.createGhost(data.position);
        }
      });
  }

  createGhost(position: number) {
    if (document.getElementById('ghost')) document.getElementById('ghost')?.remove();

    let ghost = document.createElement('img');
    let realPosition;

    // if (position === 0)
    //   realPosition = (boardPositions[position] as any)[this.goal * -100 - this.tokenIndex];
    if (position > 40) realPosition = (boardPositions[41] as any)[position];
    else realPosition = boardPositions[position];

    ghost.style.width = '20px';
    ghost.style.height = '20px';
    // ghost.style.zIndex = '5';

    ghost.src = '../images/ghost.png';
    ghost.id = 'ghost';

    this.gameBoard.children[realPosition.x].children[realPosition.y].appendChild(ghost);
  }
}

export { PlayerToken };
