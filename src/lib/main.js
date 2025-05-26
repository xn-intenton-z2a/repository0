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
  // Mission flag
  if (args.includes("--mission")) {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);
    const missionPath = join(__dirname, "..", "..", "MISSION.md");
    let mission = "";
    try {
      const content = fs.readFileSync(missionPath, "utf8");
      const lines = content
        .split(/\r?\n/)
        .map((l) => l.trim())
        .filter((l) => l && !l.startsWith("#"));
      mission = lines.length ? lines[0] : content.trim();
    } catch (err) {
      mission = "Build a knowledge graph of the physical world by crawling public data sources.";
    }
    console.log(mission);
    process.exit(0);
  }

  // Help flag
  if (args.includes("--help")) {
    console.log(
      "Usage: node src/lib/main.js [--help] [--version] [--mission] [--ingest <url>] [--ingest-all <url>]"
    );
    console.log("--help     Show this help message and exit");
    console.log("--version  Print version number and exit");
    console.log("--mission  Print repository mission statement and exit");
    console.log(
      "--ingest <url>  Fetch and ingest a record and persist to graph.json"
    );
    console.log(
      "--ingest-all <url>  Fetch an array of records from URL, normalize each, and append all to graph.json"
    );
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

  // Batch ingest flag
  if (args[0] === "--ingest-all") {
    const url = args[1];
    if (!url) {
      console.error("Error: --ingest-all requires a URL argument");
      process.exit(1);
      return;
    }
    return (async () => {
      const rawArray = await fetchData(url);
      if (!Array.isArray(rawArray)) {
        console.error("Error: --ingest-all endpoint did not return an array");
        process.exit(1);
      }
      const records = rawArray.map(normalizeRecord);
      for (const rec of records) {
        await appendRecord(rec);
      }
      console.log(`Ingested ${records.length} records from ${url}`);
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
