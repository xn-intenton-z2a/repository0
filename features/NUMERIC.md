# NUMERIC

## Overview
This feature consolidates all arithmetic, statistical, and combinatorial operations into a cohesive numerical utilities module within the CLI tool. In addition to basic arithmetic (addition, subtraction, multiplication, division, modulo) and advanced computations (power, factorial, square root, median, mode, standard deviation, percentile, geometric mean, range, factors, variance, Fibonacci, GCD, LCM, prime detection), this updated module now includes combinatorial functions. These new functions compute permutations (nPr) and combinations (nCr) using factorial-based formulas, providing users with a broader toolkit for mathematical operations.

## CLI Integration
- **Command Flags and Aliases:**
  - Basic operations are invoked via flags such as `--sum` (alias `-s`), `--subtract`, `--multiply` (alias `-m`), `--divide` (alias `-d`), and `--modulo`.
  - Advanced operations include flags like `--power`, `--factorial`, `--sqrt`, `--median`, `--mode`, `--stddev`, `--percentile`, `--geomean`, `--range`, `--factors`, `--variance`, `--fibonacci`, `--gcd`, `--lcm`, and `--prime`.
  - **New Combinatorial Operations:**
    - `--npr`: Computes permutations (nPr) given two non-negative integers n and r using the formula nPr = n! / (n-r)! with input validation ensuring n ≥ r.
    - `--ncr`: Computes combinations (nCr) given two non-negative integers n and r using the formula nCr = n! / (r! * (n-r)!) with proper validation of inputs.
- **Global JSON Output Mode:** Supports both standard and JSON outputs (with optional pretty-printing) that include metadata such as timestamp, version, execution duration, and echo of cleaned input values.

## Implementation Details
- **Operation Logic:**
  - **Arithmetic & Statistical Commands:** Process lists of numeric inputs using standard mathematical formulas with consistent error messaging for invalid or insufficient inputs.
  - **Combinatorial Functions:**
    - **Permutation (`--npr`):** Validates that inputs are non-negative integers and that n is greater than or equal to r. Computes nPr using the factorial formula.
    - **Combination (`--ncr`):** Performs similar validations and computes nCr using the standard formula.
  - **Input Validation & Parsing:** Utilizes an enhanced parser that trims whitespace and configurable punctuation, handles tokens resembling "NaN" according to the environment configuration, and aggregates warning messages.

## Testing & Documentation
- **Unit Tests:** Expanded tests will cover the new `--npr` and `--ncr` commands to ensure accurate computations and proper error handling under various edge cases.
- **Documentation:** The README and CLI usage guides will be updated with examples such as:
  - `node src/lib/main.js --npr 5 3`
  - `node src/lib/main.js --ncr 5 3`
  Detailed inline comments and a dedicated section in the user guide will explain the combinatorial formulas and input requirements.

## Alignment with Repository Mission
Enhancing the NUMERIC module to include combinatorial functions aligns with the repository’s mission of promoting streamlined automation and healthy collaboration. This update broadens the scope of mathematical operations available in a single, self-contained module while maintaining clear, consistent documentation and error handling mechanisms.
