# HAMMING_EXAMPLES

Purpose
Provide clear, consumable examples for library consumers and CLI users so the core behaviours are trivially reproducible and demonstrable in documentation and examples/.

Scope
- Add an "API Examples" section to README.md that shows how to call the exported functions and the expected results.
  - Example descriptions should demonstrate importing the named exports and calling the functions with simple inputs such as karolin and kathrin to produce 3, and numeric inputs 1 and 4 to produce 2.
- Add a "CLI Usage" section to README.md showing the two modes:
  - string mode: node src/lib/main.js string karolin kathrin  prints 3
  - bits mode: node src/lib/main.js bits 1 4  prints 2
- Create two example files under examples/ (examples/api.md and examples/cli.md) that replicate the README examples and can be shown on the project website.

Acceptance Criteria
- README.md contains an "API Examples" section with the described examples and a separate "CLI Usage" section showing the command lines and their expected numeric outputs.
- examples/api.md exists and demonstrates the API usage with the same example values.
- examples/cli.md exists and demonstrates the CLI usage with the same example invocations and outputs.
- Examples are short, unambiguous, and require no extra configuration to reproduce in a local repo clone.

Notes
- Keep examples descriptive rather than long; a single representative example per mode is sufficient.
