# Feature Overview
A command line expression evaluator that parses and computes basic arithmetic expressions. It extends the main function to accept an eval subcommand followed by an expression and prints the result to stdout.

# CLI Usage
Invoke the tool with:
node src/lib/main.js eval "2 + 2 * (3 - 1)"
The output should be:
4

# Implementation Details
Modify src/lib/main.js to inspect the first argument. If it is eval, treat the second argument as an arithmetic expression string. Use a safe evaluation strategy with the Function constructor to parse and compute the result. Validate that the expression contains only numbers, spaces, and the operators + - * / and parentheses. Handle and report syntax errors or invalid tokens with a non-zero exit code.

# Testing
Add unit tests in tests/unit/expression.test.js covering basic operations, operator precedence, parentheses, and invalid input errors. Ensure errors throw and exit codes reflect failure.