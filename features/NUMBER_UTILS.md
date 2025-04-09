# NUMBER_UTILS

## Overview
This feature consolidates numerical utility functions into a single, cohesive module. It merges the capabilities of random number generation and unit conversion into one command flag, streamlining operations that involve numeric manipulations. Users can generate random numbers in flexible ranges and perform conversions between different measurement units, all through a unified CLI interface.

## CLI Integration
- **Global Flag:** Introduce a new flag `--number` to invoke the NUMBER_UTILS module.
- **Sub-Modes:**
  - **random:** Provides flexible random number generation:
    - **No Arguments:** Generates a random floating-point number between 0 (inclusive) and 1 (exclusive).
    - **One Argument:** Treats the argument as the exclusive upper bound and generates a number within 0 to that bound.
    - **Two Arguments:** Interprets the first argument as the lower bound and the second as the upper bound; validates that the lower is less than the upper before generating a number within that range.
  - **convert:** Facilitates unit conversion operations. Input should follow this format:
    - `<value> <source_unit> to <target_unit>`
    - **Supported Conversions:**
      - **Length:** kilometers, miles, meters, feet
      - **Weight:** kilograms, pounds
      - **Temperature:** Celsius, Fahrenheit, Kelvin
    - The command parses the numeric value and unit strings, performs validation to ensure compatible unit categories, and then applies the appropriate conversion formula (e.g., converting kilometers to miles using a factor of approximately 0.621371).

## Implementation Details
- **Mode Selection:** The sub-mode is determined by the order and type of parameters supplied. If the first parameter is numeric and no "to" keyword is detected, the module assumes random number generation. If the keyword "to" is present, unit conversion logic is triggered.
- **Error Handling & Validation:**
  - For random mode: Validates the number of parameters and their numeric values; ensures that in the two-argument scenario the lower bound is less than the upper bound.
  - For convert mode: Checks that the input format is strictly followed, the numeric value is valid, and the conversion is between compatible unit types.
- **Documentation & Testing:**
  - Unit tests will cover both sub-modes ensuring correct output ranges for random generation and accurate conversion results with edge case handling.
  - The README documentation will include examples, such as:
    - `node src/lib/main.js --number random`
    - `node src/lib/main.js --number random 10`
    - `node src/lib/main.js --number random 5 15`
    - `node src/lib/main.js --number convert 10 km to mi`

## Alignment with Repository Mission
NUMBER_UTILS enhances the repository’s commitment to providing modular and self-contained CLI utilities. By merging simple yet frequently used numeric operations into a single feature, users benefit from a more streamlined tool that supports both everyday and diagnostic tasks. This consolidation fosters healthy collaboration and improves workflow efficiency by reducing redundancy and complexity in the codebase.