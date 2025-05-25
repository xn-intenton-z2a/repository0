#!/usr/bin/env node
// src/lib/main.js

import { fileURLToPath } from "url";

export async function main(args = []) {
  const flagIndex = args.indexOf("--fetch-wikipedia");
  if (flagIndex !== -1) {
    const term = args[flagIndex + 1];
    if (!term) {
      console.error("No search term provided for --fetch-wikipedia");
      process.exit(1);
    }
    const encoded = encodeURIComponent(term);
    const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encoded}`;
    try {
      const res = await fetch(url);
      if (res.status === 200) {
        const data = await res.json();
        if (data.type === "disambiguation") {
          console.error(`Disambiguation page encountered for term: ${term}`);
          process.exit(1);
        }
        if (!data.extract) {
          console.error(`No summary available for term: ${term}`);
          process.exit(1);
        }
        console.log(data.extract);
        process.exit(0);
      } else if (res.status === 404) {
        console.error(`Article not found: ${term}`);
        process.exit(1);
      } else {
        console.error(`Error fetching article: ${res.status}`);
        process.exit(1);
      }
    } catch (err) {
      console.error(`Error fetching article: ${err.message}`);
      process.exit(1);
    }
    return;
  }

  // default behavior
  console.log(`Run with: ${JSON.stringify(args)}`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  main(args);
}
