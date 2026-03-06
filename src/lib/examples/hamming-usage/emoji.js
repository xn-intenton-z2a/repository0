import { hammingDistance } from '../main.js';

// Demonstrate Unicode code point handling (surrogate-pair characters count as 1 position)
// Using characters from tests: 'a𝟘b' vs 'a𝟙b' differs at the middle code point only
const a = 'a𝟘b';
const b = 'a𝟙b';
console.log(`String A: ${a}`);
console.log(`String B: ${b}`);
console.log(`hammingDistance("${a}", "${b}") =>`, hammingDistance(a, b)); // expected 1

// Show lengths by code points
console.log('Array.from lengths:', Array.from(a).length, Array.from(b).length); // both should be 3
