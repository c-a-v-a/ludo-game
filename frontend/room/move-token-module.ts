// * Module for moving player's token for room.ts

async function moveToken(tokenNumber: number) {
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ token: tokenNumber }),
  };

  fetch('/moveToken', options).then(() => console.log('token moved'));
}

export { moveToken };
