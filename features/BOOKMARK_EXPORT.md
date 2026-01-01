# BOOKMARK_EXPORT

# Description
Provide a mechanism to persist key CLI outputs and operation summaries into a structured JSON bookmarks file. Users can enable this behavior via CLI flags to export parsed options, intermediate build summaries, enhanced build reports, configuration objects, and merge summaries for downstream automation or inspection.

# Commands and Flags
1. --export-bookmarks   Export collected data (options and operation summaries) to a JSON file
2. --export-path <file> Specify target bookmarks file path (defaults to bookmarks.json)

# Implementation
- Extend parseArgs(args) in src/lib/main.js to detect:
  * options.exportBookmarks when --export-bookmarks is present
  * options.exportPath capturing the next argument as output file path
- Export a function exportBookmarks(data, filePath) that:
  1. Serializes data as pretty JSON
  2. Writes it to filePath via fs.writeFileSync
  3. Logs confirmation: Bookmarks saved to <filePath>
- In main(args), after performing primary operations (build-intermediate, build-enhanced, refresh, merge-persist):
  * If options.exportBookmarks is true:
    - Gather bookmarks object containing available data:
      • options
      • intermediateSummary
      • enhancedReport
      • config
      • mergeSummary
    - Call exportBookmarks(bookmarks, options.exportPath)
    - Exit with code 0

# Testing
- Unit tests in tests/unit/main.test.js:
  * parseArgs(["--export-bookmarks","--export-path","out.json"]) sets flags correctly
  * Mock fs.writeFileSync to verify exportBookmarks writes correct JSON and logs confirmation
  * Integration test: stub performBuildIntermediate, run main(["--build-intermediate","--export-bookmarks","--export-path","bm.json"]), assert exportBookmarks called with expected data and path

# Documentation
- Update README.md under **Bookmark Export**:
  * Describe --export-bookmarks and --export-path flags
  * Provide inline examples:
    npm run build-intermediate -- --export-bookmarks
    npm run refresh -- --export-bookmarks --export-path=my-bookmarks.json