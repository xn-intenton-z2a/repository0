#!/usr/bin/env node

/*
  repository0 CLI Tool: A Template for Automated Workflows

  Mission:
  This CLI tool strictly adheres to the mission of repository0 to deliver a clear, maintainable CLI implementation focused on robust arithmetic operations and automated workflows. Drift from previous implementations has been pruned to ensure consistent error handling, input validation, and alignment with the mission statement.

  Change Log:
  - Pruned drift from previous implementations to adhere strictly to the mission statement.
  - Enhanced error handling and input validation across all operations.
  - Removed unused error parameter in handleVersion and fixed linting warnings.
  - Added new operation: prime number check (--prime flag).
  - Expanded unit test coverage and updated functions for clarity.
  - Enhanced unit test coverage to nearly 100% by covering all code paths.
*/

import { fileURLToPath } from "url";
import { createRequire } from "module";
import { z } from "zod";

const USAGE_MESSAGE =
  "Usage: node src/lib/main.js [--diagnostics] [--help] [--version] [--greet] [--info] [--sum] [--multiply] [--subtract] [--divide] [--modulo] [--average] [--power] [--factorial] [--sqrt] [--median] [--mode] [--stddev] [--range] [--factors] [--variance] [--demo] [--real] [--fibonacci] [--gcd] [--lcm] [--prime] [numbers...]";

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
  console.log("  --info       : Display tool version and current date/time");
  console.log("  --sum        : Compute the sum of provided numbers (arithmetic demonstration)");
  console.log("  --multiply   : Compute the product of provided numbers (arithmetic demonstration)");
  console.log("  --subtract   : Subtract each subsequent number from the first provided number (arithmetic demonstration)");
  console.log("  --divide     : Divide the first number by each of the subsequent numbers sequentially (arithmetic demonstration)");
  console.log("  --modulo     : Compute the modulo of provided numbers (first % second % ... ) (arithmetic demonstration)");
  console.log("  --average    : Compute the arithmetic average of provided numbers (arithmetic demonstration)");
  console.log("  --power      : Compute exponentiation; first number raised to the power of the second, and chain if more provided (arithmetic demonstration)");
  console.log("  --factorial  : Compute the factorial of a provided non-negative integer (arithmetic demonstration)");
  console.log("  --sqrt       : Compute the square root of the provided number (arithmetic demonstration)");
  console.log("  --median     : Compute the median of the provided numbers (extended arithmetic demonstration)");
  console.log("  --mode       : Compute the mode of the provided numbers (extended arithmetic demonstration)");
  console.log("  --stddev     : Compute the standard deviation of the provided numbers (extended arithmetic demonstration)");
  console.log("  --range      : Compute the range (max - min) of the provided numbers (extended arithmetic demonstration)");
  console.log("  --factors    : List all factors of a provided non-negative integer (extended arithmetic demonstration)");
  console.log("  --variance   : Compute the variance of provided numbers (extended arithmetic demonstration)");
  console.log("  --demo       : Run in demo mode to output sample data without making a network call");
  console.log("  --real       : Run the real call simulation (feature not implemented over the wire)");
  console.log("  --fibonacci  : Compute the nth Fibonacci number (sequence demonstration)");
  console.log("  --gcd        : Compute the greatest common divisor of provided integers");
  console.log("  --lcm        : Compute the least common multiple of provided integers");
  console.log("  --prime      : List prime numbers from the provided inputs (new extended operation)");
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
  } catch {
    console.error("Could not retrieve version: unknown error");
  }
}

function handleDiagnostics() {
  console.log("Diagnostics: All systems operational.");
}

function handleGreet() {
  console.log("Hello, welcome to repository0!");
}

