# UNIT_CONVERSION Enhancement

This update extends the existing UNIT_CONVERSION feature beyond temperature conversions. In addition to Celsius, Fahrenheit, and Kelvin conversions, this enhancement introduces support for distance conversions (and leaves room for future categories).

## Overview

- **Purpose:** Enhance the CLI's unit conversion capabilities by supporting multiple types of conversions within a single command. In addition to temperature (C, F, K), users can now convert distances between meters (m), kilometers (km), and miles (mi).
- **Scope:** The feature will implement a unified CLI command (e.g., `--convert`) with a conversion category argument. For the temperature category, the existing formulas remain intact. For the new distance category:
  - **Meters to Kilometers:** km = m / 1000
  - **Meters to Miles:** mi = m / 1609.34
  - **Kilometers to Meters:** m = km * 1000
  - **Kilometers to Miles:** mi = km / 1.60934
  - **Miles to Meters:** m = mi * 1609.34
  - **Miles to Kilometers:** km = mi * 1.60934
- **Alignment:** This enhancement builds on the repository’s mission by providing practical utility functions in a single source file. It adheres to the principles outlined in CONTRIBUTING.md by being self-contained and testable.

## Implementation Details

- **Command Syntax:**
  - The command is invoked using `--convert` followed by the conversion category, the source unit, the target unit, and the numeric value.
  - Example for temperature: `node src/lib/main.js --convert temp C F 100`
  - Example for distance: `node src/lib/main.js --convert distance m km 5000`

- **Conversion Logic:**
  - **Temperature Conversions:** Use the existing formulas (e.g., Celsius to Fahrenheit: F = (C × 9/5) + 32)
  - **Distance Conversions:** Utilize the defined formulas to convert between meters, kilometers, and miles. Implement error checking to ensure valid unit abbreviations are provided.

- **Input Validation:**
  - Ensure the command receives exactly four parameters following `--convert`: a conversion category (e.g., `temp` or `distance`), a source unit, a target unit, and a numeric value.
  - Validate that the source and target units are part of the supported abbreviations for the given category.
  - Provide clear error messages if the input does not meet specifications.

- **Error Handling:**
  - Consistently reject invalid numeric inputs or unsupported conversion types with error messages similar to other commands (e.g., "Error: No valid numeric inputs provided.").
  - For unknown conversion categories, output a message indicating that the category is not supported.

## Testing & Documentation

- **Unit Tests:**
  - Create tests to verify correct conversions for both temperature and distance. 
  - Include tests with valid numeric inputs as well as tests for erroneous input cases.
  - Validate that correct error messages are returned for invalid source/target units or missing inputs.

- **Documentation:**
  - Update the README and CLI usage documentation to include examples for both temperature and distance conversions.
  - Add inline code comments in the source file to explain the extended logic for handling multiple conversion categories.

This enhancement maintains the single-file library approach while significantly broadening the practical utility of the conversion feature within the repository.
