#!/usr/bin/env node
// src/lib/main.js

import { fileURLToPath } from "url";

export async function main(args = []) {
  if (args[0] === "--crawl") {
    const url = args[1];
    if (!url) {
      console.error("Error: URL must be provided with --crawl");
      process.exitCode = 1;
      return;
    }

    try {
      const res = await fetch(url);
      if (!res.ok) {
        console.error(`Error fetching URL: ${res.status} ${res.statusText || ""}`.trim());
        process.exitCode = 1;
        return;
      }

      const text = await res.text();
      const regex = /<script\s+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
      const results = [];
      let match;
      const blocks = [];

      while ((match = regex.exec(text)) !== null) {
        blocks.push(match[1]);
      }

      for (const block of blocks) {
        try {
          results.push(JSON.parse(block));
        } catch (err) {
          console.error(`Error parsing JSON-LD: ${err.message}`);
          process.exitCode = 1;
          return;
        }
      }

      console.log(JSON.stringify(results));
    } catch (err) {
      console.error(`Error fetching URL: ${err.message}`);
      process.exitCode = 1;
    }
  } else {
    console.log(`Run with: ${JSON.stringify(args)}`);
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main(process.argv.slice(2)).catch((err) => {
    console.error(err);
    process.exitCode = 1;
  });
}
