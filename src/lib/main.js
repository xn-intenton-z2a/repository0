#!/usr/bin/env node
// src/lib/main.js

import { fileURLToPath } from "url";

function displayHelp() {
  console.log(`Usage: node src/lib/main.js [options] [arguments]

This CLI command implements the 'CLI Utility' feature.
Options:
  --help, help      Display this help message.
  
Examples:
  node src/lib/main.js --help
  node src/lib/main.js help
  node src/lib/main.js 3 4

For more details, refer to the documentation (docs/USAGE.md).`);
}

export function main(args) {
  if (args && (args.includes("--help") || args.includes("help"))) {
    displayHelp();
    return;
  }

  // Validate numeric input: require exactly two numeric arguments
  if (!args || args.length < 2) {
    console.error("Error: Two numeric arguments are required.");
    displayHelp();
    return;
  }

  const num1 = parseFloat(args[0]);
  const num2 = parseFloat(args[1]);

  if (isNaN(num1) || isNaN(num2)) {
    console.error("Error: Both arguments must be valid numbers.");
    displayHelp();
    return;
  }

  // Execute the command: sum the two numbers
  const result = num1 + num2;
  console.log(`Result: ${result}`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  main(args);
}
