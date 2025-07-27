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
  let userVal;
  while (true) {
    const input = readline.question(chalk.yellow(`${promptText} (0-${valueRange - 1}): `));
    userVal = parseInt(input);
    if (!isNaN(userVal) && userVal >= 0 && userVal < valueRange) break;
    console.log(chalk.red('❌ Invalid input. Please enter a valid number.'));
  }

  const compVal = getRandomInt(valueRange);
  const userKey = generateKey();
  const compKey = generateKey();
  const userHmac = hmac(userKey, userVal.toString());
  const compHmac = hmac(compKey, compVal.toString());

  console.log(`\nYour HMAC: ${chalk.blue(userHmac)}`);
  console.log(`Computer HMAC: ${chalk.blue(compHmac)}\n`);
  readline.question(chalk.gray('Press Enter to reveal both choices...'));

  console.log(`\n🧑 You chose: ${chalk.green(userVal)}`);
  console.log(`   Key: ${chalk.gray(userKey)}\n   HMAC: ${hmac(userKey, userVal.toString())}`);

  console.log(`💻 Computer chose: ${chalk.red(compVal)}`);
  console.log(`   Key: ${chalk.gray(compKey)}\n   HMAC: ${hmac(compKey, compVal.toString())}`);

  console.log(chalk.gray('\n🔍 You can verify the HMAC using any online tool or the hmac() function.\n'));

  return { userVal, compVal };
}

function getRoll(die, index) {
  return die[index % die.length];
}

function printProbabilityTable() {
  console.log(chalk.bold('\n🎲 Dice Win Probability Table'));
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

  console.log(`\nYour Die: [${chalk.green(userDie.join(', '))}]`);
  console.log(`Computer Die: [${chalk.red(compDie.join(', '))}]\n`);

  const { userVal: userRollIndex, compVal: compRollIndex } = commitStep('Select your roll index', 6);
  const { userVal: finalUserRollIndex, compVal: finalCompRollIndex } = commitStep('Computer rolls (choose number to blend)', 6);

  const userRoll = getRoll(userDie, userRollIndex + finalUserRollIndex);
  const compRoll = getRoll(compDie, compRollIndex + finalCompRollIndex);

  console.log(`\n🎲 You rolled: ${chalk.green(userRoll)} (from Die ${userDieIndex})`);
  console.log(`🎲 Computer rolled: ${chalk.red(compRoll)} (from Die ${compDieIndex})`);

  if (userRoll > compRoll) console.log(chalk.green('\n✅ You win!'));
  else if (userRoll < compRoll) console.log(chalk.red('\n❌ Computer wins!'));
  else console.log(chalk.yellow("\n⚖️ It's a draw!"));
}

playGame();