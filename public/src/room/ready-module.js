// * Module that checks if player is ready for game
import { UpdateModule } from './update-module.js';
class ReadyModule {
    /**
     * Function that check if player is ready for game
     * @returns {boolean} - true if player is ready
     */
    static checkIfPlayerReady() {
        const readySwitch = document.getElementById('ready-switch');
        let options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ ready: true }),
        };
        // Sending data to server
        if (readySwitch.checked) {
            fetch('/changePlayerState', options)
                .then()
                .catch((err) => console.error(err));
        }
        else {
            options.body = JSON.stringify({ ready: false });
            fetch('/changePlayerState', options)
                .then(UpdateModule.updatePage)
                .catch((err) => console.error(err));
        }
    }
}
export { ReadyModule };
