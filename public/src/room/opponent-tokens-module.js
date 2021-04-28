import { boardPositions } from './position-to-array.js';
class OpponentToken {
    constructor(color, position, goal, tokenIndex) {
        this.color = color;
        this.position = position;
        this.goal = goal;
        this.tokenIndex = tokenIndex;
        this.gameBoard = document.getElementById('game-board-table');
        this.htmlElement = null;
    }
    placeOnGameBoard() {
        // prettier-ignore
        this.htmlElement = document.createElement('img');
        let realPosition;
        if (this.position === 0)
            realPosition = boardPositions[this.position][this.goal * -100 - this.tokenIndex];
        else if (this.position > 40)
            realPosition = boardPositions[41][this.position];
        else
            realPosition = boardPositions[this.position];
        this.htmlElement.style.width = '30px';
        this.htmlElement.style.height = '30px';
        // this.htmlElement.style.position = 'absolute';
        this.htmlElement.src = `../images/${this.color}.png`;
        this.htmlElement.id = `${this.color}-${this.tokenIndex}`;
        this.htmlElement.classList.add('opponent-token');
        this.gameBoard.children[realPosition.x].children[realPosition.y].appendChild(this.htmlElement);
    }
    updatePosition(newPosition) {
        this.removeFromPosition();
        this.position = newPosition;
        let realPosition;
        if (this.position === 0)
            realPosition = boardPositions[this.position][this.goal * -100 - this.tokenIndex];
        else if (this.position > 40)
            realPosition = boardPositions[41][this.goal * 100 + this.tokenIndex];
        else
            realPosition = boardPositions[this.position];
        this.gameBoard.children[realPosition.x].children[realPosition.y].appendChild(this.htmlElement);
    }
    removeFromPosition() {
        let realPosition;
        if (this.position === 0)
            realPosition = boardPositions[this.position][this.goal * -100 - this.tokenIndex];
        else if (this.position > 40)
            realPosition = boardPositions[41][this.goal * 100 + this.tokenIndex];
        else
            realPosition = boardPositions[this.position];
        this.gameBoard.children[realPosition.x].children[realPosition.y].removeChild(this.htmlElement);
    }
}
export { OpponentToken };
