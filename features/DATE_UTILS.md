# DATE_UTILS

## Overview
This feature module handles date and time operations in the CLI tool. In addition to basic date formatting, difference calculation, and simple date arithmetic (addition and subtraction), the module has been enhanced to include timezone conversion. In this update, a new sub-command has been added to compute the weekday for a given date, thereby extending the date utilities without adding unnecessary complexity.

## CLI Integration
- **Global Flag:** `--date` continues to route all date-related commands.
- **Existing Sub-Commands:**
  - **format:** Format a provided date string into a specified output format.
  - **diff:** Calculate the difference in days between two dates.
  - **add/subtract:** Modify the date by adding or subtracting a specified number of days.
  - **timezone:** Converts the input date/time from a source timezone to a target timezone.

- **New Sub-Command - weekday:**
  - **Usage:** `node src/lib/main.js --date weekday "2023-10-15"`
  - **Description:** This command computes and returns the day of the week (e.g., Monday, Tuesday, etc.) for the provided date string. It leverages the JavaScript Date object to parse the date and extract the weekday information.

## Implementation Details
- **Parsing & Validation:**
  - The module validates the provided date string ensuring it is in an acceptable format.
  - If the input is invalid, a clear error message is returned, consistent with other date sub-commands.

- **Weekday Calculation Logic:**
  - The command parses the date string using built-in Date functions.
  - It then uses methods such as `getDay()` in combination with a predefined array of weekday names to determine the corresponding weekday.

- **Error Handling:**
  - If the date format is invalid or the date cannot be parsed, the command returns an appropriate error message in both plain text and JSON output modes.
  - The feature honors the global JSON output mode, which includes metadata such as timestamp, tool version, execution duration, and input echo.

## Testing & Documentation
- **Unit Tests:**
  - New tests will verify that the weekday sub-command returns the correct weekday for a variety of valid date inputs.
  - Edge cases, such as invalid date strings or ambiguous inputs, will be tested to guarantee robust error handling.

- **Documentation:**
  - The README and CLI usage guides will be updated to include examples for the new `--date weekday` command.
  - Inline comments within the source code provide clarity on the date parsing logic and the mapping from numerical day indices to weekday names.

## Alignment with Repository Mission
By extending DATE_UTILS with a new weekday sub-command, this update enhances the repository’s time-handling capabilities while maintaining the focus on self-contained, modular utilities. It supports the mission of promoting healthy collaboration through precise and user-friendly CLI tools, delivering meaningful automation without added complexity.