#!/usr/bin/env node
// src/lib/main.js

import { fileURLToPath } from "url";

function displayHelp() {
  console.log(`Usage: node src/lib/main.js [options] [arguments]

This CLI command implements the 'CLI Utility' feature.
Options:
  --help, help            Display this help message.
  --op, -o <operation>    Specify arithmetic operation: add (default), sub, mul, div.

Examples:
  node src/lib/main.js --help
  node src/lib/main.js help
  node src/lib/main.js 3 4
  node src/lib/main.js 3 4 --op sub
  node src/lib/main.js 3 4 --op mul
  node src/lib/main.js 3 4 --op div
  node src/lib/main.js ${featureName}

For more details, refer to the documentation (docs/USAGE.md).`);
}

export function main(args) {
  if (args && (args.includes("--help") || args.includes("help"))) {
    displayHelp();
    return;
  }

  // Feature activation
  if (args && args[0] === "${featureName}") {
    console.log("Feature ${featureName} activated");
    return;
  }

  let operation = "add";
  // Look for --op or -o flag and extract its value
  const opIndex = args.findIndex(arg => arg === "--op" || arg === "-o");
  if (opIndex !== -1) {
    if (args.length <= opIndex + 1) {
      console.error("Error: Operation flag provided without an operation.");
      displayHelp();
      return;
    }
    operation = args[opIndex + 1];
    // Remove the flag and its value from args
    args.splice(opIndex, 2);
    
    const validOps = new Set(["add", "sub", "mul", "*", "div"]);
    if (!validOps.has(operation)) {
      console.error(`Error: Invalid operation '${operation}'. Supported operations are add, sub, mul, div.`);
      displayHelp();
      return;
    }
  }

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

  let result;
  switch (operation) {
    case "add":
      result = num1 + num2;
      break;
    case "sub":
      result = num1 - num2;
      break;
    case "mul":
    case "*":
      result = num1 * num2;
      break;
    case "div":
      if (num2 === 0) {
        console.error("Error: Division by zero is not allowed.");
        displayHelp();
        return;
      }
      result = num1 / num2;
      break;
    default:
      // This should not happen due to early validation.
      console.error(`Error: Unsupported operation '${operation}'.`);
      displayHelp();
      return;
  }
  console.log(`Result: ${result}`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  main(args);
}
