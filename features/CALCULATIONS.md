# CALCULATIONS

## Overview
This feature consolidates the arithmetic, combinatorial, and statistical computation capabilities into a unified module. It merges core functionalities from the previous NUMERIC and CORRELATION features, offering a comprehensive suite of numerical operations such as basic arithmetic (sum, subtract, multiply, divide), advanced statistical operations (median, mode, standard deviation, variance, percentile, geometric mean), combinatorial functions (factorial), as well as correlation analysis and linear regression. This consolidation reduces redundancy and streamlines maintenance while preserving detailed diagnostics for NaN token handling and performance optimizations.

## CLI Integration
- **Primary Command Flags:** The unified module will support the same CLI flags as before (e.g., `--sum`, `--subtract`, `--multiply`, `--divide`, `--median`, `--mode`, `--stddev`, `--percentile`, `--factorial`, etc.), along with the correlation functionality now enhanced with an optional regression mode (triggered via `--regression`).
- **Usage Examples:**
  - Arithmetic: `node src/lib/main.js --sum 10 20 30`
  - Statistical: `node src/lib/main.js --median 3 5 9 12 7 5`
  - Correlation & Regression: `node src/lib/main.js --correlation --regression 1 2 3 4 5 6`
- **Output Modes:** The module supports both standard text output and JSON output (using `--json` or `--json-pretty`) which includes metadata such as timestamp, tool version, execution duration, and input echo.

## Implementation Details
- **Unified Parsing:** The module reuses the enhanced number parsing logic (including configurable punctuation stripping, caching for regex operations, inline allowances for NaN when specified, and detailed diagnostics) originally found in NUMERIC and DIAGNOSTICS. 
- **Operation Logic:** All arithmetic operations (sum, subtract, multiply, divide) and statistical calculations (median, mode, standard deviation, variance, percentile, geomean) will be performed consistently. The correlation functionality computes the Pearson correlation coefficient and, when supplied with the `--regression` flag, calculates the linear regression parameters (slope, intercept, coefficient of determination). 
- **Error Handling:** Edge cases such as division by zero, invalid or malformed inputs and singular matrices (in case of regression with constant datasets) are handled with clear, consistent error messages in both plain text and JSON modes.

## Testing & Documentation
- **Unit Tests:** New tests will verify correct arithmetic computations, statistical measures, and correlation/regression calculations. These tests will cover both typical inputs and edge cases including invalid tokens and NaN scenarios.
- **Documentation:** The README, CLI usage guides, and inline code comments will be updated to reflect the consolidated functionality. Detailed examples will illustrate how the unified calculations module can be used for a wide range of numerical analysis tasks.

## Alignment with Repository Mission
By consolidating numerical and statistical operations, the CALCULATIONS feature simplifies the codebase while enhancing the repository’s analytical capabilities. It supports streamlined automation, promotes healthy collaboration, and ensures that users have a robust, self-contained tool for complex numerical computations without redundant or overlapping features.