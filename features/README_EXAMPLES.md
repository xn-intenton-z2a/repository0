# README_EXAMPLES

Summary
Update README.md to document usage examples for both exports and how to run the test suite and CLI.

Motivation
Clear documentation helps users and automated workflows verify the library quickly and demonstrates expected behaviour.

Specification
- Include a short usage example showing how to import the named exports and call them, and the expected output for a few calls.
- Include instructions for running the unit tests with npm test and an example command for the CLI entry (node src/lib/main.js 15).
- Keep examples minimal and copy-paste friendly; avoid complex surrounding text.

Acceptance criteria
- README.md contains an import example and short demonstration of fizzBuzz(15) and fizzBuzzSingle(3).
- README.md includes the test command and a one-line CLI usage example.
