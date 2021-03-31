/**
 * Function that generates random integers from min to max
 * @param min { Number } - minimum value of random integer
 * @param max { Number } - maximum value of random integer
 */
function randomInteger(min: number, max: number): number {
  return Math.floor(Math.random() * (max + 1 - min) + min);
}

export { randomInteger };