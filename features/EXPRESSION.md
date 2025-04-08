# EXPRESSION

## Overview
This feature enhances the CLI's mathematical capabilities by unifying the evaluation of arithmetic expressions and operations on complex numbers. Users can input full mathematical expressions (e.g. `2 + 3 * (4 - 1)`) to get real-number results, or specify complex numbers in the form `a+bi` (or `a-bi`) to perform arithmetic operations such as addition, subtraction, multiplication, and division. This consolidated approach simplifies the interface by providing a single command to handle both real and complex calculations while aligning with the repository's mission of promoting modular, self-contained automation.

## Implementation Details
### Real Expression Evaluation
- **Command Integration:**
  - Add a CLI flag `--expression` that accepts one or more parameters. All provided arguments are concatenated to form a single expression string.
  - Validate the expression to ensure only numbers, allowed arithmetic operators (`+`, `-`, `*`, `/`, `%`), whitespace, and parentheses are present.

- **Evaluation Logic:**
  - Use a safe evaluation mechanism (e.g. via a sanitized Function constructor) to compute the result of the expression.
  - If the expression is invalid or contains disallowed characters, return an error: "Error: Invalid expression provided.".

### Complex Number Operations
- **Unified Mode:**
  - Extend the `--expression` command to detect complex number inputs using regular expressions matching the format `a+bi` or `a-bi`.
  - When the expression includes complex numbers, support operations such as:
    - **Addition & Subtraction:** Separately process real and imaginary parts.
    - **Multiplication:** Use the formula: (a+bi)*(c+di) = (ac - bd) + (ad+bc)i.
    - **Division:** Compute using the conjugate, ensuring division by zero is handled by returning a clear error message.

- **Input Parsing & Validation:**
  - Parse complex number strings using regular expressions to extract the real and imaginary components.
  - If the format is incorrect, output a standardized error message: "Error: Invalid complex number format. Expected format a+bi or a-bi.".

## Error Handling & Validation
- Use standardized error messages when inputs are missing or invalid.
- Ensure exceptions (such as division by zero or syntax errors) are caught and relayed with clear error messages.

## Testing & Documentation
- **Unit Tests:**
  - Add tests for valid real expressions, complex arithmetic operations, and error conditions (e.g. invalid syntax, malformed complex numbers).
- **Documentation:**
  - Update the README and CLI usage docs with usage examples, for instance:
    - Real Expression: `node src/lib/main.js --expression "2 + 3 * (4 - 1)"`
    - Complex Addition: `node src/lib/main.js --expression "3+2i + 1-4i"`
  - Inline comments in the source file should document the enhanced parsing logic for distinguishing real and complex expressions.

## Alignment with Repository Mission
By merging real expression evaluation with complex arithmetic into a single, versatile command, this feature reinforces the repository’s mission of providing streamlined, modular CLI utilities that enable healthy collaboration and practical automation in a single-source file environment.