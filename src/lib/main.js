#!/usr/bin/env node

/* eslint-env node, es2022 */
// src/lib/main.js
// Reviewed Mission Statement: This CLI demo file demonstrates core arithmetic and utility commands in alignment with our mission.
// Mission Statement Reviewed: The functionality has been streamlined to focus on core arithmetic operations, error handling, and CLI interactivity.
// NOTE: Updated for improved test coverage and enhanced error handling in version retrieval, and added exponentiation, factorial, and square root features inline with the mission statement.

import { fileURLToPath } from "url";
import { createRequire } from "module";
import { z } from "zod";

const USAGE_MESSAGE =
  "Usage: node src/lib/main.js [--diagnostics] [--help] [--version] [--greet] [--sum] [--multiply] [--subtract] [--divide] [--modulo] [--average] [--power] [--factorial] [--sqrt] [numbers...]";

function printUsage(nonArrayInput = false) {
  let usage = USAGE_MESSAGE;
  if (nonArrayInput) {
    usage += "()";
  }
  console.log(usage);
  console.log("Demo: No arguments provided. Exiting.");
}

function printHelp() {
  console.log(USAGE_MESSAGE);
  console.log("  --diagnostics: Check system diagnostics");
  console.log("  --help       : Display this help message with flag descriptions");
  console.log("  --version    : Show current version of the application");
  console.log("  --greet      : Display a greeting message");
  console.log("  --sum        : Compute the sum of provided numbers (demo arithmetic)");
  console.log("  --multiply   : Compute the product of provided numbers (demo arithmetic)");
  console.log("  --subtract   : Subtract each subsequent number from the first provided number (demo arithmetic)");
  console.log("  --divide     : Divide the first number by each of the subsequent numbers sequentially (demo arithmetic)");
  console.log("  --modulo     : Compute the modulo of provided numbers (first % second % ... ) (demo arithmetic)");
  console.log("  --average    : Compute the arithmetic average of provided numbers (demo arithmetic)");
  console.log("  --power      : Compute exponentiation; first number raised to the power of the second, and chain if more numbers provided (demo arithmetic)");
  console.log("  --factorial  : Compute the factorial of a provided non-negative integer (demo arithmetic)");
  console.log("  --sqrt       : Compute the square root of the provided number (demo arithmetic)");
}

function getNumbers(args, flag) {
  const index = args.indexOf(flag);
  return args
    .slice(index + 1)
    .filter((arg) => !arg.startsWith("--"))
    .map((arg) => Number(arg))
    .filter((num) => !isNaN(num));
}

function handleHelp() {
  printHelp();
}

function handleVersion() {
  try {
    // Added check to simulate error for testing version retrieval
    if (process.env.FORCE_VERSION_ERROR === "true") {
      throw new Error("Forced error for testing");
    }
    const require = createRequire(import.meta.url);
    const pkg = require("../../package.json");
    const version = pkg.version;
    console.log(`Version: ${version}`);
  } catch (error) {
    console.error("Could not retrieve version: unknown error");
  }
}

function handleDiagnostics() {
  console.log("Diagnostics: All systems operational.");
}

function handleGreet() {
  console.log("Hello, welcome to repository0!");
}

function handleSum(args) {
  const nums = getNumbers(args, "--sum");
  const total = nums.reduce((acc, curr) => acc + curr, 0);
  console.log(`Sum: ${total}`);
}

function handleMultiply(args) {
  const nums = getNumbers(args, "--multiply");
  const product = nums.reduce((acc, curr) => acc * curr, 1);
  console.log(`Multiply: ${product}`);
}

function handleSubtract(args) {
  const nums = getNumbers(args, "--subtract");
  if (nums.length === 0) {
    console.log("Subtract: No numbers provided");
  } else if (nums.length === 1) {
    console.log(`Subtract: ${nums[0]}`);
  } else {
    const result = nums.slice(1).reduce((acc, curr) => acc - curr, nums[0]);
    console.log(`Subtract: ${result}`);
  }
}

