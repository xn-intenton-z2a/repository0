#!/usr/bin/env node
import { fileURLToPath } from "url";

export function main(args) {
  const [command, ...values] = args;
  if (!command) {
    console.log(`Run with: ${JSON.stringify(args)}`);
    return;
  }
  const nums = values.map((v) => Number(v));
  if (nums.some((n) => Number.isNaN(n))) {
    console.error("Arguments must be numbers");
    process.exit(1);
  }
  if (command === "add") {
    const sum = nums.reduce((acc, x) => acc + x, 0);
    console.log(sum);
  } else if (command === "multiply") {
    const product = nums.reduce((acc, x) => acc * x, 1);
    console.log(product);
  } else {
    console.log(`Unknown command: ${command}`);
    console.log(`Run with: ${JSON.stringify(args)}`);
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  main(args);
}
