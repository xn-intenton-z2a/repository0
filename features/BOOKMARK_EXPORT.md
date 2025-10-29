# BOOKMARK_EXPORT

# Description
Add a new CLI feature to export key operation results and parsed options into a JSON bookmarks file. This utility helps users persist outputs such as CLI flags, intermediate build summaries, enhanced build reports, configuration objects, and merge summaries for later inspection or integration into automation workflows.

# Commands and Flags
1. --export-bookmarks
   When present, triggers the export of collected data into a bookmarks file.
2. --export-path <file>
   Specify the target file path for bookmarks; defaults to bookmarks.json in the working directory.

# Implementation
- Extend `parseArgs(args)` in `src/lib/main.js` to detect:
  • `options.exportBookmarks` when `--export-bookmarks` is provided.
  • `options.exportPath` capturing the next argument as the output path.
- Export a function `exportBookmarks(data, filePath)`:
  1. Accept a `data` object containing fields: options, intermediateSummary, enhancedReport, config, mergeSummary.
  2. Serialize `data` as pretty JSON and write to `filePath` via `fs.writeFileSync`.
  3. Log confirmation: "Bookmarks saved to <filePath>".
- In `main(args)`, after primary operation functions run:
  • If `options.exportBookmarks` is true:
    - Assemble a `bookmarks` object with present results.
    - Call `exportBookmarks(bookmarks, options.exportPath)`.
    - Exit process with code 0.

# Testing
- In `tests/unit/main.test.js`:
  • Unit test for `parseArgs(['--export-bookmarks','--export-path','out.json'])` to confirm flags are set.
  • Mock `fs.writeFileSync` and spy on `console.log` to test `exportBookmarks` writes correct JSON and logs confirmation.
  • Integration test: stub `performBuildIntermediate` to return a summary, run `main(['--build-intermediate','--export-bookmarks','--export-path','bm.json'])`, and assert `exportBookmarks` called with expected data and path.

# Documentation
- Update `README.md` under **Bookmark Export**:
  • Describe the flags `--export-bookmarks` and `--export-path`.
  • Provide inline examples:
    npm run build-intermediate -- --export-bookmarks
    npm run refresh -- --export-bookmarks --export-path=my-bookmarks.json