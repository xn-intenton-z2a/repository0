# UNIT_CONVERSION Feature

This feature introduces a new CLI command `--convert` to perform unit conversions, starting with temperature conversions between Celsius, Fahrenheit, and Kelvin. The goal is to extend the repository’s arithmetic and statistical capabilities with practical conversion utilities, aligned with the mission of offering a robust template for automation and development workflows.

## Overview

- **Purpose:** Allow users to convert temperature values between Celsius (C), Fahrenheit (F), and Kelvin (K) using a simple CLI command.
- **Scope:** Initially supports temperature conversion with clear error messages and guidance on correct input usage. Future expansions could include other unit categories (e.g., distance, weight).
- **Alignment:** Supports the repository’s mission by providing additional utility through a lightweight, single-file library feature.

## Implementation Details

- **Command Syntax:**
  - The command is invoked using `--convert` followed by the type of conversion and numeric value(s).
  - Example: `node src/lib/main.js --convert temp C F 100` would convert 100 degrees Celsius to Fahrenheit.

- **Temperature Conversion Logic:**
  - **Celsius to Fahrenheit:** F = (C × 9/5) + 32
  - **Celsius to Kelvin:** K = C + 273.15
  - **Fahrenheit to Celsius:** C = (F - 32) × 5/9
  - **Fahrenheit to Kelvin:** Convert F to C then to K
  - **Kelvin to Celsius:** C = K - 273.15
  - **Kelvin to Fahrenheit:** Convert K to C then to F

- **Input Validation:**
  - Validate that exactly three parameters are provided after `--convert`: the conversion category (e.g., `temp` for temperature), the source unit and target unit, and the numeric value to be converted.
  - Ensure that the source and target units are one of the supported abbreviations (`C`, `F`, `K`).
  - Provide useful error messaging if the inputs fail validation or the conversion type is unsupported.

- **Error Handling:**
  - Use consistent error messages as observed in existing commands (e.g., "Error: No valid numeric inputs provided.") when validation fails.
  - Support numeric conversion warnings in similar fashion to existing arithmetic and statistical commands.

## Testing & Documentation

- **Unit Tests:**
  - Add tests to verify correct conversions for each temperature conversion path (e.g., C to F, F to K, etc.).
  - Include tests using both valid numeric inputs and invalid inputs (e.g., non-numeric values or unsupported units).
  - Validate error output and warning messages for incorrect input format.

- **Documentation:**
  - Update the README and command usage documentation to include examples of the `--convert` command for temperature conversion.
  - Provide inline code comments in the source file for clarity on conversion formulas and input validation logic.

This feature is self-contained in a single source file update and enhances the CLI tool without introducing unnecessary complexity, adhering to both the mission and the contribution guidelines of the repository.