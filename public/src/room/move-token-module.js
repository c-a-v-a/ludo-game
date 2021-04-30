// * Module for moving player's token for room.ts
class MoveToken {
    static async moveToken(tokenNumber) {
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ token: tokenNumber }),
        };
        fetch('/moveToken', options).then(() => console.log('token moved'));
    }
}
export { MoveToken };
