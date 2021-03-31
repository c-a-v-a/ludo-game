// * Main file for room.html
/**
 * Getting information about player's room
 */
function getRoomInfo() {
  const options: Object = {
    method: 'POST',
  };

  fetch('/roomInfo', options)
    .then((response) => response.json())
    .then((data) => console.log(data));
}

getRoomInfo();