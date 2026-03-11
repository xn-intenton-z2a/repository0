// Example: Basic bit Hamming distance
import { hammingDistanceBits } from "../src/lib/main.js";

// Basic usage examples
console.log("Basic Examples:");
console.log(`hammingDistanceBits(1, 4) = ${hammingDistanceBits(1, 4)} (binary: 001 vs 100)`);
console.log(`hammingDistanceBits(0, 0) = ${hammingDistanceBits(0, 0)}`);
console.log(`hammingDistanceBits(15, 0) = ${hammingDistanceBits(15, 0)} (binary: 1111 vs 0000)`);

// More examples
console.log("\nMore Examples:");
console.log(`hammingDistanceBits(7, 4) = ${hammingDistanceBits(7, 4)} (binary: 111 vs 100)`);
console.log(`hammingDistanceBits(255, 0) = ${hammingDistanceBits(255, 0)} (8-bit examples)`);

// Error handling
console.log("\nError Handling:");
try {
  hammingDistanceBits(-1, 4);
} catch (error) {
  console.log(`Error: ${error.message}`);
}
