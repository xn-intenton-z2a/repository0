# Summary

Extend the plotting CLI to support CSV output format for function data points in addition to the existing JSON output. Introduce a new --output-format (alias -o) option that accepts either "json" or "csv", defaulting to "json".

# Implementation

1. Enhance sandbox/source/main.js to:
   - Parse a new --output-format (alias -o) option via minimist.
   - Validate that the provided format is either "json" or "csv". On invalid values, exit with code 1 and print an error message.
   - After generating the array of points, choose the output serialization:
     - For "json", print the array as JSON to stdout.
     - For "csv", print a header line "x,y" followed by each point as a CSV row (x,y) to stdout.
2. Update sandbox/source/main.js argument parsing block to include the new option with default value.
3. Ensure proper error handling and process exit on invalid format.

# README Updates

- Add a section in the Usage guide describing the new --output-format (-o) option, valid values, and default.
- Provide examples:
  - node sandbox/source/main.js --function sine --from 0 --to 6.28 --step 0.1 --output-format csv
  - npm run start -- --output-format json

# Testing Deliverables

1. In sandbox/tests/main.test.js, add unit tests to verify:
   - Default behavior outputs valid JSON string for points.
   - Using --output-format csv outputs a CSV with header and expected rows for a small range.
   - Providing an unsupported format (e.g., "xml") causes the process to exit with an error and non-zero code.
2. Ensure all tests pass under the new behavior.