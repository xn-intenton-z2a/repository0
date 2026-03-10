#!/usr/bin/env node
// src/lib/main.js

import { createRequire } from "module";
import { fileURLToPath } from "url";
import * as browser from "./browser.js";

const require = createRequire(import.meta.url);
const pkg = require("../../package.json");

export const name = pkg.name || "string-utils";
export const version = pkg.version || "0.0.0";
export const description = pkg.description || "String utility functions";

// re-export functions implemented in browser-friendly module
export const {
  slugify,
  truncate,
  camelCase,
  kebabCase,
  titleCase,
  wordWrap,
  stripHtml,
  escapeRegex,
  pluralize,
  levenshteinDistance,
} = browser;

export function getIdentity() {
  return { name, version, description };
}

export function main(args) {
  if (args?.includes("--version")) {
    console.log(version);
    return;
  }
  if (args?.includes("--identity")) {
    console.log(JSON.stringify(getIdentity(), null, 2));
    return;
  }
  console.log(`${name}@${version}`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  main(args);
}
