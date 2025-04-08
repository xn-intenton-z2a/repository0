# RANDOM Number Generator

## Overview
This feature introduces a new CLI command `--random` that generates pseudo-random numbers for users. The command supports different modes based on the number of numeric parameters provided:

- **No Parameters:** Generates a random floating-point number between 0 (inclusive) and 1 (exclusive).
- **One Parameter:** Treats the single parameter as the upper bound (with a lower bound of 0) and generates a random floating-point number in that range.
- **Two Parameters:** Uses the first parameter as the lower bound and the second as the upper bound to generate a random floating-point number between them. The command validates that the lower bound is less than the upper bound.

This enhancement adds a simple but useful random number generator to the CLI tool, aligning with the repository’s mission to provide modular and practical automation utilities.

## Implementation Details
- **Command Integration:**
  - Add the new flag `--random` to the CLI's command mapping in `src/lib/main.js`.
  - Parse numeric inputs using the existing `parseNumbers` helper function. Handle invalid inputs by returning a standardized error message.
  
- **Random Number Generation Logic:**
  - **No Arguments:** Invoke `Math.random()` directly to obtain a value in the range [0, 1).
  - **One Argument:** Use the provided number as the exclusive upper bound. Generate a number using `Math.random() * upperBound`.
  - **Two Arguments:** Validate that the first number (min) is less than the second number (max). Compute a random number with the formula: `Math.random() * (max - min) + min`.

- **Error Handling & Validation:**
  - If more than two numeric parameters are provided, or if the input values are not valid numbers, output: "Error: Invalid input for random number generation.".
  - If two parameters are provided and the first is not less than the second, return an appropriate error message.

## Testing & Documentation
- **Unit Tests:**
  - Write tests to verify that the command returns a value within the expected range for each mode (no parameters, one parameter, two parameters).
  - Include tests for error handling when invalid or out-of-order inputs are given.

- **Documentation:**
  - Update the README and CLI documentation to include examples such as:
    - `node src/lib/main.js --random`
    - `node src/lib/main.js --random 10`
    - `node src/lib/main.js --random 5 15`
  - Provide inline comments in `src/lib/main.js` detailing the implementation logic for `--random`.

## Alignment with Repository Mission
The RANDOM Number Generator feature enhances the tool's utility by offering a quick method for generating random numeric values, supporting tasks in automated testing, simulation, and other diagnostics. This is consistent with the repository’s focus on providing modular, single-source file utilities for streamlined workflows.
