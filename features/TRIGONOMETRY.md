# TRIGONOMETRY

## Overview
This feature enhances the existing TRIGONOMETRY module in the CLI tool. In addition to supporting basic trigonometric functions (sine, cosine, and tangent) and hyperbolic functions (sinh, cosh, tanh), this update adds inverse trigonometric functions and inverse hyperbolic functions. Users can now compute arcsine (asin), arccosine (acos), and arctangent (atan) as well as the corresponding hyperbolic inverses (asinh, acosh, atanh). These additions broaden the mathematical capabilities of the CLI tool in a modular, single-source file environment, aligning with the repository’s mission of fostering healthy collaboration and practical automation.

## CLI Integration
- **Command Flag:** The `--trig` CLI flag is used to invoke the feature.
- **Function Parameter:** Users must provide a function name (case-insensitive) as the first parameter. Supported functions include:
  - **Basic Functions:** `sin`, `cos`, `tan`
  - **Hyperbolic Functions:** `sinh`, `cosh`, `tanh`
  - **Inverse Functions:** `asin`, `acos`, `atan`
  - **Inverse Hyperbolic Functions:** `asinh`, `acosh`, `atanh`
- **Angle/Input Parameter:** The command expects at least one numeric parameter representing the angle or value. 
- **Degree Conversion:** An optional `--deg` flag can be provided. For basic and hyperbolic functions, this flag indicates that the provided input is in degrees (and will be converted to radians before computation). For inverse functions, if `--deg` is provided, the result (normally in radians) will be converted to degrees for user convenience.

## Trigonometric Computation
- **Basic Functions:** 
  - `Math.sin(angle)`, `Math.cos(angle)`, `Math.tan(angle)` when the input is in radians (or converted from degrees when `--deg` is set).
- **Hyperbolic Functions:** 
  - `Math.sinh(angle)`, `Math.cosh(angle)`, `Math.tanh(angle)` computed directly on the provided value.
- **Inverse Functions:** 
  - For circular functions: `Math.asin(value)`, `Math.acos(value)`, `Math.atan(value)`. When the `--deg` flag is active, the output is converted from radians to degrees using the conversion: `degrees = radians * (180/Math.PI)`.
- **Inverse Hyperbolic Functions:** 
  - Computed using `Math.asinh(value)`, `Math.acosh(value)`, `Math.atanh(value)` with appropriate domain validation.

## Error Handling & Validation
- **Function Validation:** The command validates that the provided function name is one of the supported options. If an unrecognized function is provided, the CLI outputs an error message listing the accepted identifiers.
- **Numeric Input:** Validates that the numeric parameter(s) are provided and are within the valid domain for the selected function. For instance, inverse trigonometric functions require inputs in certain ranges (e.g. value for asin and acos must lie between -1 and 1).
- **Degree Flag Handling:** Ensures that conversions are correctly applied for both input (basic/hyperbolic) and output (inverse functions) based on the `--deg` flag.

## Testing & Documentation
- **Unit Tests:** New tests should be added to cover:
  - Computation of basic functions with and without the `--deg` flag.
  - Hyperbolic function computations.
  - Inverse function evaluations, including cases where the output should be converted to degrees.
  - Error scenarios such as out-of-domain inputs and unrecognized function names.
- **Documentation Updates:** The README and CLI usage docs should include examples such as:
  - Basic: `node src/lib/main.js --trig sin 45 --deg`
  - Inverse: `node src/lib/main.js --trig asin 0.5` and with degree output: `node src/lib/main.js --trig asin 0.5 --deg`
  - Hyperbolic: `node src/lib/main.js --trig sinh 0.5`
  - Inverse Hyperbolic: `node src/lib/main.js --trig atanh 0.3`
- **Inline Comments:** Developers should include inline comments in the source file to document the branch logic for selecting the correct Math functions and for handling the degree conversions.

## Alignment with Repository Mission
By extending the TRIGONOMETRY feature to include inverse trigonometric and inverse hyperbolic functions, this update further enriches the modular CLI tool’s mathematical capabilities. This enhancement supports diverse diagnostic, educational, and automation tasks within a single-source file, reinforcing the repository’s mission of fostering healthy collaboration and streamlined automation.