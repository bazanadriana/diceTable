const chalk = require('chalk');

const DiceSet = require('./DiceSet');
const ProbabilityCalculator = require('./ProbabilityCalculator');
const ProbabilityTablePrinter = require('./ProbabilityTablePrinter');
const FairRandomGenerator = require('./FairRandomGenerator');
const InputHandler = require('./InputHandler');

class DiceTable {
  constructor(diceArrays) {
    this.diceSet = new DiceSet(diceArrays);
    this.probCalc = new ProbabilityCalculator(this.diceSet);
    this.tablePrinter = new ProbabilityTablePrinter(this.diceSet, this.probCalc.getProbabilityMatrix());
    this.fairRandom = new FairRandomGenerator();
    this.inputHandler = new InputHandler();
  }

  async generateFairRandomInt(range, promptMsg) {
    this.fairRandom.generate(range);
    console.log(`\n🔐 Computer commits to a secret number in range [0-${range - 1}].`);
    console.log(`HMAC: ${chalk.blue(this.fairRandom.getHmac())}`);

    const userVal = await this.inputHandler.askInt(promptMsg, 0, range - 1);

    console.log(`\n💻 Computer's number: ${chalk.red(this.fairRandom.value)}`);
    console.log(`🔑 Secret key: ${chalk.gray(this.fairRandom.getKeyHex())}`);
    console.log(`✅ Recomputed HMAC: ${chalk.green(this.fairRandom.verify() ? 'valid' : 'invalid')}`);

    const finalVal = (userVal + this.fairRandom.value) % range;
    console.log(`🎯 Final result: (${userVal} + ${this.fairRandom.value}) % ${range} = ${chalk.green(finalVal)}\n`);

    return finalVal;
  }

  async chooseDice(player, disallowedIndex = null) {
    let promptMsg = `${player}, select your die index (0-${this.diceSet.size() - 1}) or 'X' to exit, '?' for help: `;

    while (true) {
      const idx = await this.generateFairRandomInt(this.diceSet.size(), promptMsg);

      if (idx === disallowedIndex) {
        console.log(chalk.yellow(`❌ You cannot select the dice already chosen by the other player (#${disallowedIndex}). Please select a different dice.`));
        continue;
      }

      console.log(`${player} selected die #${idx}: [${this.diceSet.getDice(idx).toString()}]`);
      return idx;
    }
  }

  async rollDie(player, dieIndex) {
    const dieSize = this.diceSet.getDice(dieIndex).getAllFaces().length;
    const promptMsg = `${player}, enter a number (0-${dieSize - 1}) to roll your die, or 'X' to exit, '?' for help: `;

    console.log(chalk.bold(`\n🎲 ${player}'s roll:`));
    const rollIndex = await this.generateFairRandomInt(dieSize, promptMsg);
    const faceValue = this.diceSet.getDice(dieIndex).getFace(rollIndex);
    console.log(`${player} rolled: ${chalk.green(faceValue)} (Face index: ${rollIndex})`);
    return faceValue;
  }

  async play() {
    console.log(chalk.bold('\n🎮 Welcome to the Fair Non-Transitive Dice Game!'));

    this.tablePrinter.print();

    console.log(chalk.bold('\n🎲 Deciding who picks first...'));
    const first = await this.generateFairRandomInt(2, 'Enter your number (0-1) or X to exit, ? for help: ');

    let userDieIndex, compDieIndex;

    if (first === 0) {
      console.log(chalk.green('🧑 You go first!'));
      userDieIndex = await this.chooseDice('You');
      compDieIndex = await this.chooseDice('Computer', userDieIndex);
    } else {
      console.log(chalk.red('💻 Computer goes first!'));
      compDieIndex = await this.chooseDice('Computer');
      userDieIndex = await this.chooseDice('You', compDieIndex);
    }

    const userRoll = await this.rollDie('You', userDieIndex);
    const compRoll = await this.rollDie('Computer', compDieIndex);

    if (userRoll > compRoll) {
      console.log(chalk.green('\n✅ You win!'));
    } else if (userRoll < compRoll) {
      console.log(chalk.red('\n❌ Computer wins!'));
    } else {
      console.log(chalk.yellow('\n⚖️ It\'s a draw!'));
    }
  }
}

module.exports = DiceTable;

if (require.main === module) {
  (async () => {
    try {
      const diceArgs = process.argv.slice(2).map(str =>
        str.split(',').map(n => parseInt(n.trim(), 10))
      );

      if (diceArgs.length < 3) {
        console.error('❌ Error: Please provide at least 3 dice as 6 comma-separated integers each.');
        process.exit(1);
      }

      for (const die of diceArgs) {
        if (die.length !== 6 || die.some(n => Number.isNaN(n))) {
          console.error('❌ Error: Each die must contain exactly 6 integers.');
          process.exit(1);
        }
      }

      const game = new DiceTable(diceArgs);
      await game.play();
    } catch (err) {
      console.error(`❌ Unexpected error: ${err.message}`);
    }
  })();
}