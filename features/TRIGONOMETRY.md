# TRIGONOMETRY

## Overview
This feature adds a new CLI command `--trig` that computes a range of trigonometric functions. Originally, it supported basic functions (sine, cosine, and tangent). This update extends the existing functionality by adding optional hyperbolic trigonometric functions (sinh, cosh, and tanh), enabling users to perform both circular and hyperbolic computations. This enhancement provides a broader set of mathematical tools within the modular, single-source file CLI tool and supports practical automation and diagnostic tasks.

## CLI Integration
- **Command Addition:** The `--trig` CLI flag remains available. Users now supply a function name as the first parameter from the following options (case-insensitive):
  - Basic functions: `sin`, `cos`, `tan`
  - Hyperbolic functions: `sinh`, `cosh`, `tanh`
- **Parameters:** The command expects at least two parameters: the trigonometric function (as listed above) and the angle value. An optional flag `--deg` indicates if the provided angle is in degrees (default is radians). When `--deg` is supplied, the tool converts the input from degrees to radians before computation.

## Trigonometric Computation
- **Basic Functions:** 
  - `Math.sin(angle)` for sine
  - `Math.cos(angle)` for cosine
  - `Math.tan(angle)` for tangent
- **Hyperbolic Functions:** 
  - `Math.sinh(angle)` for hyperbolic sine
  - `Math.cosh(angle)` for hyperbolic cosine
  - `Math.tanh(angle)` for hyperbolic tangent
- **Degree Conversion:** When the `--deg` flag is provided, the angle is converted using the formula: `radians = degrees * (Math.PI / 180)`.

## Error Handling & Validation
- The command validates that the function parameter is one of the recognized identifiers. If an unrecognized function is provided, it will output an error message: "Error: Unsupported trigonometric function. Use sin, cos, tan, sinh, cosh, or tanh.".
- The numeric input is validated using the existing `parseNumbers` helper. If no valid numeric input is provided, the standardized error message "Error: No valid numeric inputs provided." is returned.
- Flags and extra parameters are checked, and any deviations from the expected input pattern result in clear error messages following existing guidelines.

## Testing & Documentation
- **Unit Tests:** New tests should simulate valid computations for all supported functions (both basic and hyperbolic). Include tests for the `--deg` flag to ensure proper angle conversion. Invalid cases (e.g., unknown function names or non-numeric angles) must verify that proper error messages are output.
- **Documentation Updates:** The README and CLI usage documentation are updated to include examples such as:
  - Basic: `node src/lib/main.js --trig sin 1.57`
  - With degree flag: `node src/lib/main.js --trig cos 180 --deg`
  - Hyperbolic: `node src/lib/main.js --trig sinh 0.5`
  - With degree flag (if applicable): `node src/lib/main.js --trig tanh 45 --deg`
- **Inline Comments:** In `src/lib/main.js`, comments are added to document the new branch logic handling hyperbolic function computation.

## Alignment with Repository Mission
By extending the TRIGONOMETRY feature to support hyperbolic functions, this update richens the mathematical toolset available in the CLI tool. It aligns with the repository’s mission to deliver modular, single-source utilities for practical automation, enabling healthier collaboration and more comprehensive diagnostics in mathematical workflows.