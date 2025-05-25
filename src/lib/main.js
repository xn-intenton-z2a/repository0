/*
 * Main script for repository0 CLI.
 */

export async function main(argv = process.argv.slice(2)) {
  const args = argv;
  const wikiFlag = '--fetch-wikipedia';
  const idx = args.indexOf(wikiFlag);
  if (idx !== -1) {
    const term = args[idx + 1];
    if (!term) {
      console.error('No term provided for --fetch-wikipedia');
      process.exit(1);
      return;
    }
    const urlTerm = encodeURIComponent(term);
    let response;
    try {
      response = await fetch(
        `https://en.wikipedia.org/api/rest_v1/page/summary/${urlTerm}`
      );
    } catch (err) {
      console.error(`Error fetching article: ${err.message}`);
      process.exit(1);
      return;
    }
    if (response.status === 404) {
      console.error(`Article not found: ${term}`);
      process.exit(1);
      return;
    }
    if (!response.ok) {
      console.error(
        `Error fetching article: ${response.status} ${response.statusText || ''}`.trim()
      );
      process.exit(1);
      return;
    }
    const data = await response.json();
    if (data.type === 'disambiguation') {
      console.error(`${term} is a disambiguation page`);
      process.exit(1);
      return;
    }
    if (data.extract) {
      console.log(data.extract);
      process.exit(0);
      return;
    } else {
      console.error(`No summary available for: ${term}`);
      process.exit(1);
      return;
    }
  }

  // Default behavior
  console.log(`Run with: ${JSON.stringify(args)}`);
  process.exit(0);
}

// If run as script, invoke main()
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
