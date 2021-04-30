import { OpponentToken } from './opponent-tokens-module.js';
import { PlayerToken } from './player-token-module.js';
let tokensArray = [];
class RenderTokens {
    static renderTokens(players) {
        fetch('/whoAmI', { method: 'POST' })
            .then((response) => response.json())
            .then((data) => {
            for (let player of players) {
                if (player.nick === data.nick && player.color === data.color) {
                    for (let i = 0; i < player.tokens.length; i++) {
                        const token = new PlayerToken(player.color, player.tokens[i], player.goal, i);
                        token.placeOnGameBoard();
                        tokensArray.push(token);
                    }
                }
                else {
                    for (let i = 0; i < player.tokens.length; i++) {
                        const token = new OpponentToken(player.color, player.tokens[i], player.goal, i);
                        token.placeOnGameBoard();
                        tokensArray.push(token);
                    }
                }
            }
        });
    }
    static updateTokensPosition(players) {
        for (let player of players) {
            for (let token of tokensArray) {
                if (token.color === player.color) {
                    token.updatePosition(player.tokens[token.tokenIndex]);
                }
            }
        }
    }
}
export { RenderTokens };
