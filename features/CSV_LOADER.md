# CSV_LOADER

Summary

Status: Implemented (closed issue #3022)

Implement a lightweight CSV loader that reads a file with columns time,value and returns a numeric time series ready for plotting.

Rationale

Many users will supply recorded time series as CSV; a simple loader avoids forcing external CSV libraries and keeps the CLI usable in CI environments.

Scope

- Add a named export loadCSV in src/lib/main.js that accepts a file path and returns an array of {time, value} with both fields parsed as numbers.
- Support CSV files with a header row that includes time and value and simple comma separation.

Files to change

- src/lib/main.js (add loadCSV export)
- tests/unit/csv.test.js (unit tests)

Acceptance Criteria

- loadCSV exported and callable.
- Given a CSV file with header and three data rows, loadCSV returns an array of three objects with numeric time and value fields.
- Loader normalises numeric strings to numbers and throws a clear error for lines that cannot be parsed.

Implementation notes

- Implement a minimal, dependency-free parser using fs.readFile and simple split logic. Document limits (no quoted fields, no embedded commas) in README.
- If CSV requirements grow, the project can adopt a vetted CSV parser later; for now keep the loader small and testable.
