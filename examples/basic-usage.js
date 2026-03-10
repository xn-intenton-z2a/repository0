// examples/basic-usage.js
// Demonstrates the core Hamming distance functions

import { hammingDistance, hammingDistanceBits } from '../src/lib/main.js';

console.log('=== String Hamming Distance Examples ===\n');

// Basic examples from mission acceptance criteria
console.log('Mission examples:');
console.log(`hammingDistance("karolin", "kathrin") = ${hammingDistance("karolin", "kathrin")}`);
console.log(`hammingDistance("", "") = ${hammingDistance("", "")}`);

try {
  hammingDistance("a", "bb");
} catch (e) {
  console.log(`hammingDistance("a", "bb") throws: ${e.message}`);
}

console.log('\nReal-world examples:');
console.log(`hammingDistance("hello", "world") = ${hammingDistance("hello", "world")}`);
console.log(`hammingDistance("testing", "resting") = ${hammingDistance("testing", "resting")}`);

console.log('\nUnicode examples:');
console.log(`hammingDistance("café", "cave") = ${hammingDistance("café", "cave")}`);
console.log(`hammingDistance("🎉🎊", "🎉🌟") = ${hammingDistance("🎉🎊", "🎉🌟")}`);
console.log(`hammingDistance("résumé", "resume") = ${hammingDistance("résumé", "resume")}`);

console.log('\n=== Bits Hamming Distance Examples ===\n');

console.log('Mission examples:');
console.log(`hammingDistanceBits(1, 4) = ${hammingDistanceBits(1, 4)} (binary: 001 vs 100)`);
console.log(`hammingDistanceBits(0, 0) = ${hammingDistanceBits(0, 0)}`);

console.log('\nBinary analysis:');
const examples = [
  [5, 3],   // 101 vs 011
  [15, 7],  // 1111 vs 0111  
  [255, 0], // 11111111 vs 00000000
  [1024, 1] // 10000000000 vs 00000000001
];

examples.forEach(([a, b]) => {
  const distance = hammingDistanceBits(a, b);
  const binA = a.toString(2);
  const binB = b.toString(2);
  console.log(`${a} (${binA}) vs ${b} (${binB}) = ${distance} bit${distance !== 1 ? 's' : ''}`);
});

console.log('\n=== Error Handling Examples ===\n');

console.log('String errors:');
try {
  hammingDistance("short", "verylongstring");
} catch (e) {
  console.log(`Different lengths: ${e.message}`);
}

try {
  hammingDistance(123, "string");
} catch (e) {
  console.log(`Wrong type: ${e.message}`);
}

console.log('\nBits errors:');
try {
  hammingDistanceBits(-1, 5);
} catch (e) {
  console.log(`Negative number: ${e.message}`);
}

try {
  hammingDistanceBits(1.5, 2);
} catch (e) {
  console.log(`Non-integer: ${e.message}`);
}