# EXPRESSION

## Overview
This feature adds a new CLI command `--expression` to evaluate complete mathematical expressions. Unlike the individual arithmetic commands (such as `--sum` or `--multiply`), this command allows users to input a full expression (e.g., `2 + 3 * (4 - 1)`) and receive the calculated result. This enhances the usability of the CLI tool by offering a flexible, single-command evaluation of arithmetic expressions.

## Implementation Details
- **Command Integration:**
  - Add a new flag `--expression` to the CLI command mapping in `src/lib/main.js`.
  - When invoked, the command will combine all provided arguments into a single expression string.

- **Expression Parsing and Evaluation:**
  - Validate the expression to ensure it contains only numbers, whitespace, and allowed arithmetic operators (`+`, `-`, `*`, `/`, `%`) as well as parentheses.
  - Use a safe evaluation mechanism (for example, via a carefully constructed Function constructor after sanitizing input) to compute the result. Avoid using `eval` directly without proper validation to prevent security risks.
  - If the expression is invalid or contains disallowed characters, return a clear error message: "Error: Invalid expression provided.".

- **Error Handling & Validation:**
  - If no expression is provided, output an error message indicating that an expression is required.
  - Ensure that any exceptions during expression evaluation (such as division by zero) are caught and relayed as standardized error messages.

## Testing & Documentation
- **Unit Tests:**
  - Create tests that pass valid expressions to verify that the correct result is computed.
  - Include tests for invalid inputs (e.g., containing letters or disallowed symbols) to confirm that appropriate error messages are returned.
  - Test edge cases, such as expressions with extra whitespace or nested parentheses.

- **Documentation:**
  - Update the README and CLI usage documentation to include examples and usage instructions for the new `--expression` command.
  - Include inline code comments in the source file to document the parsing, validation, and evaluation logic.

## Alignment with Repository Mission
This feature contributes to the repository's mission by expanding the toolset available in a modular, single-source file. It promotes healthy collaboration by enabling quick and effective computational evaluations directly from the command line, reinforcing the focus on practical automation and diagnostics.