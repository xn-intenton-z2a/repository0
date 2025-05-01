# CALCULATOR Feature Specification

## Overview
This feature adds a new command called calc to the CLI. The calc command allows users to perform simple arithmetic operations such as addition, subtraction, multiplication, and division directly from the command line. This core functionality enhances the CLI's value by solving a real problem for users who need quick computations without switching applications.

## Command Details
- When the first argument is calc, the CLI expects the second argument to specify the operation (add, sub, mul, div).
- The subsequent arguments are numerical values on which the operation will be performed.
- The command validates the inputs and outputs the computed result back to the console.
- In case of invalid operations or missing/invalid numerical values, it prints a concise error message along with usage instructions.

## Source and Test Updates
- The source file (src/lib/main.js) is updated to branch logic when the calc command is provided. It parses the operation and operands and then performs the calculation.
- The test file (tests/unit/main.test.js) is modified to include tests for valid and invalid calc operations. This ensures that the functionality returns correct results and gracefully handles errors.
- The README file is updated with a new section under CLI Usage to include examples for invoking the calc command. This ensures clear instructions for end users.
- The package.json file may be updated if required for any dependency adjustments or script additions; however, primary focus remains on core changes.

## Impact and Alignment
This feature delivers substantial user impact by extending the CLI's functionality beyond simple parsing to include practical arithmetic operations. It aligns with the repository's mission of providing handy CLI utilities and demonstrates how a single source file enhancement can deliver real world value.

## Usage Example
To add numbers:
  node src/lib/main.js calc add 1 2 3
To subtract numbers:
  node src/lib/main.js calc sub 10 3

In both cases, the CLI will print the computed result to the console.