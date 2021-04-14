"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.randomInteger = void 0;
/**
 * Function that generates random integers from min to max
 * @param min { Number } - minimum value of random integer
 * @param max { Number } - maximum value of random integer
 */
function randomInteger(min, max) {
    return Math.floor(Math.random() * (max + 1 - min) + min);
}
exports.randomInteger = randomInteger;
