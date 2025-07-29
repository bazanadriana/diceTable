class ProbabilityCalculator {
  constructor(diceSet) {
    if (!diceSet || typeof diceSet.size !== 'function' || typeof diceSet.getDice !== 'function') {
      throw new Error('Invalid diceSet: must provide size() and getDice() methods.');
    }
    this.diceSet = diceSet;
  }

  probabilityDieAWins(dieA, dieB) {
    let wins = 0;
    const facesA = dieA.getAllFaces();
    const facesB = dieB.getAllFaces();

    for (const a of facesA) {
      for (const b of facesB) {
        if (a > b) wins++;
      }
    }
    return wins / (facesA.length * facesB.length);
  }

  getProbabilityMatrix() {
    const n = this.diceSet.size();
    const matrix = Array.from({ length: n }, () => Array(n).fill(null));

    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        if (i === j) {
          matrix[i][j] = '-';
        } else {
          const prob = this.probabilityDieAWins(this.diceSet.getDice(i), this.diceSet.getDice(j));
          matrix[i][j] = prob.toFixed(2);
        }
      }
    }
    return matrix;
  }
}

module.exports = ProbabilityCalculator;