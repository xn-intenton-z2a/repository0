# CSV_TIME_SERIES

Overview

Load time series data from a CSV file containing columns time,value and return a normalized array of data points suitable for plotting.

Description

The CSV loader accepts CSV input with a header line containing time and value columns. The time column may be ISO-8601 timestamps or numeric epoch values; the loader normalizes times to JavaScript Date objects or numeric milliseconds (choose one consistent internal representation and document it). Values are parsed as floating-point numbers. The loader must ignore empty lines and trim whitespace.

Acceptance Criteria

- A named export loadCsvTimeSeries (or loadCSV) is added to src/lib/main.js.
- loadCsvTimeSeries given a CSV string with header time,value returns an array of objects with properties time and value where value is a number and time is either a Date or numeric timestamp (document which) across the API.
- Malformed rows (non-numeric value, invalid time) are rejected or skipped according to documented behaviour; tests must cover the chosen behaviour.

Implementation Notes

- Provide unit tests that supply a small CSV string and assert the parsed array contents and types.
- Expose the loader so the CLI can call it when --csv is provided.

Out of Scope

- Streaming extremely large CSVs; the initial implementation may read the whole file into memory for simplicity.