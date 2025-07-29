const crypto = require('crypto');

class FairRandomGenerator {
  constructor() {
    this.key = null;
    this.value = null;
    this.hmac = null;
  }

  generate(range) {
    if (!Number.isInteger(range) || range <= 0) {
      throw new Error('Range must be a positive integer.');
    }
    this.value = crypto.randomInt(range);
    this.key = crypto.randomBytes(32);
    this.hmac = crypto.createHmac('sha3-256', this.key).update(this.value.toString()).digest('hex');
    return this.value;
  }

  getHmac() {
    return this.hmac;
  }

  getKeyHex() {
    return this.key.toString('hex');
  }

  verify() {
    if (!this.key || this.value === null || !this.hmac) {
      throw new Error('Missing key, value, or HMAC for verification.');
    }
    const recalculated = crypto.createHmac('sha3-256', this.key).update(this.value.toString()).digest('hex');
    return recalculated === this.hmac;
  }
}

module.exports = FairRandomGenerator;
  