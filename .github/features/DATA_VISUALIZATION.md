# DATA_VISUALIZATION

# Description
Enable the CLI to generate a simple summary report of intermediate and enhanced build artifacts, configuration, and merge outputs as a formatted table in the console. This report helps users quickly inspect results without opening JSON files.

# Report Contents
1. Build Intermediate Summary
   - items: number of entries
   - path: location of the manifest file
2. Enhanced Build Report
   - transformed: boolean
   - path: location of the enhanced file
3. Configuration Validation
   - inputPath, outputPath, timeout, enableFeatureX values
4. Merge Persist Summary
   - path: output file path
   - size: bytes of persisted file

# Implementation
- In `src/lib/main.js`:
  1. After primary operations complete, if both intermediate and enhanced results, config, and merge exist, call `printReport(data)`.
  2. Export function `printReport({ intermediate, enhanced, config, merge })` that:
     - Formats each section into rows with headings.
     - Uses `console.table` or aligned columns to display keys and values.
     - Returns nothing.
- Modify `main(args)` to:
  - Collect available outputs in an object.
  - If `options.report` flag is set, invoke `printReport(data)` before exiting.

# Testing
- In `tests/unit/main.test.js`:
  1. Unit tests for `printReport()`:
     - Provide a fixture object with sample intermediate, enhanced, config, and merge data.
     - Spy on `console.table` or check logged output lines.
  2. Integration test: call `main(['--build-intermediate','--build-enhanced','--refresh','--merge-persist','--report'])` with stubs for operations, and assert `printReport` is invoked.

# Documentation
- Update `README.md` under **Data Visualization**:
  - Describe the `--report` flag.
  - Provide inline example:
    npm run start -- --build-intermediate --build-enhanced --refresh --merge-persist --report
    → Displays a summary table with build, config, and merge details
