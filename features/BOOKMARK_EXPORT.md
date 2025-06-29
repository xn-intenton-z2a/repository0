# BOOKMARK_EXPORT

# Description
Add a new CLI feature that exports parsed options and build artifacts summary into a JSON bookmarks file for later inspection and automation. This feature helps users persist key outputs (CLI options, build intermediate and enhanced paths) into a standardized file for integration with external tools or pipelines.

# Commands and Flags
1. --export-bookmarks   Export bookmarks to a JSON file
2. --export-path <file> Specify the target bookmarks file path (defaults to bookmarks.json)
3. Works alongside existing flags: serve, build-intermediate, build-enhanced, refresh, merge-persist

# Implementation
- In src/lib/main.js:
  - Extend parseArgs to detect --export-bookmarks and --export-path flags, adding options.exportBookmarks and options.exportPath properties.
  - Export a function exportBookmarks(data, filePath) that:
    1. Accepts an object containing options, intermediate summary, enhanced report, and config or merge data.
    2. Writes the object as JSON to the specified filePath.
    3. Logs a confirmation message.
  - In main(), after primary operations (build, refresh, merge) complete,
    * If options.exportBookmarks is true, gather relevant data:
      - options object
      - intermediate build summary (if available)
      - enhanced build report (if available)
      - config object (if refresh)
      - merge summary (if merge-persist)
    * Call exportBookmarks with collected data and options.exportPath.
    * Exit with code 0.

# Testing
- In tests/unit/main.test.js:
  * Add tests for parseArgs(['--export-bookmarks', '--export-path', 'out.json']) to assert correct flags.
  * Mock fs.writeFileSync to test exportBookmarks writes correct JSON.
  * Integration test: simulate main(['--build-intermediate','--export-bookmarks','--export-path','bm.json']), mock buildIntermediate, verify exportBookmarks called with expected data.

# Documentation
- Update README.md under **Bookmark Export**:
  * Describe --export-bookmarks and --export-path flags.
  * Provide inline examples:
    npm run start --build-intermediate --export-bookmarks
    npm run start --refresh --export-bookmarks --export-path=my-bookmarks.json
