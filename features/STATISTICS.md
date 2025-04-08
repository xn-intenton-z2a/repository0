# STATISTICS Feature

This feature adds implementations for missing statistical commands in the CLI tool. The commands to be implemented are: `--median`, `--mode`, and `--stddev` (standard deviation). These commands extend the arithmetic functionality while keeping consistent error messaging and behavior observed in the existing commands.

# Overview

The CLI currently lists `--median`, `--mode`, and `--stddev` in its usage string, but these flags are not implemented. This feature will add robust implementations for these statistics functionalities. It is aligned with the repository mission by enhancing the automation utilities available in the CLI and promoting healthy collaboration through expanded functionality.

# Implementation Details

- **Input Handling**: 
  - Validate numeric inputs in the same manner as other arithmetic commands using the `parseNumbers` helper.
  - If no valid numeric input is provided, output "Error: No valid numeric inputs provided.".

- **Median (`--median`)**:
  - Sort the valid numbers.
  - If the count is odd, the median is the middle number.
  - If even, compute the average of the two middle numbers.

- **Mode (`--mode`)**:
  - Count the frequency of each numeric value.
  - Return the number or numbers (if tie) that occur most frequently. The output should be a comma-separated list.
  - If all numbers are unique, the mode could be the set of all numbers or a specific message indicating no mode, as defined by the design decision.

- **Standard Deviation (`--stddev`)**:
  - Compute the mean (average) of the valid numbers.
  - Calculate the variance as the average of the squared differences from the mean.
  - Take the square root of the variance to obtain the standard deviation.

- **Error Handling & Warnings**: 
  - Follow the same error message protocol as other arithmetic operations (i.e., print a uniform error when there are no valid inputs).
  - If non-numeric values are detected, report them with a warning as seen in other commands.

# Testing & Documentation

- **Unit Tests**: 
  - Create tests for each new flag to verify correct outputs for both even and odd numbers for median.
  - Verify mode calculation for single mode, multiple modes, and cases with no repeated numbers.
  - Ensure standard deviation calculation is correct using known datasets.
  - Test error cases (e.g., no valid numbers provided).

- **Documentation**: 
  - Update the README and CLI usage documentation to include examples of `--median`, `--mode`, and `--stddev` usage.
  - Provide inline code documentation in the source file (`src/lib/main.js`) to explain the implementation details.

This feature enhances the CLI tool by providing users more comprehensive statistical computations and aligns with the repository's mission to offer a robust template for automation and development workflows.