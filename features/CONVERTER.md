# Overview
This feature merges numeral, unit, and date conversion operations into a single unified CLI command. The new command, `--convert`, now supports converting between numeral bases, measurement units (such as temperature and distance), and performing basic date arithmetic (date difference and date addition). This consolidation streamlines the tool’s interface and reinforces the repository’s commitment to modular, practical automation.

# CLI Integration
- **Flag Addition:** Introduce a new flag `--convert` in the CLI command mapping.
- **Modes of Operation:**
  - **Numeral Conversion Mode:** Expects three parameters: a string representing the number, the source base, and the target base. Validates that provided bases are integers between 2 and 36, and uses built-in parsing methods.
  - **Unit Conversion Mode:** Expects four parameters: a conversion category (e.g., `temp` or `distance`), the source unit, the target unit, and the numeric value. For temperature, conversions among Celsius, Fahrenheit, and Kelvin are supported. For distance, conversions between meters, kilometers, and miles are implemented.
  - **Date Conversion Mode:** Supports two sub-modes:
    - **Date Difference Mode:** When provided with two date strings (in ISO or standard formats), computes and returns the difference in days.
    - **Date Addition Mode:** When provided with a valid date string followed by a numeric value, adds (or subtracts if negative) the specified number of days to/from the date, outputting the resulting date in ISO format.

# Implementation Details
- **Input Parsing & Validation:** 
  - For numeral conversion, the command verifies that the source and target bases are within the valid range.
  - For unit conversion, the command validates the conversion category and correct number of parameters. Standard conversion formulas (e.g., temperature formulas, and distance conversion factors) are applied.
  - For date operations, the command uses JavaScript’s built-in Date parsing methods to validate date strings. It computes time differences or adds days using appropriate Date arithmetic.
- **Dynamic Mode Selection:** The module examines the number and type of parameters to determine which conversion mode to execute and calls the corresponding logic.

# Error Handling & Validation
- For each mode, if the inputs are missing or invalid (e.g., invalid base, improperly formatted date, or incorrectly specified conversion category), a clear standardized error message is output.
- The command behavior remains consistent with other CLI commands in terms of JSON output mode and error reporting.

# Testing & Documentation
- **Unit Tests:** Tests will cover all three modes:
  - Numeral Conversion (e.g., converting "1010" from base 2 to 10).
  - Unit Conversion (e.g., converting 100°C to Fahrenheit, or 5000 meters to kilometers).
  - Date Conversion (e.g., date difference between "2023-10-01" and "2023-10-15", and adding 10 days to a given date).
- **Documentation:** The README and CLI usage guides will be updated with examples showing the usage for numeral, unit, and date conversion.

# Alignment with Repository Mission
By merging numeric, unit, and date conversion functionalities into a single utility, the CONVERTER feature enhances the tool’s modularity and ease of use. It reduces redundancy and supports streamlined automation workflows, in line with the repository’s mission of promoting healthy collaboration and practical, self-contained CLI utilities.