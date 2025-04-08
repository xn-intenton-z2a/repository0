# COMPLEX

## Overview
This feature introduces a new CLI command `--complex` to perform arithmetic operations on complex numbers. Unlike the real-number based commands currently available, `--complex` allows users to work with numbers in the form `a+bi` (or `a-bi`). Supported operations include addition, subtraction, multiplication, and division of complex numbers. This utility expands the mathematical capabilities of the CLI tool while remaining consistent with the single-file, modular design principles of the repository.

## Implementation Details
- **Command Integration:**
  - Add a new flag `--complex` in the CLI command mapping within `src/lib/main.js`.
  - The command will expect an operation identifier (e.g., `add`, `subtract`, `multiply`, `divide`) followed by two complex number strings as operands.
  - Example: `node src/lib/main.js --complex add 3+2i 1-4i`.

- **Parsing Complex Numbers:**
  - Use a regular expression to parse inputs of the form `a+bi` or `a-bi` where `a` and `b` are numbers.
  - Validate the input format and provide a clear error if the input does not conform to the expected pattern.

- **Arithmetic Operations:**
  - **Addition:** Sum the real parts and the imaginary parts separately.
  - **Subtraction:** Subtract the corresponding real and imaginary parts.
  - **Multiplication:** Use the formula: \( (a+bi)\times(c+di) = (ac-bd) + (ad+bc)i \).
  - **Division:** Compute using the complex conjugate: \( \frac{a+bi}{c+di} = \frac{(a+bi)(c-di)}{c^2+d^2} \). Handle division by zero by reporting an error when the denominator is zero.

- **Error Handling & Validation:**
  - If any operand is missing or the operation identifier is not one of the supported operations, output a clear error such as "Error: Invalid usage. Expected format: --complex <operation> <complex1> <complex2>."
  - Include warnings for any parsing issues, following the repository's standardized error messaging conventions.

## Testing & Documentation
- **Unit Tests:**
  - Create tests covering each arithmetic operation using valid complex number strings.
  - Validate error handling by inputting incorrectly formatted complex numbers or unsupported operations.

- **Documentation:**
  - Update the README and CLI usage documentation with examples:
    - `node src/lib/main.js --complex add 3+2i 1-4i`
    - `node src/lib/main.js --complex multiply 2+3i 1+4i`
  - Add inline comments in `src/lib/main.js` detailing the parsing logic and arithmetic computation for complex numbers.

## Alignment with Repository Mission
This feature enhances the repository's mission by broadening the CLI's mathematical toolkit with support for complex number arithmetic. It reinforces the template's emphasis on practical, modular utilities and promotes healthy collaboration through clear documentation and testability.
