# TIME_SERIES_IO

## Summary

TIME_SERIES_IO specifies a compact feature to read and write time series data in two simple, well-documented formats that are easy to implement and test: CSV with header x,y and a minimal JSON array format. This enables the library and CLI to import and export series for interoperability, reproducible examples, and documentation samples.

## Motivation

The mission requires reading and writing time series in a standard format. Providing small, explicit IO helpers makes it easy to persist series produced by expressions and to load external datasets for plotting and demonstration on the website.

## Behaviour and API

- Library exports (add to src/lib/main.js):
  - seriesToCSV(series: Array<{x:number,y:number}>) -> string
    - Produces a CSV string with header: x,y and one row per point with full precision as JS numbers.
  - csvToSeries(csvText: string) -> Array<{x:number,y:number}>
    - Parses CSV input with header x,y (order tolerant) and returns numeric series; throws descriptive errors on parse failure or missing columns.
  - seriesToJSON(series) -> string
    - Produces a compact JSON string representing an array of objects [ {"x":...,"y":...}, ... ].
  - jsonToSeries(jsonText) -> Array<{x:number,y:number}>
    - Parses the JSON array and validates required numeric fields.
  - saveSeriesFile(series, filename) -> Promise<void>
    - Convenience helper that writes CSV if filename ends with .csv, JSON if .json; rejects on unknown extension.

- Format definitions and constraints:
  - CSV: first line header must contain x and y (case-insensitive); additional columns are ignored. Values parsed with Number and must be finite.
  - JSON: top-level array of objects with x and y numeric properties; additional properties are ignored.
  - Both parsers must be robust to extra whitespace and to CRLF or LF line endings.

## Acceptance Criteria

- The library exposes seriesToCSV, csvToSeries, seriesToJSON, jsonToSeries, and saveSeriesFile.
- CSV output contains a header and rounds-trip parsing: csvToSeries(seriesToCSV(series)) yields an identical numeric series.
- JSON output round-trips similarly.
- saveSeriesFile writes correct content type by extension and rejects unknown extensions with a clear error.
- Unit tests in tests/unit/main.test.js include deterministic assertions for round-trip behaviour and error cases (missing header, non-numeric values).

## Testing and Validation

- Tests to add or extend in tests/unit/main.test.js:
  - io.csvRoundTrip: assert equality of input and parsed series after seriesToCSV -> csvToSeries.
  - io.jsonRoundTrip: assert equality after seriesToJSON -> jsonToSeries.
  - io.saveFileByExtension: use a tmp directory to assert files are written with correct content based on extension and errors for unknown extensions.
  - io.errorCases: invalid CSV header, missing x/y columns, JSON that is not an array.

## Implementation Notes

- Implement helpers in src/lib/main.js using only built-in Node APIs (no new dependencies required).
- Keep IO helpers pure where possible; file-writing helper may use fs.promises but should be encapsulated so unit tests can stub or use a tmp directory.

## Backwards Compatibility

- New helpers are additive and should not change existing behaviour.

## Notes for Contributors

- Keep outputs deterministic and avoid locale-dependent formatting.
- Follow the repository's testing conventions and place tests in tests/unit/main.test.js.
