const crypto = require('crypto');
const readline = require('readline-sync');
const chalk = require('chalk');
const Table = require('cli-table3');

const diceSet = [
  [2, 2, 4, 4, 9, 9],
  [1, 1, 6, 6, 8, 8],
  [3, 3, 5, 5, 7, 7],
];

function hmac(key, message) {
  return crypto.createHmac('sha256', key).update(message).digest('hex');
}

function generateKey() {
  return crypto.randomBytes(32).toString('hex');
}

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

function commitStep(promptText, valueRange) {
  const userVal = parseInt(readline.question(chalk.yellow(`${promptText} (0-${valueRange - 1}): `)));
  const compVal = getRandomInt(valueRange);
  const userKey = generateKey();
  const compKey = generateKey();
  const userHmac = hmac(userKey, userVal.toString());
  const compHmac = hmac(compKey, compVal.toString());

  console.log(`\nYour HMAC: ${chalk.blue(userHmac)}`);
  console.log(`Computer HMAC: ${chalk.blue(compHmac)}\n`);
  readline.question(chalk.gray('Press enter to reveal both choices...'));

  console.log(`\nYou chose: ${chalk.green(userVal)}, Key: ${chalk.gray(userKey)}, HMAC: ${hmac(userKey, userVal.toString())}`);
  console.log(`Computer chose: ${chalk.red(compVal)}, Key: ${chalk.gray(compKey)}, HMAC: ${hmac(compKey, compVal.toString())}`);

  return { userVal, compVal };
}

function getRoll(die, index) {
  return die[index % die.length];
}

function printProbabilityTable() {
  console.log(chalk.bold('\nDice Win Probability Table'));
  const table = new Table({
    head: ['User \\ Comp', '2,2,4,4,9,9', '1,1,6,6,8,8', '3,3,5,5,7,7'],
    style: { head: ['green'], border: ['gray'] },
    colAligns: ['left', 'center', 'center', 'center'],
  });
  diceSet.forEach((userDie, i) => {
    const row = [diceSet[i].join(',')];
    diceSet.forEach((compDie, j) => {
      if (i === j) {
        row.push('-');
      } else {
        let wins = 0;
        for (let u of userDie) for (let c of compDie) if (u > c) wins++;
        row.push((wins / 36).toFixed(2));
      }
    });
    table.push(row);
  });
  console.log(table.toString());
}

function playGame() {
  printProbabilityTable();

  const { userVal: userDieIndex, compVal: compDieIndex } = commitStep('Choose your die', 3);
  const userDie = diceSet[userDieIndex];
  const compDie = diceSet[compDieIndex];

  const { userVal: userRollIndex, compVal: compRollIndex } = commitStep('Select your roll index', 6);
  const { userVal: finalUserRollIndex, compVal: finalCompRollIndex } = commitStep('Computer rolls (choose number to blend)', 6);

  const userRoll = getRoll(userDie, userRollIndex + finalUserRollIndex);
  const compRoll = getRoll(compDie, compRollIndex + finalCompRollIndex);

  console.log(`\nYou rolled: ${chalk.green(userRoll)} (from Die ${userDieIndex})`);
  console.log(`Computer rolled: ${chalk.red(compRoll)} (from Die ${compDieIndex})`);

  if (userRoll > compRoll) console.log(chalk.green('\nYou win!'));
  else if (userRoll < compRoll) console.log(chalk.red('\nComputer wins!'));
  else console.log(chalk.yellow("\nIt's a draw!"));
}

playGame();