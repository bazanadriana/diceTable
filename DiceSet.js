const Dice = require('./Dice');

class DiceSet {
  constructor(diceArrays) {
    if (!Array.isArray(diceArrays)) {
      throw new TypeError('Input must be an array of dice face arrays.');
    }
    if (diceArrays.length < 3) {
      throw new RangeError('At least 3 dice are required.');
    }

    this.dice = diceArrays.map((faces, idx) => {
      try {
        return new Dice(faces);
      } catch (err) {
        throw new Error(`Invalid dice at index ${idx}: ${err.message}`);
      }
    });
  }

  size() {
    return this.dice.length;
  }

  getDice(index) {
    if (!Number.isInteger(index) || index < 0 || index >= this.dice.length) {
      throw new RangeError('Dice index out of range.');
    }
    return this.dice[index];
  }

  allDice() {
    return [...this.dice];
  }
}

module.exports = DiceSet;
