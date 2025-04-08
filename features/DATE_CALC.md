# DATE_CALC

## Overview
This feature introduces a new CLI command `--date` that performs simple date arithmetic directly from the terminal. The command supports common use cases such as computing the difference between two dates and adding a specified number of days to a given date. This utility complements the existing arithmetic and conversion functionalities by addressing date and time manipulation, thereby broadening the tool’s practical applications in diagnostics and automation.

## Implementation Details
- **Command Integration:**
  - Add a new flag `--date` to the CLI command mapping in `src/lib/main.js`.
  - The command should accept parameters in one of the following modes:
    - **Date Difference Mode:** When provided with two date strings (in ISO format or recognized standard formats), the command computes and returns the difference in days (with an option to output hours/minutes if needed in future iterations).
    - **Date Addition Mode:** When provided with a valid date string followed by a numeric value, the command adds the specified number of days to the given date and outputs the resulting date.

- **Input Parsing & Validation:**
  - Validate that the date strings conform to accepted formats using JavaScript’s built-in `Date` constructor or a lightweight date parsing library.
  - For date addition mode, ensure the second parameter is a valid integer representing the number of days to add or subtract (negative values may be supported for subtraction).
  - Return a standardized error message such as "Error: Invalid date input provided." if the parsing fails or if the wrong number/type of arguments is supplied.

- **Logic & Computation:**
  - **Date Difference Mode:** Parse both dates and compute the absolute difference in days.
  - **Date Addition Mode:** Parse the input date, add the specified number of days, and format the result as an ISO string.

- **Error Handling & Warnings:**
  - Consistently return an error (e.g., "Error: No valid date inputs provided.") when inputs are missing or invalid.
  - Maintain similar error message protocols as the existing arithmetic commands.

## Testing & Documentation
- **Unit Tests:**
  - Create tests to cover both date difference and date addition functionalities with valid date inputs.
  - Include tests for edge cases such as invalid date formats, missing parameters, and non-numeric day values.
  - Verify that error messages are standardized and informative.

- **Documentation:**
  - Update the CLI usage documentation and README with examples, for instance:
    - Date Difference: `node src/lib/main.js --date 2023-10-01 2023-10-15`
    - Date Addition: `node src/lib/main.js --date 2023-10-01 10`
  - Include inline comments in `src/lib/main.js` where the new command is integrated to explain the logic and validation steps.

## Alignment with Repository Mission
This feature adheres to the repository’s mission by offering a modular, self-contained CLI utility that enhances automation workflows through practical date manipulations. By integrating date arithmetic capabilities, the CLI tool becomes more versatile and better suited for real-world diagnostics and scheduling tasks.