function handleDivide(args) {
  const nums = getNumbers(args, "--divide");
  if (nums.length === 0) {
    console.log("Divide: No numbers provided");
  } else if (nums.length === 1) {
    console.log(`Divide: ${nums[0]}`);
  } else if (nums.slice(1).some((n) => n === 0)) {
    console.log("Divide: Division by zero error");
  } else {
    const result = nums.slice(1).reduce((acc, curr) => acc / curr, nums[0]);
    console.log(`Divide: ${result}`);
  }
}

function handleModulo(args) {
  const nums = getNumbers(args, "--modulo");
  if (nums.length < 2) {
    console.log("Modulo: Provide at least two numbers");
  } else if (nums.slice(1).some((n) => n === 0)) {
    console.log("Modulo: Division by zero error");
  } else {
    const result = nums.slice(1).reduce((acc, curr) => acc % curr, nums[0]);
    console.log(`Modulo: ${result}`);
  }
}

function handleAverage(args) {
  const nums = getNumbers(args, "--average")
    .map((num) => {
      try {
        return z.number().parse(num);
      } catch {
        return NaN;
      }
    })
    .filter((n) => !isNaN(n));
  if (nums.length === 0) {
    console.log("Average: No numbers provided");
  } else {
    const total = nums.reduce((acc, curr) => acc + curr, 0);
    const avg = total / nums.length;
    console.log(`Average: ${avg}`);
  }
}

function handlePower(args) {
  const nums = getNumbers(args, "--power");
  if (nums.length < 2) {
    console.log("Power: Provide at least two numbers (base and exponent)");
    return;
  }
  // Compute chained exponentiation: (((base^exp1)^exp2) ...)
  let result = nums[0];
  for (let i = 1; i < nums.length; i++) {
    result = Math.pow(result, nums[i]);
  }
  console.log(`Power: ${result}`);
}

function handleFactorial(args) {
  const nums = getNumbers(args, "--factorial");
  if (nums.length === 0) {
    console.log("Factorial: Provide a number");
    return;
  }
  const n = nums[0];
  if (!Number.isInteger(n) || n < 0) {
    console.log("Factorial: Input must be a non-negative integer");
    return;
  }
  let result = 1;
  for (let i = 2; i <= n; i++) {
    result *= i;
  }
  console.log(`Factorial: ${result}`);
}

function handleSqrt(args) {
  const nums = getNumbers(args, "--sqrt");
  if (nums.length === 0) {
    console.log("Square Root: Provide a number");
    return;
  }
  const n = nums[0];
  if (n < 0) {
    console.log("Square Root: Negative input error");
    return;
  }
  const result = Math.sqrt(n);
  console.log(`Square Root: ${result}`);
}

export async function main(args = []) {
  if (!Array.isArray(args)) {
    printUsage(true);
    return;
  }
  if (args.length === 0) {
    printUsage(false);
    return;
  }
  const flagHandlers = {
    "--help": handleHelp,
    "--version": handleVersion,
    "--diagnostics": handleDiagnostics,
    "--greet": handleGreet,
    "--sum": () => handleSum(args),
    "--multiply": () => handleMultiply(args),
    "--subtract": () => handleSubtract(args),
    "--divide": () => handleDivide(args),
    "--modulo": () => handleModulo(args),
    "--average": () => handleAverage(args),
    "--power": () => handlePower(args),
    "--factorial": () => handleFactorial(args),
    "--sqrt": () => handleSqrt(args)
  };

  for (const arg of args) {
    if (flagHandlers[arg]) {
      flagHandlers[arg]();
      return;
    }
  }

  console.log("Run with: " + JSON.stringify(args));
}

// Export internal helper functions for testing purposes
export const __test = { getNumbers, printUsage };

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  (async function run() {
    await main(process.argv.slice(2));
    process.exit(0);
  })();
}
