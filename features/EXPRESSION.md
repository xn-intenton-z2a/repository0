# EXPRESSION

## Overview
This feature provides an arithmetic expression evaluator that accepts a single string input and returns the computed result. In this update, the evaluator is enhanced to support advanced mathematical functions and constants, enabling users to perform more complex calculations such as trigonometric operations, logarithms with custom bases, and usage of constants like π and e. The evaluator remains safe and sandboxed, using a controlled parsing mechanism to prevent execution of arbitrary code.

## CLI Integration
- **Command Flag:** `--expr`
- **Usage Examples:**
  - Basic arithmetic: `node src/lib/main.js --expr "3 + 4 * (2 - 1)"`
  - Advanced functions: `node src/lib/main.js --expr "sin(pi / 2) + log(10, 10)"`
  - Combined expressions: `node src/lib/main.js --expr "sqrt(16) + cos(0)"`
- **Output Modes:**
  - Standard mode outputs the computed result as plain text.
  - JSON mode (via `--json` or `--json-pretty`) outputs a structured response including metadata such as timestamp, version, executionDuration, and inputEcho.

## Implementation Details
- **Expression Parsing:**
  - The evaluator uses a secure recursive descent parser or an equivalent safe evaluation library to parse the expression string. 
  - In addition to standard arithmetic operators, it supports advanced functions: `sin()`, `cos()`, `tan()`, `log()`, `sqrt()`, and power operations.
  - Recognizes built-in constants: `pi` (π) and `e` (Euler’s number), which are available by default within expressions.
- **Error Handling:**
  - The evaluator detects malformed expressions, division by zero, or invalid function arguments, returning clear error messages.
  - In JSON mode, errors are returned as structured objects with an error field and accompanying metadata.
- **Security Considerations:**
  - The design avoids use of native `eval` by relying on a sandboxed parser. This ensures that only allowed operations are performed.

## Testing & Documentation
- **Unit Tests:**
  - Add tests to verify correct evaluation of expressions with both basic arithmetic and advanced functions.
  - Test error handling for malformed input and edge cases (e.g., division by zero, invalid use of functions).
- **Documentation:**
  - Update README and CLI guides with examples for using advanced expression functionality.
  - Inline comments in the source code explain how extra functions and constants are parsed and processed.

## Alignment with Repository Mission
By extending the EXPRESSION feature to support advanced mathematical functions and constants, the repository enhances its modular CLI tool to cover a broader range of numerical computations. This update continues the mission of promoting streamlined automation and healthy collaboration through self-contained, flexible, and secure utilities.