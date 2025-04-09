# CONVERSION

## Overview
This feature merges the numeral base conversion and measurement unit conversion utilities into one cohesive module. The unified CONVERSION feature provides two distinct submodules:

- **Base Conversion:** Convert numeric values between different numeral systems (e.g., binary, octal, decimal, hexadecimal).
- **Unit Conversion:** Convert measurements between common units (e.g., length, weight, temperature, volume).

By consolidating these two functions into a single feature, the repository streamlines its conversion utilities while maintaining clarity and simplicity.

## CLI Integration
- **Global Command Flag:** `--convert`
- **Sub-Commands:**
  - **base:** For numeral base conversion. 
    - Usage Examples:
      - `node src/lib/main.js --convert base to 1010 2 10` converts binary 1010 to decimal.
      - `node src/lib/main.js --convert base from A 16` converts hexadecimal A to decimal.
  - **unit:** For measurement conversions.
    - Usage Examples:
      - `node src/lib/main.js --convert unit length 10 inch cm`
      - `node src/lib/main.js --convert unit temperature 32 F C`

## Implementation Details
- **Input Parsing & Validation:**
  - For **base conversion**, the module will validate the provided number strings against the specified source base and then convert to the target base using built-in JavaScript number parsing functions.
  - For **unit conversion**, the module uses predefined conversion factors and formulas (including temperature conversion formulas) to convert between supported units.
- **Operation Logic:**
  - The conversion module distinguishes the sub-command (`base` or `unit`) and processes the input accordingly.
  - Both submodules will support output modes: standard text for human-readable results and JSON mode (via `--json` or `--json-pretty`) for machine-readability with extra metadata (timestamp, version, execution duration, input echo).
- **Error Handling & Validation:**
  - Return clear error messages if input values are invalid, missing, or if operations are not supported for the given units/bases.
  - Ensure that for both numeral and measurement conversions, boundary conditions (e.g., division by zero in conversion formulas) are checked.

## Testing & Documentation
- **Unit Tests:** Create separate tests covering valid numeral base conversions and measurement unit conversions. The tests cover correct results, boundary conditions, and error cases for each conversion type.
- **Documentation:** Update README and CLI usage guides with detailed examples for both types of conversions. Include inline comments to explain conversion formulas and validation logic.

## Alignment with Repository Mission
By merging two similar conversion utilities into a single, self-contained module, the CONVERSION feature supports streamlined automation and healthy collaboration. It simplifies the toolset while enriching the repository’s suite of modular CLI utilities.
