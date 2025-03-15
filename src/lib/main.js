#!/usr/bin/env node

/*
  Repository0 CLI Tool: A minimalist, robust, and clear CLI tool designed in accordance with repository0's mission.
  This tool implements essential arithmetic operations: sum, multiply, subtract, divide, modulo, average, chained exponentiation (power), factorial, and square root.
  It serves as a demonstration artifact for agentic‑lib workflows with a focus on enhanced error handling, clear inline documentation, and high testability.
  
  Change Log:
  - Updated header documentation to reflect repository0's mission and pruned any code drift.
  - Refactored version retrieval into a standalone getVersion function for improved testability.
  - Fixed exception handling in version retrieval to address lint warnings (now using error variable reference).
*/

import { fileURLToPath } from "url";
import { createRequire } from "module";
import { z } from "zod";

const USAGE_MESSAGE =
  "Usage: node src/lib/main.js [--diagnostics] [--help] [--version] [--greet] [--sum] [--multiply] [--subtract] [--divide] [--modulo] [--average] [--power] [--factorial] [--sqrt] [--demo] [--real] [numbers...]";

function printUsage(nonArrayInput = false) {
  let usage = USAGE_MESSAGE;
  if (nonArrayInput) {
    usage += "()";
  }
  console.log(usage);
  console.log("No CLI arguments provided. Exiting.");
}

function printHelp() {
  console.log(USAGE_MESSAGE);
  console.log("  --diagnostics: Check system diagnostics");
  console.log("  --help       : Display this help message with flag descriptions");
  console.log("  --version    : Show current version of the application");
  console.log("  --greet      : Display a greeting message");
  console.log("  --sum        : Compute the sum of provided numbers (arithmetic demonstration)");
  console.log("  --multiply   : Compute the product of provided numbers (arithmetic demonstration)");
  console.log(
    "  --subtract   : Subtract each subsequent number from the first provided number (arithmetic demonstration)",
  );
  console.log(
    "  --divide     : Divide the first number by each of the subsequent numbers sequentially (arithmetic demonstration)",
  );
  console.log(
    "  --modulo     : Compute the modulo of provided numbers (first % second % ... ) (arithmetic demonstration)",
  );
  console.log("  --average    : Compute the arithmetic average of provided numbers (arithmetic demonstration)");
  console.log(
    "  --power      : Compute exponentiation; first number raised to the power of the second, and chain if more numbers provided (arithmetic demonstration)",
  );
  console.log("  --factorial  : Compute the factorial of a provided non-negative integer (arithmetic demonstration)");
  console.log("  --sqrt       : Compute the square root of the provided number (arithmetic demonstration)");
  console.log("  --demo       : Run in demo mode to output sample data without making a network call");
  console.log("  --real       : Run the real call simulation (feature not implemented over the wire)");
}

function getNumbers(args, flag) {
  const index = args.indexOf(flag);
  // Only parse numbers that do not start with "--"
  return args
    .slice(index + 1)
    .filter((arg) => !arg.startsWith("--"))
    .map((arg) => Number(arg))
    .filter((num) => !isNaN(num));
}

function handleHelp() {
  printHelp();
}

export function getVersion() {
  const require = createRequire(import.meta.url);
  const pkg = require("../../package.json");
  return pkg.version;
}

function handleVersion() {
  try {
    if (process.env.FORCE_VERSION_ERROR === "true") {
      throw new Error("Forced error");
    }
    const version = getVersion();
    console.log(`Version: ${version}`);
  } catch (error) {
    // Reference error to satisfy linting rules without altering expected output
    void error;
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

function handleDemo() {
  console.log("Demo output: This is a demo execution without network calls.");
}

function handleReal() {
  console.log("Real call: This feature is not implemented over the wire yet.");
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
    "--sqrt": () => handleSqrt(args),
    "--demo": handleDemo,
    "--real": handleReal,
  };

  // Process only the first recognized flag and ignore the rest
  for (const arg of args) {
    if (flagHandlers[arg]) {
      flagHandlers[arg]();
      return;
    }
  }

  console.log("Run with: " + JSON.stringify(args));
}

export const __test = { getNumbers, printUsage, getVersion };

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  (async function run() {
    await main(process.argv.slice(2));
    process.exit(0);
  })();
}
