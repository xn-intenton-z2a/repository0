# README_EXAMPLES

Summary

Specify required README examples demonstrating library usage from both code and the command line so users can verify behaviour quickly.

Specification

- README must include a short import example showing how to import named exports fizzBuzz and fizzBuzzSingle and call them with expected results.
- README must show a CLI example demonstrating invoking node src/lib/main.js with a single numeric argument and the expected console output for 15.
- README must link to the unit tests and briefly describe error behaviour for invalid inputs.

Acceptance Criteria

- README includes an example of importing and using fizzBuzz and fizzBuzzSingle with at least one usage that matches the acceptance tests.
- README includes a CLI usage example showing the printed sequence for 15 or a reference to running npm run start:cli.
- README clearly documents the input validation behaviour and points readers to tests for exact expectations.

Implementation Notes

- Keep examples minimal and copyable. Do not duplicate long sequences; show one canonical example and link to tests for exhaustive cases.
