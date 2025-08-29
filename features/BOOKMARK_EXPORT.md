# BOOKMARK_EXPORT

# Description
Provide a mechanism to persist key CLI outputs and build artifacts into a JSON bookmarks file for downstream inspection and automation.

# Commands and Flags

1. --export-bookmarks    Export collected data (options and operation summaries) to a JSON file.
2. --export-path <file>  Specify target bookmarks file (defaults to bookmarks.json).

# Implementation

- Extend parseArgs(args) in src/lib/main.js to detect:
  • exportBookmarks: boolean when --export-bookmarks is present.
  • exportPath: string when --export-path <file> is provided.
- Export function exportBookmarks(data, filePath) that:
  1. Accepts an object with fields: options, intermediateSummary, enhancedReport, config, mergeSummary.
  2. Serializes `data` to pretty JSON and writes to `filePath` using fs.writeFileSync.
  3. Logs confirmation: `Bookmarks saved to <filePath>`.
- In main(args): after performing any of build, refresh, or merge operations:
  • If options.exportBookmarks is true:
    - Gather bookmarks object with available fields.
    - Call exportBookmarks(bookmarks, options.exportPath).
    - Exit(0).

# Testing

- Unit tests in tests/unit/main.test.js:
  * parseArgs(['--export-bookmarks','--export-path','out.json']) sets options.exportBookmarks and options.exportPath.
  * Mock fs.writeFileSync to test exportBookmarks writes correct JSON and logs confirmation.
  * Integration test: stub performBuildIntermediate to return a summary, call main(['--build-intermediate','--export-bookmarks','--export-path','bm.json']), verify exportBookmarks called with expected data and file path.

# Documentation

- Update README.md under **Bookmark Export**:
  • Describe `--export-bookmarks` and `--export-path` flags.
  • Provide inline examples:
    npm run build-intermediate -- --export-bookmarks
    npm run refresh -- --export-bookmarks --export-path=my-bookmarks.json