# CLI Flags Support

# Overview
Enhance the main script to accept and process standard CLI flags such as --help, --version, and the new --ingest flag for data ingestion and persistence, without external dependencies.

# Behavior
- --help: Display a usage message listing available flags and syntax, then exit cleanly with code 0.
- --version: Read and print the version number from package.json, then exit cleanly with code 0.
- --ingest <url>: Fetch JSON data from the specified URL using fetchData and normalizeRecord from the crawler module; load or initialize project-root graph.json; append the normalized record; write the updated graph back to graph.json; print confirmation of the ingested record ID; exit with code 0.
- Default: When no known flags or a flag without required arguments is provided, log the provided arguments as before and do not exit early.

# Implementation
- In src/lib/main.js, update main to async and use process.argv slice to detect flags.
- Use fileURLToPath and dirname to resolve module location; import fetchData and normalizeRecord from src/lib/crawler.js via relative paths.
- For --ingest, ensure args[0] is --ingest and args[1] is present; handle read/write of graph.json using fs readFileSync and writeFileSync with JSON parsing and stringification.
- Maintain ESM module style; preserve help/version behavior.

# Tests
- In tests/unit/main.test.js, update the Main Output suite to expect usage lines for --help, --version, and --ingest.
- Add an "Ingest Command" describe block:
  - Stub global fetch to return a sample record.
  - Mock fs.readFileSync to simulate absent or existing graph.json and spy on fs.writeFileSync.
  - Spy on console.log and mock process.exit to throw, verifying exit code.
  - Assert writeFileSync was called with correct file path, JSON content matching array of normalized record, and utf8 encoding; assert log and exit call for ingestion.
- Ensure existing tests for help, version, and default behavior continue to pass.