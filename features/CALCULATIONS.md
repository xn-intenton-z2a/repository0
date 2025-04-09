# CALCULATIONS

## Overview
This unified CALCULATIONS feature consolidates a wide range of numerical operations into a single, self-contained module. It now not only supports basic arithmetic, statistical analysis, combinatorial functions, and correlation/regression (as previously defined) but also integrates advanced matrix operations. By merging the standalone MATRIX functionality into CALCULATIONS, the repository streamlines mathematical computations into one coherent interface.

## CLI Integration
- **Global Command Flags:** Commands such as `--sum`, `--multiply`, `--subtract`, `--divide`, `--median`, `--mode`, `--stddev`, `--percentile`, `--factorial`, `--geomean`, and additional correlation/regression flags remain available.
- **Matrix Sub-Command:** A new set of sub-commands under a dedicated `matrix` namespace is provided:
  - **add:** Add two matrices, e.g., `node src/lib/main.js --calculations matrix add "[[1,2],[3,4]]" "[[5,6],[7,8]]"`.
  - **multiply:** Multiply two matrices with compatible dimensions.
  - **transpose:** Transpose a given matrix.
  - **determinant:** Compute the determinant of a square matrix.
  - **inverse:** Calculate the inverse of a non-singular square matrix.

## Implementation Details
- **Unified Parsing and Error Handling:** The module reuses the enhanced number parsing logic (including configurable punctuation stripping, NaN normalization, and detailed diagnostics) to ensure consistency across scalar and matrix operations.
- **Operation Logic:** 
  - **Scalar Operations:** All existing arithmetic, statistical, combinatorial, and regression functions are supported as described in the previous CALCULATIONS spec.
  - **Matrix Operations:** Matrix inputs are accepted as JSON-formatted strings. The feature validates matrix dimensions and performs:
    - **Addition:** Element-wise addition of matrices with identical dimensions.
    - **Multiplication:** Standard matrix multiplication respecting dimension constraints.
    - **Transpose:** Swapping rows and columns of the matrix.
    - **Determinant & Inverse:** Using recursive determinant calculation and appropriate inversion algorithms (e.g., Gauss-Jordan elimination) for square matrices.
- **Output Modes:** Consistent with the global JSON and plain text modes. In JSON mode, outputs include metadata (timestamp, tool version, execution duration, input echo).

## Testing & Documentation
- **Unit Tests:** New tests will cover a variety of scalar computations as well as edge cases for matrix operations (including non-conformable matrices and singularity cases).
- **Documentation:** Updates will be made to the README and CLI usage guides. Inline code comments and examples will illustrate how to compute both scalar and matrix operations using the unified CALCULATIONS module.

## Alignment with Repository Mission
Merging MATRIX into CALCULATIONS enhances the repository's analytical capabilities by providing a comprehensive numerical toolkit. This consolidation reduces redundancy, simplifies maintenance, and supports the mission of fostering healthy collaboration through streamlined, modular CLI utilities.
