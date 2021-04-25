function diceRollRender(diceNumber: number) {
  const row = document.getElementById('rolled-number-row');
  let diceImg = document.createElement('img');

  diceImg.classList.add('dice-image');
  diceImg.src = `../images/${diceNumber}.png`;

  if (row) row.innerHTML = '';

  row?.appendChild(diceImg);
}

export { diceRollRender };
