# CLI_PLOTTING Feature (Enhanced)

## Overview
This enhanced feature extends the existing CLI_PLOTTING functionality by adding a new command called stats. In addition to generating an ASCII bar chart from a comma-separated list of numbers, the CLI will now also compute basic descriptive statistics such as average and median. This improvement provides users with a quick numerical analysis tool, further reinforcing the repository's commitment to delivering valuable CLI utilities in Node.js.

## Design and Implementation
- Modify the source file (src/lib/main.js) to add a new case in the command switch statement for the "stats" command.
  - Implement a new function, stats(dataString), that validates input (a comma-separated list of numbers), computes statistics (average and median), and outputs the results to the console.
  - The function should handle cases with missing or invalid data by displaying usage instructions or error messages similar to the plot command.
- Update the test file (tests/unit/main.test.js) to include new test cases for the stats command:
  - Test valid input to ensure correct average and median calculations.
  - Test missing data input to validate that usage instructions are displayed.
  - Test invalid input to ensure the function handles errors gracefully.
- Update documentation in docs/USAGE.md and README.md to include information about the new stats command with usage examples and expected outputs.
- No changes to dependencies are needed as the implementations will use native JavaScript functions for computation.

## Impact and Benefits
- Expands the CLI utility by providing numerical analysis capabilities that complement the plotting feature.
- Helps users quickly assess datasets by calculating key statistics, improving overall user experience and utility.
- Consolidates CLI commands into a coherent set of functionalities, aligning with the repository's mission of offering handy CLI utilities in Node.js.