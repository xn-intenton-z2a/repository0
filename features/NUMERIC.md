# NUMERIC

## Overview
This feature consolidates various arithmetic, statistical, combinatorial, and complex number operations into a unified numerical utilities module within the CLI tool. Building on existing capabilities such as basic arithmetic (addition, subtraction, multiplication, division, modulo), advanced statistical computations (median, mode, standard deviation, percentile, geometric mean, variance, Fibonacci, GCD, LCM, and prime detection), and complex number arithmetic, the module is now extended to include basic calculus operations. These additions enable users to perform numerical differentiation and integration directly from the CLI.

## CLI Integration
- **Basic Operations**
  - Commands such as `--sum`, `--subtract`, `--multiply`, `--divide`, and `--modulo` continue to handle standard arithmetic operations on real numbers.
- **Advanced Mathematical Commands**
  - Existing commands like `--power`, `--factorial`, `--sqrt`, `--median`, `--mode`, `--stddev`, `--percentile`, and `--geomean` remain available.
- **Complex Number Operations**
  - New sub-commands, such as `--cadd`, `--csubtract`, `--cmultiply`, `--cdivide`, `--cabs`, and `--cconj`, allow algebraic operations on complex numbers provided in standard form (e.g., `3+4i`).
- **Calculus Operations (New Additions)**
  - **Numerical Differentiation (`--derivative`):**
    - **Usage:** `node src/lib/main.js --derivative "f(x)" x [h]`
    - **Description:** Computes the derivative of a mathematical function at a point using finite difference methods. The function expression is evaluated at the specified point `x` with an optional small step `h` (default set to a small constant if omitted).
  - **Numerical Integration (`--integrate`):**
    - **Usage:** `node src/lib/main.js --integrate "f(x)" a b [n]`
    - **Description:** Approximates the definite integral of the function `f(x)` over the interval `[a, b]` using Simpson's rule. An optional parameter `n` specifies the number of sub-intervals (default provided when omitted).

## Implementation Details
- **Operation Logic:**
  - **Arithmetic & Statistics:** All existing operations continue as previously defined, ensuring backward compatibility.
  - **Complex Number Parsing:** The module includes a dedicated parser to identify and separate the real and imaginary components of inputs formatted as `a+bi` or `a-bi`.
  - **Calculus Functions:**
    - For **differentiation**, the module uses a finite difference formula (e.g., `(f(x+h) - f(x-h)) / (2*h)`) to estimate the derivative at point `x`.
    - For **integration**, Simpson's rule is applied to calculate the approximate area under the curve over the interval `[a, b]`, with `n` sub-intervals ensuring accuracy.
- **Input Validation & Error Handling:**
  - For standard numeric, complex, and calculus operations, the module validates input formats, provides clear error messages if parsing fails, and ensures safe handling (e.g., division by zero, invalid function expressions, or non-numeric tokens).
  - In calculus operations, the function expression is limited to simple arithmetic expressions (using a safe evaluation method) to avoid security risks normally associated with dynamic evaluation.

## Testing & Documentation
- **Unit Tests:**
  - New tests will verify correct parsing and computation for numerical differentiation and integration. Test cases include typical functions (e.g., polynomial, trigonometric functions) along with edge cases and error conditions.
  - Existing tests for arithmetic, complex number operations, and statistical functions ensure backward compatibility.
- **Documentation:**
  - The README, CLI usage guides, and inline code comments will be updated to include examples for the new calculus operations. Usage examples include:
    - Derivative: `node src/lib/main.js --derivative "x^2 + 3*x - 5" 2 0.001`
    - Integral: `node src/lib/main.js --integrate "sin(x)" 0 3.14 100`

## Alignment with Repository Mission
By extending the NUMERIC module to include calculus operations, this update broadens the repository’s mathematical toolkit without introducing excessive complexity. It supports streamlined automation and healthy collaboration by providing a self-contained, modular approach to numerical analysis, consistent with the repository’s mission of offering practical, easy-to-integrate CLI utilities.