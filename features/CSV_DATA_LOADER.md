# CSV Time Series Data Loader

Load time series data from CSV files with time,value columns for plotting.

## File Format

Support CSV files with header row containing "time,value" columns. Parse numeric values from both columns. Handle different time formats (timestamps, sequential numbers, dates).

## Data Validation

Validate CSV structure has exactly two columns. Check all data rows contain numeric values that can be parsed. Skip rows with invalid data and report count of skipped rows.

## API Design

```javascript
export function loadCSV(filePath) {
  // Returns array of { x: time, y: value } objects
}

export function parseCSVString(csvContent) {
  // Returns array of { x: time, y: value } objects
}
```

## File I/O Requirements

Use Node.js fs module for file reading when running in CLI mode. Support both synchronous and asynchronous file loading. Handle file not found and permission errors gracefully.

## Acceptance Criteria

- Read CSV files with time,value columns
- Parse numeric data from both columns
- Return data in same format as range evaluation
- Handle missing files with descriptive errors
- Skip malformed rows and continue processing
- Support various numeric formats (integers, floats, scientific notation)
- Work in both Node.js CLI and browser environments