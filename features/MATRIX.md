# MATRIX

## Overview
This feature adds matrix arithmetic capabilities to the CLI tool. It enables users to perform fundamental operations on matrices such as addition, multiplication, transpose, determinant calculation, and inversion. MATRIX is designed as a lightweight library function that leverages the existing CLI architecture with support for both standard and JSON output modes, and fits in a single source file. 

## CLI Integration
- **Command Flag:** Introduce a new global flag `--matrix` to invoke the matrix operations module.
- **Sub-Commands:**
  - **add:** Add two matrices together. E.g., `node src/lib/main.js --matrix add "[[1,2],[3,4]]" "[[5,6],[7,8]]"`
  - **multiply:** Multiply two matrices when dimensions agree. E.g., `node src/lib/main.js --matrix multiply "[[1,0],[0,1]]" "[[2,3],[4,5]]"`
  - **transpose:** Transpose a given matrix. E.g., `node src/lib/main.js --matrix transpose "[[1,2,3],[4,5,6]]"`
  - **determinant:** Compute the determinant for square matrices. E.g., `node src/lib/main.js --matrix determinant "[[1,2],[3,4]]"`
  - **inverse:** Calculate the inverse of a square matrix if it exists. E.g., `node src/lib/main.js --matrix inverse "[[1,2],[3,4]]"`
- **Output Modes:** The feature supports both standard text output and global JSON output (with metadata) by honoring the `--json` and `--json-pretty` flags.

## Implementation Details
- **Input Parsing:** Accept matrix inputs as JSON-formatted strings. Validate that the provided strings are parseable into two-dimensional arrays of numbers. 
- **Operation Logic:**
  - **Addition & Multiplication:** Ensure dimension compatibility before performing element-wise addition or proper matrix multiplication.
  - **Transpose:** Swap rows and columns of the matrix.
  - **Determinant & Inverse:** For square matrices, implement recursive determinant calculation and, where applicable, use algorithms (e.g., Gauss-Jordan elimination) for computing the inverse.
- **Validation & Error Handling:**
  - Provide informative error messages when input matrices are malformed, dimensions do not match, or when a matrix is singular (non-invertible).
  - Consistently output errors in both standard and JSON modes.

## Testing & Documentation
- **Unit Tests:** Add tests to verify correct computations for various matrix operations, including edge cases such as non-conformable matrices and singular matrices.
- **Documentation:** Update the README and CLI usage guides to include examples and explanations for each sub-command. Inline comments in the source code should highlight the core arithmetic functions and any recursive algorithms used.

## Alignment with Repository Mission
MATRIX extends the repository’s modular CLI tool by enabling advanced linear algebra operations. This capability enriches user workflows in scientific, engineering, and automation tasks, aligning with the mission to promote healthy collaboration through self-contained, well-documented utilities.