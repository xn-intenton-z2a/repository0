# NUMERIC_UTILS

## Overview
This feature consolidates numeric handling into a unified module that not only ensures safe processing of numeric values (including centralized NaN control) but also provides a set of common mathematical utilities such as GCD (Greatest Common Divisor), LCM (Least Common Multiple), and prime number detection. This merged functionality addresses both consistency in numeric error handling and the implementation of useful math operations, aligning with the repository’s mission of promoting robust diagnostics and efficient CI/CD workflows.

## Implementation Details
- **Centralized Numeric Safety:**
  - Retain existing CLI flags for managing NaN behavior: `--toggle-allow-nan`, `--allow-nan-inline`, `--diagnose-nan`, and `--ignore-invalid`.
  - Ensure consistent handling of non-numeric values and prevent propagation of NaN errors across the application.
  
- **Mathematical Utilities:**
  - Implement functions in a single self-contained module (e.g., `src/lib/numericUtils.js`) for:
    - **GCD Calculation:** Compute the greatest common divisor of two or more numbers.
    - **LCM Calculation:** Compute the least common multiple based on the GCD.
    - **Prime Check:** Provide a function to determine if a given number is prime.
  - Expose these functions via a consolidated API that can be used both programmatically and via the CLI.
  
- **CLI Integration:**
  - Extend the main CLI (`src/lib/main.js`) to support a new flag (e.g., `--math`) that accepts subcommands or formulas for invoking the math utilities.
  - Provide clear error messages and fallback behavior for invalid numeric inputs, integrating with the existing numeric safety mechanism.

## Testing
- **Unit Tests:**
  - Create tests (e.g., `tests/unit/numericUtils.test.js`) to cover various scenarios:
    - Verify correct computation of GCD, LCM, and prime tests with a range of inputs.
    - Test command line parsing for math utility invocations along with safe handling of NaN values.
  
- **Edge Cases:**
  - Ensure that invalid or non-numeric inputs trigger appropriate diagnostic messages
  - Validate that the combined numeric safety and math operations work harmoniously without interfering with other CLI functionalities.

## Documentation
- **User Guide:**
  - Update the README and CONTRIBUTING files with usage examples for the new `--math` flag as well as the integrated numeric safe controls.
  - Provide inline code examples and CLI invocation samples, such as:
  ```bash
  # Compute GCD of two numbers
  node src/lib/main.js --math gcd 48 180

  # Compute LCM
  node src/lib/main.js --math lcm 12 15 20

  # Check if a number is prime while enforcing numeric safety
  node src/lib/main.js --math prime 17
  ```
- **API Documentation:**
  - Document the exported functions and error handling behavior in code comments and markdown files.

## Benefits
- **Unified Numeric Processing:** Combines safety checks and useful mathematical computations in one module to reduce redundancy.
- **Enhanced Diagnostics:** Provides detailed output on invalid numeric entries and offers corrective suggestions when appropriate.
- **Improved Developer Experience:** Offers a simple API for both CLI commands and programmatic use, optimizing the repository for projects that require numeric operations.
