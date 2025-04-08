# SOLVER Feature

## Overview
This feature adds a new CLI command `--solve` that allows users to solve quadratic equations of the form ax² + bx + c = 0. Given three numeric inputs (a, b, and c), the feature computes the real roots of the equation. This enhancement not only broadens the repository’s arithmetic capabilities, but also provides a practical mathematical utility that aligns with the repository’s mission of offering useful, modular CLI tools.

## Implementation Details
- **Command Integration:**
  - Introduce a new flag `--solve` in the CLI command mapping in `src/lib/main.js`.
  - When invoked, the command expects exactly three numeric inputs representing the coefficients a, b, and c.

- **Computation Logic:**
  - Validate that coefficient `a` is non-zero; if it is zero, the tool should return an error indicating that the equation is not quadratic.
  - Compute the discriminant (D = b² - 4ac). 
  - If the discriminant is negative, output a clear message indicating that the equation has complex roots (or that only real roots are supported).
  - If the discriminant is zero or positive, calculate the two real roots using the quadratic formula: 
    - x1 = (-b + √D) / (2a)
    - x2 = (-b - √D) / (2a)

- **Error Handling & Validation:**
  - If fewer or more than three numeric inputs are provided, the command should return an error message "Error: Provide exactly three numeric coefficients for a quadratic equation." 
  - All invalid numeric inputs are handled as per the standardized parsing mechanism already present in the repository.

## Testing & Documentation
- **Unit Tests:**
  - Create tests simulating various quadratic equations: normal cases with two distinct roots, a degenerate case with one repeated root, and cases with a negative discriminant.
  - Ensure that appropriate error messages are returned when inputs are invalid or when the equation is not quadratic.

- **Documentation:**
  - Update the README and CLI usage documentation to include explanation and examples of the `--solve` command.
  - Include inline code comments in `src/lib/main.js` for the new command to document the quadratic solution logic.

## Alignment with Repository Mission
This feature reinforces the repository’s mandate to provide modular, single-file utilities that are both practical and demonstrative of effective CLI tool design. The quadratic solver contributes to the repository’s suite of arithmetic tools, showcasing additional capabilities in mathematical computations while promoting robust error handling and clear user communication.
