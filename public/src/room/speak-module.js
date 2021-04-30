class SpeakModule {
    static speakNumber(diceNumber) {
        const text = new SpeechSynthesisUtterance(diceNumber.toString());
        text.lang = window.localStorage.lang;
        speechSynthesis.speak(text);
        console.log('i have spoken');
    }
}
export { SpeakModule };
