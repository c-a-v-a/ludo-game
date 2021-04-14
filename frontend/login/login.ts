// * File for login.html
/**
 * Function that sends player nick to server
 */
function submitNick() {
  const nickInput = document.getElementById('nick-input') as HTMLInputElement;
  const nick = nickInput?.value;

  // Checking if nick is empty
  if (nick === '') {
    window.alert('Please enter your nick');
    return;
  }

  // Creating data object
  const data: Object = {
    nick: nick,
  };

  // Creating options object for fetching nick
  const options: Object = {
    method: 'POST',
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data),
  };

  // Fetching nick and redirecting
  fetch('/nick', options)
    .then((res) => {
      (window.location as any) = res.url;
    })
    .catch((err) => console.error(err));
}

/**
 * Adding onclick to submit button, when DOM is loaded
 */
window.addEventListener('DOMContentLoaded', () => {
  const submitButton = document.getElementById('submit-button') as HTMLButtonElement;

  submitButton.onclick = submitNick;
});