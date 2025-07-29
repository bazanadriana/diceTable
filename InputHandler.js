const readline = require('readline-sync');

class InputHandler {
  async askInt(prompt, min, max) {
    while (true) {
      const answer = readline.question(`${prompt} (or 'X' to exit, '?' for help): `).trim();

      if (answer.toLowerCase() === 'x') {
        console.log('Exiting the game. Goodbye!');
        process.exit(0);
      }

      if (answer === '?' || answer.toLowerCase() === 'help') {
        console.log(`\nHelp:
- Enter an integer between ${min} and ${max}.
- Enter 'X' to exit the game.
- Enter '?' or 'help' to see this message.\n`);
        continue;
      }

      const num = Number(answer);
      if (!Number.isInteger(num) || num < min || num > max) {
        console.log(`Invalid input! Please enter an integer between ${min} and ${max}, or 'X' to exit, '?' for help.`);
        continue;
      }

      return num;
    }
  }
}

module.exports = InputHandler;