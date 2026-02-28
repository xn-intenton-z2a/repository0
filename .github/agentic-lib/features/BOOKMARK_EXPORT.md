# BOOKMARK_EXPORT

# Description
Provide a mechanism to persist key CLI outputs and operation summaries into a structured JSON bookmarks file for downstream automation and inspection.

# Commands and Flags
1. --export-bookmarks   Export collected data (CLI options and operation summaries) to a JSON file
2. --export-path <file> Specify the target bookmarks file path (defaults to bookmarks.json)

# Implementation
- In `src/lib/main.js`:
  1. Extend `parseArgs(args)` to detect:
     - `options.exportBookmarks` when `--export-bookmarks` is present
     - `options.exportPath` capturing the next argument as the target file path
  2. Export function `exportBookmarks(data, filePath)` that:
     - Serializes `data` to pretty JSON
     - Writes to `filePath` using `fs.writeFileSync`
     - Logs confirmation: `Bookmarks saved to <filePath>`
  3. In `main(args)`, after primary operations (build-intermediate, build-enhanced, refresh, merge-persist):
     - If `options.exportBookmarks` is true:
       * Assemble a `bookmarks` object with fields:
         - `options`: parsed flags object
         - `intermediateSummary`: result of `performBuildIntermediate` if run
         - `enhancedReport`: result of `performBuildEnhanced` if run
         - `config`: result of `refreshConfiguration` if run
         - `mergeSummary`: result of `mergeAndPersistData` if run
       * Call `exportBookmarks(bookmarks, options.exportPath)` and exit(0)

# Testing
- In `tests/unit/main.test.js`:
  * Unit test for `parseArgs(['--export-bookmarks','--export-path','out.json'])` sets flags correctly
  * Mock `fs.writeFileSync` and spy on `console.log` to verify `exportBookmarks` writes expected JSON and logs confirmation
  * Integration test: stub `performBuildIntermediate`, run `main(['--build-intermediate','--export-bookmarks','--export-path','bm.json'])`, assert `exportBookmarks` called with expected data and path

# Documentation
- Update `README.md` under **Bookmark Export**:
  * Describe `--export-bookmarks` and `--export-path` flags
  * Provide inline examples:
    npm run build-intermediate -- --export-bookmarks
    npm run refresh -- --export-bookmarks --export-path=my-bookmarks.json