# UNIT_CONVERSION

## Overview
This feature introduces a lightweight unit conversion module to the CLI tool. The UNIT_CONVERSION feature allows users to convert numeric values between common measurement units—including length, weight, temperature, and volume. It is designed as a self-contained utility, reinforcing the repository’s mission of promoting streamlined automation and healthy collaboration with modular, single-file extensions.

## CLI Integration
- **Command Flag:** A new global flag `--convert` is added to invoke unit conversion.
- **Sub-Commands & Parameters:**
  - Users specify a conversion category (e.g., `length`, `weight`, `temperature`, `volume`).
  - Followed by the input value, source unit, and target unit. E.g.,
    - Length: `node src/lib/main.js --convert length 10 inch cm`
    - Temperature: `node src/lib/main.js --convert temperature 32 F C`
- **Output Modes:**
  - Standard text mode returns the converted value.
  - JSON mode (via `--json` or `--json-pretty`) outputs the result along with metadata such as timestamp, version, and input echo.

## Implementation Details
- **Conversion Logic:**
  - The module uses preset conversion factors for each category (e.g., inches to centimeters, pounds to kilograms, Fahrenheit to Celsius).
  - For temperature, formulas are implemented to correctly handle conversions between Celsius, Fahrenheit, and Kelvin.
  - The conversion module validates units and input values, producing error messages if an unknown unit is provided or if the conversion is not supported.
- **Error Handling:**
  - In cases of invalid input tokens, missing parameters, or unsupported conversions, the module responds with a clear error message.
  - Warnings for invalid units are provided in the same style as the other features, including dynamic indexes and correction suggestions if applicable.
- **Testing & Documentation:**
  - Unit tests are to be added for each conversion category covering valid conversions, edge cases, and error conditions.
  - Documentation in the README and inline comments provide usage examples, mathematical formulas, and conversion tables for reference.

## Alignment with Repository Mission
By adding the UNIT_CONVERSION feature, the CLI tool enriches its utility set with practical, everyday conversion operations. This module remains self-contained and aligns with the repository’s mission to facilitate healthy collaboration and automated workflows through modular, well-documented, and easily extendable utilities.