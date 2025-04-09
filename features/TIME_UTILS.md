# TIME_UTILS

## Overview
This feature introduces a set of time and date utilities to the CLI tool. It provides commands to obtain and manipulate timestamps, format dates, and calculate the duration or difference between times. These utilities will be especially useful for automation tasks, logging enhancements, and scheduling-related operations, supporting the repository’s mission of streamlining modular CLI functionalities for everyday use.

## CLI Integration
- **Command Flag:** Introduce a new flag `--time` to invoke time utilities.
- **Sub-Commands:** The following sub-commands should be supported:
  - **now:** Returns the current timestamp in ISO 8601 format.
  - **format:** Accepts a timestamp and a formatting string. For example, `--time format "2023-10-07T12:00:00Z" "YYYY-MM-DD HH:mm:ss"` outputs the formatted date.
  - **diff:** Accepts two timestamps and calculates the difference between them in a human-readable format (e.g., hours, minutes, seconds).
  - **add:** Allows adding a duration (e.g., "2h30m") to a given timestamp, returning the new timestamp.
  - **subtract:** Similar to add, but subtracts a duration from the given timestamp.

## Implementation Details
- **Time Handling:** Utilizes JavaScript's native Date object and may optionally leverage lightweight libraries (if needed) for formatting and duration parsing, ensuring that the implementation remains within a single source file.
- **Input Validation:** Ensures that provided timestamps are in valid ISO format and that durations follow an accepted pattern (e.g., using regex for hours, minutes, seconds).
- **Error Handling:** Returns clear error messages for invalid inputs or unsupported formats.

## Testing & Documentation
- **Unit Tests:** Add tests to cover each sub-command, ensuring correct output and robust error handling. For example, tests should verify that:
  - The `now` command returns a valid ISO timestamp.
  - The `format` command transforms the timestamp correctly given a valid format string.
  - The `diff` command accurately calculates the difference between two timestamps.
  - The `add` and `subtract` commands perform correct arithmetic on the given timestamps.
- **Documentation:** Update the README and CLI usage guides with examples, such as:
  - `node src/lib/main.js --time now`
  - `node src/lib/main.js --time format "2023-10-07T12:00:00Z" "YYYY-MM-DD HH:mm:ss"`
  - `node src/lib/main.js --time diff "2023-10-07T10:00:00Z" "2023-10-07T12:30:00Z"`
  - `node src/lib/main.js --time add "2023-10-07T12:00:00Z" "1h15m"`

## Alignment with Repository Mission
Incorporating TIME_UTILS extends the CLI tool’s capabilities by addressing the common need for time-based data processing. It offers practical functions for date manipulation and scheduling, which enhances the overall utility of the tool in automated workflows and supports the repository’s mission of fostering healthy collaboration through modular, self-contained CLI utilities.