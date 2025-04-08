# CONVERSION

## Overview
This feature consolidates the numeral and unit conversion functionalities into a single, unified CLI command. The new command, `--convert`, will support converting numbers between different bases (numeral conversion) as well as converting measurement units in categories such as temperature and distance (unit conversion). This consolidation streamlines the interface of the CLI tool and reinforces the repository’s commitment to modular, single-file utilities for efficient automation.

## Implementation Details
- **Command Integration:**
  - Introduce a new flag `--convert` in the CLI command mapping (in `src/lib/main.js`).
  - The command will operate in two modes, based on the number and type of parameters provided:
    - **Numeral Conversion Mode:**
      - Expects three parameters: a string representing the number, the source base, and the target base.
      - Validate that the provided bases are integers between 2 and 36.
      - Use JavaScript’s built-in methods, e.g. `parseInt(number, sourceBase)` and `toString(targetBase)`, to perform the conversion.
    - **Unit Conversion Mode:**
      - Expects four parameters: a conversion category (e.g., `temp` for temperature or `distance` for length conversions), the source unit, the target unit, and the numeric value.
      - For the **temperature** category, support conversions among Celsius, Fahrenheit, and Kelvin using standard formulas.
      - For the **distance** category, support conversions among meters (m), kilometers (km), and miles (mi) using appropriate conversion factors (e.g., 1 km = 1000 m, 1 mi ≈ 1.60934 km).

- **Input Validation & Error Handling:**
  - Validate the number of parameters and their types according to the selected mode. If the inputs do not meet the expectations (e.g., bases out of range, invalid conversion category, or insufficient parameters), return a standardized error message.
  - Ensure consistency with other CLI commands in terms of error messaging and JSON output (if global flags are set).

## Testing & Documentation
- **Unit Tests:**
  - Extend existing tests or create new tests to cover both modes:
    - Examples:
      - Numeral Conversion: `node src/lib/main.js --convert "1010" 2 10` should output `10`.
      - Temperature Conversion: `node src/lib/main.js --convert temp C F 100` should convert 100°C to Fahrenheit.
      - Distance Conversion: `node src/lib/main.js --convert distance m km 5000` should output `5`.
- **Documentation:**
  - Update the README and CLI usage documentation to include the new unified conversion command with clear examples for each mode.
  - Include inline comments in `src/lib/main.js` where the command is integrated to document the branch logic between numeral and unit conversion.

## Alignment with Repository Mission
By unifying the conversion commands into a single, versatile `--convert` command, this feature enhances the modularity and ease of use of the CLI tool. It ensures that users have a consistent interface for various conversion tasks, which aligns with the repository's mission of promoting streamlined, self-contained utilities that foster healthy collaboration and practical automation.