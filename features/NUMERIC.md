# NUMERIC

## Overview
This feature consolidates all arithmetic, statistical, combinatorial, and now complex number operations into a cohesive numerical utilities module within the CLI tool. In addition to performing basic arithmetic (addition, subtraction, multiplication, division, modulo) and advanced computations (power, factorial, square root, median, mode, standard deviation, percentile, geometric mean, range, factors, variance, Fibonacci, GCD, LCM, prime detection) alongside new combinatorial functions (nPr and nCr), this updated module now integrates complex number arithmetic. The complex number extension supports operations in the form of standard algebraic notation (e.g., 3+4i) for addition, subtraction, multiplication, division, modulus calculation, and complex conjugation.

## CLI Integration
- **Basic Operations**
  - Commands such as `--sum`, `--subtract`, `--multiply`, `--divide`, and `--modulo` continue to handle standard arithmetic operations on real numbers.
- **Advanced Mathematical Commands**
  - Existing commands like `--power`, `--factorial`, `--sqrt`, `--median`, `--mode`, `--stddev`, `--percentile`, `--geomean`, etc., remain unchanged.
- **New Complex Number Operations**
  - **Command Flags:** The module now accepts complex number inputs in the form of `a+bi` or `a-bi` (with no spaces) for operations designated by new sub-commands:
    - `--cadd`: Performs complex addition. Example: `node src/lib/main.js --cadd 3+4i 1-2i`
    - `--csubtract`: Computes the difference between complex numbers. Example: `node src/lib/main.js --csubtract 5+3i 2+1i`
    - `--cmultiply`: Multiplies complex numbers. Example: `node src/lib/main.js --cmultiply 2+3i 1-4i`
    - `--cdivide`: Divides one complex number by another, with proper validation to avoid division by zero. Example: `node src/lib/main.js --cdivide 3+2i 1+1i`
    - **Additional Operations:** Optional sub-commands for computing the modulus (`--cabs`) and complex conjugate (`--cconj`) are also provided. 
  - **Input Handling:** A dedicated parser is introduced to recognize complex number patterns using regular expressions. This parser extracts real and imaginary parts while validating proper format. 
  - **Global JSON Output Mode:** Just as with other commands, results will include metadata like timestamp, version, execution duration, and an echo of cleaned input values. 

## Implementation Details
- **Operation Logic:**
  - Standard arithmetic operations continue as before.
  - **Complex Parsing:** A new parsing routine checks if an input token matches the complex number format. Valid inputs are split into real and imaginary components (e.g., "3+4i" becomes real: 3, imaginary: 4). Operations then follow algebraic rules:
    - **Addition/Subtraction:** Combine real parts and imaginary parts separately.
    - **Multiplication:** Follows (a+bi)*(c+di) = (ac-bd) + (ad+bc)i.
    - **Division:** Involves multiplying numerator and denominator by the complex conjugate of the divisor and then dividing the real and imaginary parts by the denominator's modulus squared.
    - **Modulus and Conjugate:** Computations for modulus (sqrt(a²+b²)) and conjugate (a - bi) are implemented.
- **Error Handling & Validation:**
  - The module validates the complex number format and produces clear error messages if the format is invalid.
  - As with real number operations, warnings and error messages are consistent in both standard and JSON output modes.

## Testing & Documentation
- **Unit Tests:**
  - New tests will verify the correct parsing and computation for complex operations, ensuring that both valid inputs (e.g., "3+4i", "-2-5i") and invalid tokens are handled appropriately.
  - Existing tests for real number operations remain to ensure backward compatibility.
- **Documentation:**
  - The README, CLI usage guides, and inline comments in the codebase will be updated to reflect the new complex number operations, including usage examples for each new command flag.

## Alignment with Repository Mission
By extending the numerical utilities module to include complex number arithmetic, this update further broadens the mathematical capabilities of the CLI tool. This enhancement not only simplifies complex computations into a single, self-contained module but also reinforces the repository's mission of promoting streamlined automation and healthy collaboration without adding excessive complexity.