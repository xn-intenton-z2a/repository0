# DATE_UTILS

## Overview
Date Utilities (DATE_UTILS) is a new feature module designed to handle date and time operations within the CLI tool. This feature offers basic date formatting, difference calculations, and simple date arithmetic (addition and subtraction of days, months, or years). It seamlessly integrates with the existing CLI architecture and supports both plain text and global JSON output mode.

## CLI Integration
- **Command Flag:** Introduce a new global flag `--date` which routes date utilities commands.
- **Sub-Commands:**
  - **format:** Format a provided date string into a specified output format. Example: `node src/lib/main.js --date format "2023-10-15" "MMM D, YYYY"`.
  - **diff:** Calculate the difference in days between two dates. Example: `node src/lib/main.js --date diff "2023-10-15" "2023-11-01"`.
  - **add:** Add a specified number of days to a given date. Example: `node src/lib/main.js --date add "2023-10-15" 10`.
  - **subtract:** Subtract a specified number of days from a given date. Example: `node src/lib/main.js --date subtract "2023-10-15" 5`.

## Implementation Details
- **Parsing & Validation:**
  - Leverage JavaScript’s built-in `Date` object for parsing input date strings. Validate that the date input is in an acceptable format (e.g., YYYY-MM-DD).
  - Ensure sub-command arguments are correctly provided and numeric inputs (for days to add/subtract) are valid.
- **Operation Logic:**
  - **format:** Use a simple formatting logic (or lightweight date formatting library if necessary) to output dates in the desired format.
  - **diff:** Compute the absolute difference in days between two dates using timestamp comparisons.
  - **add/subtract:** Modify the date by converting it to a timestamp and adding or subtracting the number of milliseconds corresponding to the specified days.
- **Error Handling:**
  - Return clear error messages if the date is invalid, missing, or if the required parameters are not provided.
  - Maintain uniform error messaging and JSON output format in line with existing commands.

## Testing & Documentation
- **Unit Tests:**
  - Add tests to cover valid date inputs and edge cases (e.g., leap years, month boundaries).
  - Validate error conditions when inputs are missing or malformed.
- **Documentation:**
  - Update the README and CLI usage guide with examples for each sub-command.
  - Include inline code comments in the source file detailing the date parsing, arithmetic, and formatting logic.

## Alignment with Repository Mission
The DATE_UTILS feature enriches the repository by extending its utility set to include time-based operations. This addition aligns with the mission of promoting healthy collaboration and streamlined automation through modular, self-contained utilities.
