/**
 * The idea behind the heads-and-tails simulator is to have some kind
 * of environment with parameters and randomness to train an AI on
 * 
 * To calculate the output of spin, spin and state we'll be using the function
 * f(x) = 1/x, so we can guarantee that with no strength or no spin the state
 * won't change, but with minimum x and and inversely proportional y we can have
 * some output. If y is less than 1/x the combination won't be enough for a full rotation.
 * If it exceeds, we subtract the necessary 1/x value and re-run the function until there's
 * not enough energy for a full spin.
 */

function getRandomness() {
  const random = Math.random();
  if (random > 0.5) return 0.5-random;
  return random;
}

function getMinimumXforY(y) {
  return 1/y;
}

function getDiscrepancy(Z, z) {
  return Z - z;
}

function getHigherDiscrepancy(D, d) {
  return D > d ? D : d;
}

function invert(state) {
  return state === 1 ? 0 : 1;
}

/**
 * Toss function
 * @param {number} strength 
 * @param {number} spin 
 * @param {0|1} state 0 = heads, 1 = tails
 * @returns 0 | 1 state
 */
function flip(strength, spin, state, flips) { 
  const minimumSpin = getMinimumXforY(strength);
  const minimumStrength = getMinimumXforY(spin);
  const spinDiscrepancy = getDiscrepancy(spin, minimumSpin);
  const strengthDiscrepancy = getDiscrepancy(strength, minimumStrength);
  if (spinDiscrepancy < 0 && strengthDiscrepancy < 0) return { state, flips };
  return flip(strengthDiscrepancy, spinDiscrepancy, invert(state), flips+1);
}

/**
 * 
 * @param {*} variable 
 * @param {*} value 
 * @returns boolean
 */

function expect(variable, value) {
  const result = variable === value;
  console.log(`Expecting ${variable} to be ${value}. Result: ${result}`);
  return result;
}

function Prepare() {
  const strengthrandomness = getRandomness();
  const spinrandomness = getRandomness();

  this.tossed = false;

  this.result = null;
  this.strength = null;
  this.spin = null;

  this.coinState = (function() {
    const randomness = Math.random();
    return randomness < 0.5 ? 0 : 1;
  })();

  this.state = function () {
    return {
      strengthrandomness,
      spinrandomness,
      coinState: this.coinState,
      result: this.result,
      tossed: this.tossed,
      strength: this.strength,
      spin: this.spin
    }
  }

  this.toss = function (strength, spin) {
    if (this.tossed) return false;
    this.strength = strength + strengthrandomness;
    this.spin = spin + spinrandomness;
    this.result = flip(this.strength, this.spin, this.coinState, 0);
    this.tossed = true;
    return this.result;
  }
};

const firstToss = flip(2.2, 1.9, 0, 0);
const secondToss = flip(0.9, 1.2, 0, 0);

console.log(firstToss, secondToss);

expect(firstToss.state, 0);
expect(secondToss.state, 1);

const newToss = new Prepare();
newToss.toss(0.9, 1.2, 0);
console.log(`strength randomness: ${newToss.state().strengthrandomness}`);
console.log(`spin randomness: ${newToss.state().spinrandomness}`);
console.log(`result: ${JSON.stringify(newToss.state())}`);
console.log(`no randomness result: ${flip(0.9, 1.2, 0, 0).state}`);
console.log(`with randomness result: ${flip(newToss.state().strength, newToss.state().spin, newToss.coinState, 0).state}`);