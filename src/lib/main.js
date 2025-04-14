#!/usr/bin/env node
// src/lib/main.js

import { fileURLToPath } from "url";
import { z } from "zod";

export function greet(name = "world") {
  return `Hello, ${name}!`;
}

function gcdTwo(a, b) {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b !== 0) {
    const temp = b;
    b = a % b;
    a = temp;
  }
  return a;
}

function gcdArray(numbers) {
  return numbers.reduce((acc, num) => gcdTwo(acc, num));
}

function lcmTwo(a, b) {
  if (a === 0 || b === 0) return 0;
  return Math.abs(a * b) / gcdTwo(a, b);
}

function lcmArray(numbers) {
  return numbers.reduce((acc, num) => lcmTwo(acc, num));
}

function isPrime(n) {
  if (n <= 1) return false;
  if (n <= 3) return true;
  if (n % 2 === 0 || n % 3 === 0) return false;
  let i = 5;
  while (i * i <= n) {
    if (n % i === 0 || n % (i + 2) === 0) return false;
    i += 6;
  }
  return true;
}

export function main(args = []) {
  if (!args || args.length === 0) {
    console.log("No CLI arguments provided");
    return;
  }
  const command = args[0];

  if (command === "greet") {
    const name = args[1] || "world";
    console.log(greet(name));
  } else if (command === "gcd") {
    if (args.length < 3) {
      console.log("gcd command requires at least two numbers");
      return;
    }
    try {
      const numberSchema = z.preprocess((val) => Number(val), z.number().int());
      const parsedNumbers = args.slice(1).map(num => numberSchema.parse(num));
      const result = gcdArray(parsedNumbers);
      console.log(result);
    } catch (err) {
      console.error("Invalid input for gcd command. Ensure all arguments are integers.");
    }
  } else if (command === "lcm") {
    if (args.length < 3) {
      console.log("lcm command requires at least two numbers");
      return;
    }
    try {
      const numberSchema = z.preprocess((val) => Number(val), z.number().int());
      const parsedNumbers = args.slice(1).map(num => numberSchema.parse(num));
      const result = lcmArray(parsedNumbers);
      console.log(result);
    } catch (err) {
      console.error("Invalid input for lcm command. Ensure all arguments are integers.");
    }
  } else if (command === "prime") {
    if (args.length !== 2) {
      console.log("prime command requires exactly one number");
      return;
    }
    try {
      const numberSchema = z.preprocess((val) => Number(val), z.number().int());
      const num = numberSchema.parse(args[1]);
      console.log(isPrime(num) ? `${num} is prime` : `${num} is not prime`);
    } catch (err) {
      console.error("Invalid input for prime command. Ensure the argument is an integer.");
    }
  } else if (command === "diagnostics") {
    console.log("Diagnostics: All systems operational");
  } else {
    console.log(`Unknown command: ${command}`);
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  main(args);
}
