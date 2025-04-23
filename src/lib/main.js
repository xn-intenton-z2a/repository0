#!/usr/bin/env node
// src/lib/main.js

import { fileURLToPath } from "url";

// Helper function to compute GCD
function computeGCD(a, b) {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b !== 0) {
    const temp = b;
    b = a % b;
    a = temp;
  }
  return a;
}

// Helper function to compute LCM using GCD
function computeLCM(a, b) {
  if (a === 0 || b === 0) return 0;
  return Math.abs(a * b) / computeGCD(a, b);
}

// Helper function to check if a number is prime
function isPrime(n) {
  n = Number(n);
  if (n <= 1 || !Number.isInteger(n)) return false;
  if (n === 2) return true;
  if (n % 2 === 0) return false;
  const limit = Math.sqrt(n);
  for (let i = 3; i <= limit; i += 2) {
    if (n % i === 0) return false;
  }
  return true;
}

function printHelp() {
  console.log(`
Valid commands:
  diagnostics
  version
  check-update
  gcd <num1> <num2>
  lcm <num1> <num2>
  isprime <num>
`);
}

export function main(args) {
  if (args.length === 0) {
    console.log("Run with: []");
    return;
  }

  const cmd = args[0];
  
  // Basic commands handling
  if (args.length === 1) {
    if (cmd === "diagnostics") {
      console.log("Diagnostics: System check initiated.");
      return;
    } else if (cmd === "version") {
      console.log("Version: 2.1.0-0");
      return;
    } else if (cmd === "check-update") {
      console.log("Update check in progress.");
      return;
    } else {
      // Unrecognized command with single argument
      printHelp();
      return;
    }
  } else {
    // Handling arithmetic commands and others
    if (cmd === "gcd") {
      if (args.length === 3) {
        const num1 = Number(args[1]);
        const num2 = Number(args[2]);
        if (isNaN(num1) || isNaN(num2)) {
          printHelp();
          return;
        }
        console.log(String(computeGCD(num1, num2)));
        return;
      } else {
        printHelp();
        return;
      }
    } else if (cmd === "lcm") {
      if (args.length === 3) {
        const num1 = Number(args[1]);
        const num2 = Number(args[2]);
        if (isNaN(num1) || isNaN(num2)) {
          printHelp();
          return;
        }
        console.log(String(computeLCM(num1, num2)));
        return;
      } else {
        printHelp();
        return;
      }
    } else if (cmd === "isprime") {
      if (args.length === 2) {
        const num = Number(args[1]);
        if (isNaN(num)) {
          printHelp();
          return;
        }
        console.log(isPrime(num) ? "true" : "false");
        return;
      } else {
        printHelp();
        return;
      }
    } else {
      // For any other command with >1 arguments
      console.log(`Run with: ${JSON.stringify(args)}`);
    }
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  main(args);
}
