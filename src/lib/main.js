#!/usr/bin/env node
/* eslint-env node, es2022 */
// src/lib/main.js

import { fileURLToPath } from "url";
import { createRequire } from "module";

export async function main(args) {
  // Normalize input: ensure args is an array
  if (!Array.isArray(args)) {
    args = [];
  }

  if (args.includes("--help")) {
    console.log("Usage: node src/lib/main.js [--diagnostics] [--help] [--version] [--greet] [--sum] [--multiply] [--subtract] [--divide] [--modulo] [numbers...]");
    console.log("  --diagnostics: Check system diagnostics");
    console.log("  --help       : Display this help message with flag descriptions");
    console.log("  --version    : Show current version of the application");
    console.log("  --greet      : Display a greeting message");
    console.log("  --sum        : Compute the sum of provided numbers");
    console.log("  --multiply   : Compute the product of provided numbers");
    console.log("  --subtract   : Subtract each subsequent number from the first provided number");
    console.log("  --divide     : Divide the first number by each of the subsequent numbers sequentially");
    console.log("  --modulo     : Compute the modulo of provided numbers (first % second % ...)");
    return;
  }

  if (args.includes("--version")) {
    try {
      const require = createRequire(import.meta.url);
      const pkg = require("../../package.json");
      const { version } = pkg;
      console.log(`Version: ${version}`);
    } catch (err) {
      console.error("Could not retrieve version:", err);
    }
    return;
  }

  if (args.includes("--diagnostics")) {
    console.log("Diagnostics: All systems operational.");
    return;
  }

  if (args.includes("--greet")) {
    console.log("Hello, welcome to repository0!");
    return;
  }

  if (args.includes("--sum")) {
    const sumIndex = args.indexOf("--sum");
    const numArgs = args.slice(sumIndex + 1)
      .filter(arg => !arg.startsWith("--"))
      .map(Number)
      .filter(num => !isNaN(num));
    const total = numArgs.reduce((acc, curr) => acc + curr, 0);
    console.log(`Sum: ${total}`);
    return;
  }

  if (args.includes("--multiply")) {
    const multiplyIndex = args.indexOf("--multiply");
    const numArgs = args.slice(multiplyIndex + 1)
      .filter(arg => !arg.startsWith("--"))
      .map(Number)
      .filter(num => !isNaN(num));
    const product = numArgs.reduce((acc, curr) => acc * curr, 1);
    console.log(`Multiply: ${product}`);
    return;
  }

  if (args.includes("--subtract")) {
    const subtractIndex = args.indexOf("--subtract");
    const numArgs = args.slice(subtractIndex + 1)
      .filter(arg => !arg.startsWith("--"))
      .map(Number)
      .filter(num => !isNaN(num));
    if (numArgs.length === 0) {
      console.log("Subtract: No numbers provided");
      return;
    }
    if (numArgs.length === 1) {
      console.log(`Subtract: ${numArgs[0]}`);
      return;
    }
    const result = numArgs.slice(1).reduce((acc, curr) => acc - curr, numArgs[0]);
    console.log(`Subtract: ${result}`);
    return;
  }

  if (args.includes("--divide")) {
    const divideIndex = args.indexOf("--divide");
    const numArgs = args.slice(divideIndex + 1)
      .filter(arg => !arg.startsWith("--"))
      .map(Number)
      .filter(num => !isNaN(num));
    if (numArgs.length === 0) {
      console.log("Divide: No numbers provided");
      return;
    }
    if (numArgs.length === 1) {
      console.log(`Divide: ${numArgs[0]}`);
      return;
    }
    if (numArgs.slice(1).some(n => n === 0)) {
      console.log("Divide: Division by zero error");
      return;
    }
    const result = numArgs.slice(1).reduce((acc, curr) => acc / curr, numArgs[0]);
    console.log(`Divide: ${result}`);
    return;
  }

  if (args.includes("--modulo")) {
    const moduloIndex = args.indexOf("--modulo");
    const numArgs = args.slice(moduloIndex + 1)
      .filter(arg => !arg.startsWith("--"))
      .map(Number)
      .filter(num => !isNaN(num));
    if (numArgs.length < 2) {
      console.log("Modulo: Provide at least two numbers");
      return;
    }
    if (numArgs.slice(1).some(n => n === 0)) {
      console.log("Modulo: Division by zero error");
      return;
    }
    const result = numArgs.slice(1).reduce((acc, curr) => acc % curr, numArgs[0]);
    console.log(`Modulo: ${result}`);
    return;
  }

  // Default behavior when no valid arguments are provided
  if (args.length === 0) {
    console.log("Usage: node src/lib/main.js [--diagnostics] [--help] [--version] [--greet] [--sum] [--multiply] [--subtract] [--divide] [--modulo] [numbers...]");
    console.log("Demo: No arguments provided. Exiting.");
    if (process.argv[1] === fileURLToPath(import.meta.url)) {
      process.exit(0);
    }
    return;
  }

  // Fallback for unknown flags
  console.log(`Run with: ${JSON.stringify(args)}`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  main(args).then(() => process.exit(0));
}
