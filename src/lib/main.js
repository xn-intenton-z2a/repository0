#!/usr/bin/env node
// src/lib/main.js

import { fileURLToPath } from "url";
import { dirname, join } from "path";
import fs from "./fsWrapper.js";
import { fetchData, normalizeRecord } from "./crawler.js";
import { appendRecord } from "./graph.js";

/**
 * Main entrypoint for CLI.
 * @param {string[]} [args] - Arguments to process (defaults to process.argv.slice(2)).
 */
export function main(args = process.argv.slice(2)) {
  // Help flag
  if (args.includes("--help")) {
    console.log("Usage: node src/lib/main.js [--help] [--version] [--ingest <url>]");
    console.log("--help     Show this help message and exit");
    console.log("--version  Print version number and exit");
    console.log("--ingest <url>  Fetch and ingest a record and persist to graph.json");
    process.exit(0);
  }

  // Version flag
  if (args.includes("--version")) {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);
    const pkgPath = join(__dirname, "..", "..", "package.json");
    const pkgJson = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
    console.log(pkgJson.version);
    process.exit(0);
  }

  // Ingest flag
  if (args[0] === "--ingest") {
    const url = args[1];
    if (!url) {
      console.error("Error: --ingest requires a URL argument");
      return;
    }
    return (async () => {
      const raw = await fetchData(url);
      const record = normalizeRecord(raw);
      await appendRecord(record);
      console.log(`Ingested record with id: ${record.id}`);
      process.exit(0);
    })();
  }

  // Default behavior
  console.log(`Run with: ${JSON.stringify(args)}`);
}

// If executed as a script, run main and catch errors
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  const result = main(args);
  Promise.resolve(result).catch((err) => {
    console.error(err);
    process.exit(1);
  });
}