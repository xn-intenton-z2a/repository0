#!/usr/bin/env node
// SPDX-License-Identifier: MIT
// src/lib/main.js

import { fileURLToPath } from "url";
import { plotFromArgs } from "./plot.js";

export async function main(argv = []) {
  // Simple CLI argument parsing into a key map
  const args = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith("--")) {
      const k = a.slice(2);
      const next = argv[i + 1];
      if (!next || next.startsWith("--")) {
        args[k] = true;
      } else {
        args[k] = next;
        i++;
      }
    }
  }

  if (args.help || args.h) {
    console.log("Usage: node src/lib/main.js --expression \"y=sin(x)\" --range \"x=0:6.283:200\" --file output.svg --format svg");
    return;
  }

  try {
    const res = await plotFromArgs(args);
    if (res && res.file) console.log(`Wrote ${res.file}`);
    else if (res && res.svg) console.log(res.svg);
  } catch (err) {
    console.error("Error:", err.message || err);
    process.exitCode = 2;
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  // run and await top-level
  main(args).catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
