# Overview
This feature adds a new CLI command called eval which allows users to input a simple arithmetic expression and have it evaluated. The command accepts an expression string consisting solely of numbers, spaces, and the operators +, -, *, and /. The evaluation is performed after first validating that the expression only contains these permitted characters.

# Implementation
- In src/lib/main.js, add a new command branch for "eval". When the first argument is "eval", join the remaining arguments into an expression string.
- Validate the expression using a regular expression to allow only digits, whitespace, and operators (+, -, *, /, and parentheses for grouping if needed).
- Use a safe evaluation method, for example by using the Function constructor in a controlled manner after validation, to compute the result.
- Log the result of the evaluation. If the validation fails, or evaluation encounters an error, print the help message.
- Update tests in tests/unit/main.test.js to simulate the eval command with valid expressions (e.g. "eval 3+4*2") and invalid expressions. Verify that the output returns the correct value or a help message when inputs are invalid.
- Update the README.md to document the new "eval" command including usage examples. Add a section outlining the allowed characters and examples of arithmetic expressions.

# Benefits
- Provides users with a quick, built-in arithmetic evaluator for simple expressions, enhancing the CLI's functionality.
- Maintains alignment with the repository mission to offer handy CLI utilities in Node.js.
- Leverages existing CLI command handling practices, ensuring consistency with other commands like gcd, lcm, and isprime.
