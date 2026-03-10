#!/usr/bin/env node
// src/lib/main.js

import { createRequire } from "module";
import { fileURLToPath } from "url";
import * as cron from "./cron.js";

const require = createRequire(import.meta.url);
const pkg = require("../../package.json");

export const name = pkg.name;
export const version = pkg.version;
export const description = pkg.description;

export function getIdentity() {
  return { name, version, description };
}

// Re-export cron API
export const parseCron = cron.parseCron;
export const nextRun = cron.nextRun;
export const nextRuns = cron.nextRuns;
export const matches = cron.matches;
export const toString = cron.toString;

export function main(args) {
  if (args?.includes("--version")) {
    console.log(version);
    return;
  }
  if (args?.includes("--identity")) {
    console.log(JSON.stringify(getIdentity(), null, 2));
    return;
  }
  // simple demo when run as CLI
  if (args?.length) {
    try {
      const expr = args[0];
      const next = cron.nextRun(expr);
      console.log(`Next run for ${expr}: ${next.toString()}`);
    } catch (e) {
      console.error(e && e.message ? e.message : String(e));
      process.exitCode = 2;
    }
    return;
  }
  console.log(`${name}@${version}`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  main(args);
}
