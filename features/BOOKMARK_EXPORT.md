# BOOKMARK_EXPORT

# Description
Add a new CLI flag to export the results of primary operations into a bookmarks JSON file. This feature enables users to persist key outputs, including parsed CLI options, intermediate build summaries, enhanced build reports, configuration objects, and merge summaries, into a structured file for downstream automation or inspection.

# Commands and Flags
1. --export-bookmarks   Export collected operation data to a JSON bookmarks file
2. --export-path <file> Specify the output file path for the bookmarks (defaults to bookmarks.json)

# Implementation
- Extend parseArgs(args) in src/lib/main.js to recognize:
  • exportBookmarks (boolean) when --export-bookmarks is present
  • exportPath (string) when --export-path <file> is provided
- Export a new function exportBookmarks(data, filePath) that:
  1. Serializes `data` to JSON
  2. Writes it to `filePath` using fs.writeFileSync
  3. Logs a confirmation message
- In main(args): after main operations complete (build, refresh, merge):
  • If options.exportBookmarks is true:
    - Gather `bookmarks` object containing:
      - options
      - intermediateSummary (if build-intermediate ran)
      - enhancedReport (if build-enhanced ran)
      - configObject (if refresh ran)
      - mergeSummary (if merge-persist ran)
    - Call exportBookmarks(bookmarks, options.exportPath)
    - Exit with code 0

# Testing
- Unit tests in tests/unit/main.test.js:
  * parseArgs(['--export-bookmarks','--export-path','out.json']) sets flags correctly
  * exportBookmarks writes JSON to provided path and logs confirmation (mock fs.writeFileSync)
  * Integration test: simulate main(['--build-intermediate','--export-bookmarks','--export-path','bm.json']), stub performBuildIntermediate, verify exportBookmarks called with expected data and file path

# Documentation
- Update README.md under **Bookmark Export**:
  • Describe --export-bookmarks and --export-path flags
  • Provide inline examples:
    npm run build-intermediate -- --export-bookmarks
    npm run refresh -- --export-bookmarks --export-path=my-bookmarks.json