function handleInfo() {
  const version = getVersion();
  console.log(`Repository0 CLI Tool version ${version} - ${new Date().toISOString()}`);
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

function handleMedian(args) {
  const nums = getNumbers(args, "--median").sort((a, b) => a - b);
  if (nums.length === 0) {
    console.log("Median: No numbers provided");
    return;
  }
  let median;
  const mid = Math.floor(nums.length / 2);
  if (nums.length % 2 === 0) {
    median = (nums[mid - 1] + nums[mid]) / 2;
  } else {
    median = nums[mid];
  }
  console.log(`Median: ${median}`);
}

function handleMode(args) {
  const nums = getNumbers(args, "--mode");
  if (nums.length === 0) {
    console.log("Mode: No numbers provided");
    return;
  }
  const frequency = {};
  nums.forEach((num) => {
    frequency[num] = (frequency[num] || 0) + 1;
  });
  let mode = nums[0];
  let maxCount = frequency[mode];
  for (const num in frequency) {
    if (frequency[num] > maxCount) {
      mode = Number(num);
      maxCount = frequency[num];
    }
  }
  console.log(`Mode: ${mode}`);
}

function handleStddev(args) {
  const nums = getNumbers(args, "--stddev");
  if (nums.length === 0) {
    console.log("Std Dev: No numbers provided");
    return;
  }
  const mean = nums.reduce((acc, curr) => acc + curr, 0) / nums.length;
  const variance = nums.reduce((acc, curr) => acc + Math.pow(curr - mean, 2), 0) / nums.length;
  const stddev = Math.sqrt(variance);
  console.log(`Std Dev: ${stddev}`);
}

function handleRange(args) {
  const nums = getNumbers(args, "--range");
  if (nums.length === 0) {
    console.log("Range: No numbers provided");
    return;
  }
  const min = Math.min(...nums);
  const max = Math.max(...nums);
  console.log(`Range: ${max - min}`);
}

// New function: handleFactors
function handleFactors(args) {
  const nums = getNumbers(args, "--factors");
  if (nums.length === 0) {
    console.log("Factors: Provide a non-negative integer");
    return;
  }
  const n = nums[0];
  if (!Number.isInteger(n) || n < 0) {
    console.log("Factors: Input must be a non-negative integer");
    return;
  }
  const factors = [];
  for (let i = 1; i <= n; i++) {
    if (n % i === 0) {
      factors.push(i);
    }
  }
  console.log(`Factors: ${factors.join(",")}`);
}

// New function: handleVariance
function handleVariance(args) {
  const nums = getNumbers(args, "--variance");
  if (nums.length === 0) {
    console.log("Variance: No numbers provided");
    return;
  }
  const mean = nums.reduce((acc, curr) => acc + curr, 0) / nums.length;
  const variance = nums.reduce((acc, curr) => acc + Math.pow(curr - mean, 2), 0) / nums.length;
  console.log(`Variance: ${variance}`);
}

// New function: handleFibonacci
function handleFibonacci(args) {
  const nums = getNumbers(args, "--fibonacci");
  if (nums.length === 0) {
    console.log("Fibonacci: Provide a non-negative integer");
    return;
  }
  const n = nums[0];
  if (!Number.isInteger(n) || n < 0) {
    console.log("Fibonacci: Input must be a non-negative integer");
    return;
  }
  if (n === 0) {
    console.log("Fibonacci: 0");
    return;
  } else if (n === 1) {
    console.log("Fibonacci: 1");
    return;
  }
  let a = 0;
  let b = 1;
  let temp;
  for (let i = 2; i <= n; i++) {
    temp = a + b;
    a = b;
    b = temp;
  }
  console.log(`Fibonacci: ${b}`);
}

// New function: handleGCD and its helper
function gcd(a, b) {
  while (b !== 0) {
    const temp = b;
    b = a % b;
    a = temp;
  }
  return a;
}

function handleGcd(args) {
  const nums = getNumbers(args, "--gcd");
  if (nums.length === 0) {
    console.log("GCD: No numbers provided");
    return;
  }
  for (const num of nums) {
    if (!Number.isInteger(num)) {
      console.log("GCD: All inputs must be integers");
      return;
    }
  }
  let result = nums[0];
  for (let i = 1; i < nums.length; i++) {
    result = gcd(result, nums[i]);
  }
  console.log(`GCD: ${result}`);
}

// New function: handleLCM and its helper
function lcm(a, b) {
  return Math.abs(a * b) / gcd(a, b);
}

function handleLcm(args) {
  const nums = getNumbers(args, "--lcm");
  if (nums.length === 0) {
    console.log("LCM: No numbers provided");
    return;
  }
  for (const num of nums) {
    if (!Number.isInteger(num)) {
      console.log("LCM: All inputs must be integers");
      return;
    }
  }
  let result = nums[0];
  for (let i = 1; i < nums.length; i++) {
    result = lcm(result, nums[i]);
  }
  console.log(`LCM: ${result}`);
}

// New function: handlePrime
function isPrime(n) {
  if (n < 2) return false;
  for (let i = 2, sqrt = Math.sqrt(n); i <= sqrt; i++) {
    if (n % i === 0) return false;
  }
  return true;
}

function handlePrime(args) {
  const nums = getNumbers(args, "--prime");
  if (nums.length === 0) {
    console.log("Prime: Provide at least one number");
    return;
  }
  const primes = nums.filter(isPrime);
  console.log(`Prime: ${primes.join(",")}`);
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
    "--info": handleInfo,
    "--sum": () => handleSum(args),
    "--multiply": () => handleMultiply(args),
    "--subtract": () => handleSubtract(args),
    "--divide": () => handleDivide(args),
    "--modulo": () => handleModulo(args),
    "--average": () => handleAverage(args),
    "--power": () => handlePower(args),
    "--factorial": () => handleFactorial(args),
    "--sqrt": () => handleSqrt(args),
    "--median": () => handleMedian(args),
    "--mode": () => handleMode(args),
    "--stddev": () => handleStddev(args),
    "--range": () => handleRange(args),
    "--factors": () => handleFactors(args),
    "--variance": () => handleVariance(args),
    "--demo": handleDemo,
    "--real": handleReal,
    "--fibonacci": () => handleFibonacci(args),
    "--gcd": () => handleGcd(args),
    "--lcm": () => handleLcm(args),
    "--prime": () => handlePrime(args),
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

export const __test = { getNumbers, printUsage, getVersion, printHelp, gcd, lcm };

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  (async function run() {
    await main(process.argv.slice(2));
    process.exit(0);
  })();
}
