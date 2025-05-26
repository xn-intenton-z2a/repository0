#!/usr/bin/env node
// src/lib/main.js

import { fileURLToPath } from "url";
import { dirname, join } from "path";
import fs from "./fsWrapper.js";
import { fetchData, normalizeRecord } from "./crawler.js";

/**
 * Main entrypoint for CLI.
 * @param {string[]} [args] - Arguments to process (defaults to process.argv.slice(2)).
 */
export async function main(args = process.argv.slice(2)) {
  if (args.includes("--help")) {
    console.log("Usage: node src/lib/main.js [--help] [--version] [--ingest <url>]");
    console.log("--help     Show this help message and exit");
    console.log("--version  Print version number and exit");
    console.log("--ingest   Fetch and ingest a record from the specified URL");
    process.exit(0);
  }

  if (args.includes("--version")) {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);
    const pkgPath = join(__dirname, "..", "..", "package.json");
    const pkgJson = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
    console.log(pkgJson.version);
    process.exit(0);
  }

  if (args[0] === "--ingest") {
    const url = args[1];
    if (!url) {
      console.error("Error: --ingest requires a URL argument");
      return;
    }
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);
    const projectRoot = join(__dirname, "..", "..");
    const graphPath = join(projectRoot, "graph.json");
    let dataList = [];
    try {
      const content = fs.readFileSync(graphPath, "utf8");
      dataList = JSON.parse(content);
      if (!Array.isArray(dataList)) {
        dataList = [];
      }
    } catch (err) {
      dataList = [];
    }

    const raw = await fetchData(url);
    const record = normalizeRecord(raw);
    dataList.push(record);
    fs.writeFileSync(graphPath, JSON.stringify(dataList, null, 2), "utf8");
    console.log(`Ingested record ${record.id}`);
    process.exit(0);
  }

  console.log(`Run with: ${JSON.stringify(args)}`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  main(args).catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
