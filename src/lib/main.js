#!/usr/bin/env node

/* eslint-env node, es2022 */
// src/lib/main.js

import { fileURLToPath } from "url";
import { createRequire } from "module";
import { z } from "zod";

const USAGE_MESSAGE = "Usage: node src/lib/main.js [--diagnostics] [--help] [--version] [--greet] [--sum] [--multiply] [--subtract] [--divide] [--modulo] [--average] [numbers...]";

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
  console.log("  --sum        : Compute the sum of provided numbers");
  console.log("  --multiply   : Compute the product of provided numbers");
  console.log("  --subtract   : Subtract each subsequent number from the first provided number");
  console.log("  --divide     : Divide the first number by each of the subsequent numbers sequentially");
  console.log("  --modulo     : Compute the modulo of provided numbers (first % second % ... )");
  console.log("  --average    : Compute the arithmetic average of provided numbers");
}

function getNumbers(args, flag) {
  const index = args.indexOf(flag);
  return args
    .slice(index + 1)
    .filter((arg) => !arg.startsWith("--"))
    .map(Number)
    .filter((num) => !isNaN(num));
}

function handleHelp() {
  printHelp();
}

function handleVersion() {
  try {
    const require = createRequire(import.meta.url);
    const pkg = require("../../package.json");
    const version = pkg.version;
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
  let nums = getNumbers(args, "--average")
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

export async function main(args = []) {
  let nonArrayInput = false;
  if (!Array.isArray(args)) {
    nonArrayInput = true;
    args = [];
  }
  if (args.includes("--help")) {
    handleHelp();
    return;
  }
  if (args.includes("--version")) {
    handleVersion();
    return;
  }
  if (args.includes("--diagnostics")) {
    handleDiagnostics();
    return;
  }
  if (args.includes("--greet")) {
    handleGreet();
    return;
  }
  if (args.includes("--sum")) {
    handleSum(args);
    return;
  }
  if (args.includes("--multiply")) {
    handleMultiply(args);
    return;
  }
  if (args.includes("--subtract")) {
    handleSubtract(args);
    return;
  }
  if (args.includes("--divide")) {
    handleDivide(args);
    return;
  }
  if (args.includes("--modulo")) {
    handleModulo(args);
    return;
  }
  if (args.includes("--average")) {
    handleAverage(args);
    return;
  }
  if (args.length === 0) {
    printUsage(nonArrayInput);
    return;
  }
  console.log("Run with: " + JSON.stringify(args));
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  (async function run() {
    await main(process.argv.slice(2));
    process.exit(0);
  })();
}
