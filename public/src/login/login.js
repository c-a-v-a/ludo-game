"use strict";
// * File for login.html
/**
 * Function that sends player nick to server
 */
function submitNick() {
    const nickInput = document.getElementById('nick-input');
    const nick = nickInput?.value;
    // Checking if nick is empty
    if (nick === '') {
        window.alert('Please enter your nick');
        return;
    }
    // Creating data object
    const data = {
        nick: nick,
    };
    // Creating options object for fetching nick
    const options = {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data),
    };
    // Fetching nick and redirecting
    fetch('/nick', options)
        .then((res) => {
        window.location = res.url;
    })
        .catch((err) => console.error(err));
}
/**
 * Adding onclick to submit button, when DOM is loaded
 */
window.addEventListener('DOMContentLoaded', () => {
    const submitButton = document.getElementById('submit-button');
    submitButton.onclick = submitNick;
});
