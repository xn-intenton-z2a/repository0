# BOOKMARK_EXPORT

# Description
Provide a mechanism to persist key CLI outputs and operation summaries into a structured JSON bookmarks file. Users can enable this behavior via CLI flags to export parsed options, intermediate build summaries, enhanced build reports, configuration objects, and merge summaries for downstream automation or inspection.

# Commands and Flags
1. **--export-bookmarks**  
   When provided, collect available CLI outputs and operation results and write them to a JSON file.
2. **--export-path <file>**  
   Specify the output bookmarks file path; defaults to `bookmarks.json` in the working directory.

# Implementation
- Extend `parseArgs(args)` in `src/lib/main.js` to detect:
  • `options.exportBookmarks` when `--export-bookmarks` is present.  
  • `options.exportPath` to capture the following argument as the target file path.
- Export a function `exportBookmarks(data, filePath)` that:
  1. Serializes `data` to pretty JSON.  
  2. Writes it to `filePath` using `fs.writeFileSync`.  
  3. Logs a confirmation message: `Bookmarks saved to <filePath>`.
- In `main(args)`, after performing any primary operations (build, refresh, or merge):
  • If `options.exportBookmarks` is true:
    - Gather a `bookmarks` object containing:
      • `options`: parsed flags object  
      • `intermediateSummary`: result of `performBuildIntermediate` if run  
      • `enhancedReport`: result of `performBuildEnhanced` if run  
      • `config`: result of `refreshConfiguration` if run  
      • `mergeSummary`: result of `mergeAndPersistData` if run
    - Call `exportBookmarks(bookmarks, options.exportPath)` and exit with code 0.

# Testing
- Unit tests in `tests/unit/main.test.js`:
  • `parseArgs(['--export-bookmarks','--export-path','out.json'])` sets flags correctly.  
  • Mock `fs.writeFileSync` to verify `exportBookmarks` writes the expected JSON and logs confirmation.  
  • Integration test: stub `performBuildIntermediate`, call `main(['--build-intermediate','--export-bookmarks','--export-path','bm.json'])`, and assert `exportBookmarks` is invoked with the expected data and path.

# Documentation
- Update `README.md` under a **Bookmark Export** section:
  • Describe `--export-bookmarks` and `--export-path` flags.  
  • Provide inline examples:
    npm run build-intermediate -- --export-bookmarks  
    npm run refresh -- --export-bookmarks --export-path=my-bookmarks.json