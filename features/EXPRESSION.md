# EXPRESSION

## Overview
This feature introduces an arithmetic expression evaluator to the CLI tool. In contrast to flag-based arithmetic operations, this module allows users to input a mathematical expression as a single string (e.g., "3 + 4 * (2 - 1)") and receive the evaluated result. This capability adds flexibility for users who prefer conventional expressions and further consolidates our numerical utilities under one cohesive interface.

## CLI Integration
- **Command Flag:** Introduce a new flag `--expr` that accepts an expression string as its argument.
- **Usage Examples:**
  - `node src/lib/main.js --expr "3 + 4 * (2 - 1)"`
  - This command will parse the expression, evaluate it, and output the result in plain text or JSON (if global JSON flags are provided).
- **Output Modes:**
  - Standard mode returns the computed result directly.
  - JSON mode (activated with `--json` or `--json-pretty`) returns a structured JSON object including metadata (timestamp, version, executionDuration, inputEcho).

## Implementation Details
- **Expression Parsing:**
  - The feature will use a secure, sandboxed evaluation mechanism (such as a recursive descent parser or an existing library) to safely interpret the arithmetic expression.
  - Supported operations include addition (+), subtraction (-), multiplication (*), division (/), modulo (%), and nested expressions with parentheses.
- **Error Handling:**
  - The evaluator will detect malformed expressions, division by zero, or unsupported characters, and return clear error messages.
  - When in JSON mode, errors will be output as JSON objects with an error field.
- **Security Considerations:**
  - The evaluator will avoid using dangerous operations (e.g., the raw `eval` function) by either using a safe library or implementing a minimal parsing logic.

## Testing & Documentation
- **Unit Tests:**
  - Create tests that cover both valid expressions (e.g., testing operator precedence and parentheses) and invalid inputs (syntax errors, division by zero).
  - Tests will verify correct behavior in both plain text and JSON output modes.
- **Documentation:**
  - The README and HELP sections of the CLI will be updated to include usage examples and details about the expression evaluation mode.
  - Inline code comments and documentation will explain the core evaluation functions.

## Alignment with Repository Mission
The EXPRESSION feature enriches the repository’s CLI tool by extending its numerical capabilities. It provides an intuitive way to perform complex calculations in a single command, aligning with our mission to promote streamlined automation and healthy collaboration with simple, modular, and self-contained utilities.