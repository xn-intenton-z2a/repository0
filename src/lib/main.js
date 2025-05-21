#!/usr/bin/env node
// src/lib/main.js

import { fileURLToPath } from "url";

const emotions = {
  happy: ":-)",
  sad: ":-(",
  angry: ">:-(",
  surprised: ":-O",
};

function printUsage() {
  console.log("Usage: --emotion <name>");
  console.log(
    `Supported emotions: ${Object.keys(emotions).join(", ")}`
  );
}

export function main(args = []) {
  const i = args.indexOf("--emotion");
  if (i === -1) {
    printUsage();
    return 0;
  }
  const emotion = args[i + 1];
  if (!emotion) {
    console.error("No emotion specified.");
    printUsage();
    return 1;
  }
  const key = emotion.toLowerCase();
  if (emotions[key]) {
    console.log(emotions[key]);
    return 0;
  }
  console.error(`Unsupported emotion: ${emotion}`);
  console.error(
    `Supported emotions: ${Object.keys(emotions).join(", ")}`
  );
  return 1;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  const code = main(args);
  process.exit(code);
}
