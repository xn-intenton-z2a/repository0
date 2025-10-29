# BOOKMARK_EXPORT

# Description
Provide a mechanism to persist key CLI outputs and operation summaries into a structured JSON bookmarks file. Users can enable this behavior via CLI flags to export parsed options, intermediate build summaries, enhanced build reports, configuration objects, and merge summaries for downstream automation or inspection.

# Commands and Flags
1. --export-bookmarks   Export collected data (options and operation summaries) to a JSON file
2. --export-path <file> Specify target file path for bookmarks (defaults to bookmarks.json)

# Implementation
1. Extend parseArgs(args) in src/lib/main.js to set:
   - options.exportBookmarks: boolean when --export-bookmarks is present
   - options.exportPath: string capturing the next argument after --export-path
2. Export function exportBookmarks(data, filePath):
   - Serialize data as pretty JSON
   - Write to filePath using fs.writeFileSync
   - Log confirmation: "Bookmarks saved to <filePath>"
3. In main(args):
   - After primary operations (build-intermediate, build-enhanced, refresh, merge-persist):
     * If options.exportBookmarks is true:
       - Assemble bookmarks object with available fields:
         • options
         • intermediateSummary (from performBuildIntermediate)
         • enhancedReport (from performBuildEnhanced)
         • config (from refreshConfiguration)
         • mergeSummary (from mergeAndPersistData)
       - Call exportBookmarks(bookmarks, options.exportPath)
       - Exit process with code 0

# Testing
- Unit tests in tests/unit/main.test.js:
  * parseArgs(["--export-bookmarks","--export-path","out.json"]) sets options.exportBookmarks and options.exportPath correctly
  * Mock fs.writeFileSync to verify exportBookmarks writes expected JSON and logs confirmation
  * Integration test: stub performBuildIntermediate to return summary, run main(["--build-intermediate","--export-bookmarks","--export-path","bm.json"]), assert exportBookmarks called with expected data and path

# Documentation
- Update README.md under **Bookmark Export**:
  • Describe --export-bookmarks and --export-path flags
  • Provide inline examples:
    npm run build-intermediate -- --export-bookmarks
    npm run refresh -- --export-bookmarks --export-path=my-bookmarks.json