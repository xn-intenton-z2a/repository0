# BOOKMARK_EXPORT

# Description
Provide a mechanism to persist key CLI outputs and operation summaries into a structured JSON bookmarks file. Users can enable this behavior via CLI flags to export parsed options, intermediate build summaries, enhanced build reports, configuration objects, and merge summaries for downstream automation or inspection.

# Commands and Flags
1. --export-bookmarks
   When provided, collects available CLI outputs and operation results and writes them to a JSON file.
2. --export-path <file>
   Specify the output bookmarks file path; defaults to `bookmarks.json` in the working directory.

# Implementation
- Extend `parseArgs(args)` to detect:
  • `options.exportBookmarks` when `--export-bookmarks` is present.
  • `options.exportPath` to capture the following argument as target file path.
- Export function `exportBookmarks(data, filePath)`:
  1. Serialize `data` to pretty JSON.
  2. Write to `filePath` using `fs.writeFileSync`.
  3. Log a confirmation: `Bookmarks saved to <filePath>`.
- In `main(args)`, after primary operations (build-intermediate, build-enhanced, refresh, merge-persist):
  • If `options.exportBookmarks` is true:
    - Gather a `bookmarks` object with keys:
      • `options`: parsed flags object
      • `intermediateSummary`: result of `performBuildIntermediate` if run
      • `enhancedReport`: result of `performBuildEnhanced` if run
      • `config`: result of `refreshConfiguration` if run
      • `mergeSummary`: result of `mergeAndPersistData` if run
    - Call `exportBookmarks(bookmarks, options.exportPath)`
    - Exit with status code 0.

# Testing
- In `tests/unit/main.test.js`:
  • Test `parseArgs(['--export-bookmarks','--export-path','out.json'])` yields correct flags.
  • Mock `fs.writeFileSync` to verify `exportBookmarks` writes correct JSON and logs confirmation.
  • Integration test: stub `performBuildIntermediate`, run `main(['--build-intermediate','--export-bookmarks','--export-path','bm.json'])`, assert `exportBookmarks` is called with expected data and `bm.json`.

# Documentation
- Update `README.md` under **Bookmark Export** section:
  • Describe `--export-bookmarks` and `--export-path` flags.
  • Provide inline examples:
    npm run start -- --build-intermediate --export-bookmarks
    npm run start -- --refresh --export-bookmarks --export-path=my-bookmarks.json