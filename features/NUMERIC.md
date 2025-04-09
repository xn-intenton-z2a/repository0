# NUMERIC

## Overview
This feature consolidates all arithmetic and statistical operations in the CLI tool into a cohesive numerical utilities module. This module includes basic arithmetic (addition, subtraction, multiplication, division, modulo) as well as advanced computations (power, factorial, square root, median, mode, standard deviation, percentile, geometric mean, range, factors, variance, Fibonacci, GCD, LCM, and prime detection). It also leverages the enhanced input parsing mechanism with configurable NaN handling, punctuation stripping, and aggregated warning summaries.

## CLI Integration
- **Command Flags and Aliases:** 
  - Basic operations are invoked via flags such as `--sum` (alias `-s`), `--subtract`, `--multiply` (alias `-m`), `--divide` (alias `-d`), and `--modulo`.
  - Advanced operations include flags like `--power`, `--factorial`, `--sqrt`, `--median`, `--mode`, `--stddev`, `--percentile`, `--geomean`, `--range`, `--factors`, `--variance`, `--fibonacci`, `--gcd`, `--lcm`, `--prime`, and `--log`.
- **Global JSON Output Mode:** The feature supports both standard and JSON output (with optional pretty-printing), ensuring consistent output formatting across all numeric commands.
- **Enhanced Input Parsing:** Utilizes the centralized numeric parser that handles dynamic punctuation stripping, configurable invalid token recognition, robust 'NaN' management, and dynamic warning index reporting.

## Implementation Details
- **Operation Logic:**
  - Arithmetic commands process a list of numeric inputs and return the computed result along with metadata (timestamp, version, execution duration, and input echo).
  - Advanced statistical commands compute values based on standard mathematical formulas. For example, median calculates the middle value (or average of two middle numbers) and standard deviation uses the population variance formula.
  - Error conditions (such as invalid or insufficient numeric inputs) trigger uniform error messages with detailed warnings.

- **Input Validation & Error Handling:**
  - The parser ensures numeric inputs are clean and valid, with specific checks for tokens resembling 'NaN'.
  - Configuration options, like `ALLOW_NAN`, `INVALID_TOKENS`, and `TOKEN_PUNCTUATION_CONFIG`, are used to tailor input processing.
  - In cases of division by zero or improperly formatted inputs, clear error messages are returned.

## Testing & Documentation
- **Unit Tests:** A suite of tests ensures each computation (both basic and advanced) works as expected. Tests verify proper fallback when invalid inputs arise, and validate JSON output mode alongside aggregated warnings.
- **Documentation:** The README and CLI usage guides are updated to include examples such as:
  - Basic: `node src/lib/main.js --sum 3 4 5`
  - Advanced: `node src/lib/main.js --percentile 75 10 20 30 40 50 60`
  - Error Handling: Detailed warning messages for invalid tokens including NaN and punctuation cases.

## Alignment with Repository Mission
The NUMERIC feature enhances the repository’s role as a modular CLI tool by consolidating key mathematical operations into a single feature. It supports the mission of promoting healthy collaboration and streamlined automation through self-contained, well-documented, and easily extendable utilities.
