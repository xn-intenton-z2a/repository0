# UNIT_CONVERSION

## Overview
This feature introduces a new CLI command `--convert` that provides a collection of unit conversion utilities. It supports converting different measurement units such as length, weight, and temperature. The command accepts conversion requests in the format: `[value] [source_unit] to [target_unit]` and returns the converted value.

## CLI Integration
- **Command Flag:** A new flag `--convert` will be added to the CLI command mapping.
- **Input Format:** The command expects a numeric value followed by the source unit, the keyword "to", and the target unit. Examples:
  - `node src/lib/main.js --convert 10 km to mi`
  - `node src/lib/main.js --convert 100 F to C`
- **Supported Conversions:**
  - **Length:** kilometers (km), miles (mi), meters (m), feet (ft)
  - **Weight:** kilograms (kg), pounds (lb)
  - **Temperature:** Celsius (C), Fahrenheit (F), Kelvin (K)
- **Implementation Details:**
  - Parse the input parameters to extract the numeric value, source unit, and target unit.
  - Match the source and target units to ensure they belong to the same category (e.g., length-to-length, temperature-to-temperature).
  - Use predefined conversion factors and formulas to compute the converted value. For example:
    - Length: 1 km ≈ 0.621371 mi
    - Temperature: Converting F to C: (F - 32) * 5/9
  - Provide error handling for missing parameters, invalid unit names, non-numeric values, and incompatible unit categories.

## Error Handling & Validation
- Return clear, standardized error messages for:
  - Missing or incomplete conversion input.
  - Non-numeric values where a number is expected.
  - Incompatible conversion requests (e.g., converting weight to length).
- Validate that the conversion formula exists for the provided units before proceeding.

## Testing & Documentation
- **Unit Tests:**
  - Verify correct conversions for all supported unit pairs (e.g., km to mi, F to C, kg to lb).
  - Test edge cases and error conditions, such as unsupported conversions and invalid inputs.
- **Documentation:**
  - Update the README with usage examples and a list of supported conversion categories and units.
  - Include inline code comments and documentation to explain conversion formulas and input parsing logic.

## Alignment with Repository Mission
The UNIT_CONVERSION feature enhances the CLI tool by adding practical utility for everyday tasks. It aligns with the repository’s mission by promoting healthy collaboration and automation through modular and self-contained utilities that are achievable within a single repository.
