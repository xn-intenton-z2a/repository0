# Greet Command Feature

## Overview

Extend the CLI to support a new `--greet` option that outputs a personalized greeting message. Users can provide a name via the `--greet` flag and the application will respond with "Hello, <name>!". If no `--greet` flag is provided, the application will preserve its existing behavior of printing the provided arguments.

## Source Changes (src/lib/main.js)

- Import `minimist` to parse CLI arguments.
- Update the `main(args)` function to:
  - Parse the incoming `args` array with `minimist`.
  - Check for a `greet` property in the parsed options.
  - If present, output `Hello, <name>!` to stdout and return the greeting string.
  - Otherwise, fall back to the existing console output of `Run with: [...]` and return that string.

## Testing (tests/unit/main.test.js)

- Add a new unit test to verify that providing the `--greet` option prints the correct greeting message and returns the expected string.
- Ensure existing tests remain passing, including the import and no-error invocation tests.

## Documentation (README.md)

- Document the new `--greet` flag under the CLI usage section.
- Include an example invocation and expected output:

  node src/lib/main.js --greet Alice
  Hello, Alice!

## Dependencies (package.json)

- Ensure `minimist` is listed under dependencies. It is already present, so no changes are required.

## Value and Impact

This feature adds immediate, testable interactivity to the CLI. It demonstrates argument parsing and a simple user-facing behavior, showcasing how the template can be extended with core functionality. It remains a lightweight change achievable in a single repository and aligns with the mission of demonstrating developer workflows.
