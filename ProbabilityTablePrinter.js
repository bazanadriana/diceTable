const Table = require('cli-table3');
const chalk = require('chalk');

class ProbabilityTablePrinter {
  constructor(diceSet, matrix) {
    this.diceSet = diceSet;      
    this.matrix = matrix;        
  }

  print() {
    console.log(chalk.bold.cyan('\n📊 Probability Table: User dice win probability vs Computer dice\n'));
    console.log(chalk.dim('Each cell shows the probability that the user\'s die beats the computer\'s die.\n'));
    
    const headers = ['User dice ↓ \\ Comp dice →', ...this.diceSet.allDice().map(d => d.toString())];

    const table = new Table({
      head: headers.map(h => chalk.green.bold(h)),
      colAligns: ['left', ...Array(headers.length - 1).fill('center')],
      style: { head: ['green'], border: ['gray'] },
      wordWrap: true,
    });

    this.diceSet.allDice().forEach((userDie, i) => {
      const row = [chalk.bold(userDie.toString())];
      this.matrix[i].forEach(cell => {
        if (cell === '-') {
          row.push(chalk.gray('-'));
        } else {
          row.push(cell);
        }
      });
      table.push(row);
    });

    console.log(table.toString());
  }
}

module.exports = ProbabilityTablePrinter;