# DATE_UTILS

## Overview
This feature module handles date and time operations in the CLI tool. In addition to basic date formatting, difference calculation, and simple date arithmetic (addition and subtraction), the module has been enhanced to include timezone conversion. Users can now convert a provided date from one timezone to another using IANA timezone names. This update further empowers the repository by offering comprehensive date utilities in a single, self-contained module.

## CLI Integration
- **Global Flag:** `--date` continues to route all date-related commands.
- **Sub-Commands (Existing):**
  - **format:** Format a provided date string into a specified output format (e.g., `node src/lib/main.js --date format "2023-10-15" "MMM D, YYYY"`).
  - **diff:** Calculate the difference in days between two dates (`node src/lib/main.js --date diff "2023-10-15" "2023-11-01"`).
  - **add/subtract:** Modify the date by adding or subtracting a specified number of days (`node src/lib/main.js --date add "2023-10-15" 10`).
- **New Sub-Command - timezone:**
  - **Usage:** `node src/lib/main.js --date timezone "2023-10-15T12:00:00" "America/New_York" "Europe/London"`
  - **Description:** Converts the input date/time from the source timezone to the target timezone. Appropriate error messages are returned if invalid timezones or date formats are provided.

## Implementation Details
- **Parsing & Validation:**
  - The module leverages JavaScript’s built-in `Date` object and the `Intl.DateTimeFormat` API to parse and format dates. Input validation ensures that the provided date string is in an acceptable format and that the source and target timezone identifiers are valid IANA names.
- **Timezone Conversion Logic:**
  - Convert the date from the source timezone to UTC, then format it into the target timezone.
  - Provide clear error handling for unknown timezones, invalid date formats, or missing parameters.

## Testing & Documentation
- **Unit Tests:**
  - New tests will verify correct conversion across common timezones (e.g., converting from "America/New_York" to "Europe/London").
  - Edge cases such as daylight saving time transitions and invalid timezone inputs are covered.
- **Documentation:**
  - The README and CLI usage guide will be updated with examples for the `timezone` sub-command, including sample inputs and expected outputs.
  - Inline code comments will explain the conversion logic and error handling actions.

## Alignment with Repository Mission
By extending DATE_UTILS to include timezone conversion, this update deepens the repository’s time-handling capabilities. It continues the mission of promoting healthy collaboration and streamlined automation by delivering a self-contained, modular utility that meets real-world user needs without adding unnecessary complexity.