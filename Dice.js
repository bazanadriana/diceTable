class Dice {
    constructor(faces) {
      if (!Array.isArray(faces)) {
        throw new TypeError('Faces must be an array.');
      }
      if (faces.length < 1) {
        throw new RangeError('A die must have at least 1 face.');
      }
      if (!faces.every(Number.isInteger)) {
        throw new TypeError('All faces must be integers.');
      }
      this.faces = faces;
    }
  
    getFace(index) {
      if (!Number.isInteger(index) || index < 0 || index >= this.faces.length) {
        throw new RangeError(`Face index must be an integer between 0 and ${this.faces.length - 1}.`);
      }
      return this.faces[index];
    }
  
    getAllFaces() {
      return [...this.faces];
    }
  
    toString() {
      return this.faces.join(',');
    }
  }
  
  module.exports = Dice;   