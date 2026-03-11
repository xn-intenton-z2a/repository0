// Example: Basic string Hamming distance
import { hammingDistance } from "../src/lib/main.js";

// Basic usage examples
console.log("Basic Examples:");
console.log(`hammingDistance("karolin", "kathrin") = ${hammingDistance("karolin", "kathrin")}`);
console.log(`hammingDistance("", "") = ${hammingDistance("", "")}`);
console.log(`hammingDistance("hello", "hello") = ${hammingDistance("hello", "hello")}`);

// Unicode examples
console.log("\nUnicode Examples:");
console.log(`hammingDistance("café", "care") = ${hammingDistance("café", "care")}`);
console.log(`hammingDistance("😀😁", "😀😂") = ${hammingDistance("😀😁", "😀😂")}`);

// Error handling
console.log("\nError Handling:");
try {
  hammingDistance("abc", "abcd");
} catch (error) {
  console.log(`Error: ${error.message}`);
}
