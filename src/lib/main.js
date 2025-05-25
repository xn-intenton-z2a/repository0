#!/usr/bin/env node

export async function main(args = process.argv.slice(2)) {
  if (args[0] === '--crawl') {
    if (!args[1]) {
      console.error('Error: No URL provided for --crawl');
      process.exitCode = 1;
      return;
    }
    const url = args[1];
    let response;
    try {
      response = await fetch(url);
    } catch (err) {
      console.error(`Fetch error: ${err}`);
      process.exitCode = 1;
      return;
    }
    if (!response.ok) {
      console.error(`HTTP request failed with status ${response.status}`);
      process.exitCode = 1;
      return;
    }
    const text = await response.text();
    const regex = /<script\s+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
    const entries = [];
    let match;
    while ((match = regex.exec(text))) {
      const jsonText = match[1];
      try {
        entries.push(JSON.parse(jsonText));
      } catch (err) {
        console.error(`Error parsing JSON-LD: ${err}`);
        process.exitCode = 1;
        return;
      }
    }
    console.log(JSON.stringify(entries));
    return;
  }

  console.log(`Run with: ${JSON.stringify(args)}`);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((err) => {
    console.error(err);
    process.exitCode = 1;
  });
}
