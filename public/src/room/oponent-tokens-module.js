import { boardPositions } from './position-to-array';
class OpponentTokens {
    constructor(color, position, goal, tokenIndex) {
        this.color = color;
        this.position = position;
        this.goal = goal;
        this.tokenIndex = tokenIndex;
        this.gameBoard = document.getElementById('game-board-table');
    }
    placeOnGameBoard() {
        // prettier-ignore
        let token = document.createElement('image');
        let realPosition;
        if (this.position === 0)
            realPosition = boardPositions[this.position][this.goal * -100 - this.tokenIndex];
        else if (this.position > 40)
            realPosition = boardPositions[41][this.goal * 100 + this.tokenIndex];
        else
            realPosition = boardPositions[this.position];
        token.src = `./images/${this.color}.png`;
        token.id = `${this.color}-${this.tokenIndex}`;
        this.gameBoard.children[realPosition.x].children[realPosition.y].appendChild(token);
    }
}
