# Quadratic Equation Solver

## Overview
This feature introduces a quadratic equation solver into the CLI tool. The solver computes real roots (or notifies if the roots are complex) by processing coefficients for equations of the form ax² + bx + c = 0. It is designed as a compact, self-contained library function integrated with the CLI so that users can solve quadratic equations directly from the command line.

## CLI Integration
- **Command Flag:** Introduce the `--quadratic` flag to invoke the quadratic equation solver.
- **Usage Examples:**
  - `node src/lib/main.js --quadratic 1 -3 2` should return roots 2 and 1 since the equation x² - 3x + 2 = 0 factors into (x - 2)(x - 1) = 0.
  - `node src/lib/main.js --quadratic 1 2 1` should return the single real root -1 (double root) because the discriminant equals zero.

## Implementation Details
- **Input Parsing:**
  - Parse three numeric arguments which represent the coefficients a, b, and c. Ensure that the coefficient a is non-zero.
  - Provide clear error messages if exactly three numerical coefficients are not provided or if a equals zero.

- **Operation Logic:**
  - Compute the discriminant: D = b² - 4ac.
  - If D > 0, calculate the two distinct real roots using the quadratic formula: x = (-b ± √D) / (2a).
  - If D = 0, calculate the single real root: x = -b / (2a).
  - If D < 0, return an error message indicating that the equation has complex roots, as the solver focuses on real number solutions.

## Error Handling & Validation
- Validate that exactly three arguments are provided and that they can be converted to valid numbers.
- If coefficient a is zero, return a specific error message stating that the equation is not quadratic.
- For any invalid or missing inputs, output a unified error message consistent with the CLI tool's error handling methodology.

## Testing & Documentation
- **Unit Tests:** Develop tests to cover cases with two real roots, one real double root, and non-quadratic input (a = 0) as well as inputs that would result in complex roots.
- **Documentation:** Update the CLI usage guide and README with examples and detailed documentation on how the quadratic equation solver works. Inline comments in the source code will explain the derivation and computation of the roots.

## Alignment with Repository Mission
The quadratic solver aligns with the repository’s mission by enhancing the numerical utilities available within a modular, self-contained CLI tool. This feature reinforces streamlined automation and provides users with practical, mathematical computation capabilities.