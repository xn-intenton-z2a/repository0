import { hammingDistance } from '../main.js';

// Example 1: ASCII strings (matches tests)
const a = 'karolin';
const b = 'kathrin';
console.log(`hammingDistance("${a}", "${b}") =>`, hammingDistance(a, b)); // expected 3

// Example 2: empty strings
console.log('hammingDistance("", "") =>', hammingDistance('', '')); // expected 0
