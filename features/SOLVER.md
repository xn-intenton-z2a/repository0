# SOLVER

## Overview
This updated SOLVER feature now encompasses two complementary algebraic solving modes within the CLI tool. In addition to its original functionality of solving quadratic equations of the form ax² + bx + c = 0, SOLVER now also supports basic matrix operations on 2x2 matrices. The matrix operations include addition, multiplication, determinant calculation, and inversion (where applicable). This update reinforces the repository’s mission of providing modular, self-contained utilities for mathematical computations and practical automation.

## Implementation Details
### Quadratic Equation Solver
- **Command Integration:**
  - The existing `--solve` flag remains available. When the first argument is not `matrix`, the command expects exactly three numeric parameters representing the coefficients a, b, and c.
- **Computation Logic:**
  - Validate that coefficient a is non-zero; if it is zero, return an error indicating the equation is not quadratic.
  - Compute the discriminant (D = b² - 4ac). 
  - If D is negative, output a message indicating that only real roots are supported (or optionally notify about complex roots in future iterations).
  - If D is zero or positive, calculate the two real roots using the quadratic formula.

### Matrix Operations (2x2 Matrices)
- **Activation:**
  - When the first argument provided after `--solve` is the keyword `matrix`, the command enters Matrix Mode.
  - The next argument specifies the matrix operation: one of `add`, `multiply`, `determinant`, or `inverse`.
- **Input Format:**
  - Matrices are provided as strings in the format `a,b;c,d`, where rows are separated by a semicolon and values within a row by a comma.
  - For operations that require two matrices (e.g. `add` and `multiply`), two matrix strings are expected. For single-matrix operations (`determinant` and `inverse`), one matrix string is provided.
- **Operation Details:**
  - **Addition:** Parse both matrices and perform element-wise addition.
  - **Multiplication:** Parse both matrices and compute their product using standard 2x2 matrix multiplication.
  - **Determinant:** Compute the determinant with the formula: `det = a*d - b*c` for a matrix `[[a, b], [c, d]]`.
  - **Inverse:** Calculate the inverse using the formula: inverse = (1/det) * [[d, -b], [-c, a]]. If the determinant is zero, return a singular matrix error.

## Testing & Documentation
- **Unit Tests:**
  - Extend existing tests for `--solve` to cover cases with quadratic equations including both distinct and repeated roots.
  - Add tests for Matrix Mode covering valid addition, multiplication, determinant calculation, and correct handling of singular matrices for inversion.
  - Ensure invalid formats or parameters result in clear, standardized error messages.

- **Documentation:**
  - Update the README and CLI usage docs with examples such as:
    - Quadratic Equation: `node src/lib/main.js --solve 1 -3 2`
    - Matrix Addition: `node src/lib/main.js --solve matrix add "1,2;3,4" "5,6;7,8"`
    - Matrix Determinant: `node src/lib/main.js --solve matrix determinant "1,2;3,4"`
    - Matrix Inverse: `node src/lib/main.js --solve matrix inverse "1,2;3,4"`
  - Include inline code comments in `src/lib/main.js` detailing the branching logic between quadratic solving and matrix operations.

## Alignment with Repository Mission
By merging matrix operations into the existing SOLVER feature, this update broadens the CLI tool’s mathematical repertoire while maintaining a modular, single-source file approach. It promotes healthy collaboration and efficient troubleshooting by providing additional, practical automation utilities in a cohesive, user-friendly interface.