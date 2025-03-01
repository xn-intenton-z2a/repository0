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

export async function main(args = []) {
  let nonArrayInput = false;
  if (!Array.isArray(args)) {
    nonArrayInput = true;
    args = [];
  }

  if (args.includes("--help")) {
    printHelp();
    return;
  } else if (args.includes("--version")) {
    try {
      const require = createRequire(import.meta.url);
      const pkg = require("../../package.json");
      const version = pkg.version;
      console.log(`Version: ${version}`);
    } catch {
      console.error("Could not retrieve version: unknown error");
    }
    return;
  } else if (args.includes("--diagnostics")) {
    console.log("Diagnostics: All systems operational.");
    return;
  } else if (args.includes("--greet")) {
    console.log("Hello, welcome to repository0!");
    return;
  } else if (args.includes("--sum")) {
    const nums = getNumbers(args, "--sum");
    const total = nums.reduce((acc, curr) => acc + curr, 0);
    console.log(`Sum: ${total}`);
    return;
  } else if (args.includes("--multiply")) {
    const nums = getNumbers(args, "--multiply");
    const product = nums.reduce((acc, curr) => acc * curr, 1);
    console.log(`Multiply: ${product}`);
    return;
  } else if (args.includes("--subtract")) {
    const nums = getNumbers(args, "--subtract");
    if (nums.length === 0) {
      console.log("Subtract: No numbers provided");
      return;
    }
    if (nums.length === 1) {
      console.log(`Subtract: ${nums[0]}`);
      return;
    }
    const result = nums.slice(1).reduce((acc, curr) => acc - curr, nums[0]);
    console.log(`Subtract: ${result}`);
    return;
  } else if (args.includes("--divide")) {
    const nums = getNumbers(args, "--divide");
    if (nums.length === 0) {
      console.log("Divide: No numbers provided");
      return;
    }
    if (nums.length === 1) {
      console.log(`Divide: ${nums[0]}`);
      return;
    }
    if (nums.slice(1).some((n) => n === 0)) {
      console.log("Divide: Division by zero error");
      return;
    }
    const result = nums.slice(1).reduce((acc, curr) => acc / curr, nums[0]);
    console.log(`Divide: ${result}`);
    return;
  } else if (args.includes("--modulo")) {
    const nums = getNumbers(args, "--modulo");
    if (nums.length < 2) {
      console.log("Modulo: Provide at least two numbers");
      return;
    }
    if (nums.slice(1).some((n) => n === 0)) {
      console.log("Modulo: Division by zero error");
      return;
    }
    const result = nums.slice(1).reduce((acc, curr) => acc % curr, nums[0]);
    console.log(`Modulo: ${result}`);
    return;
  } else if (args.includes("--average")) {
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
