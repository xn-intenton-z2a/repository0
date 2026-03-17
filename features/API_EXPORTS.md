# API_EXPORTS

Goal

Specify the public API surface for the library and how it should be consumed by other code and by the CLI entrypoint.

Exports

- The package must export fizzBuzz and fizzBuzzSingle as named exports from src/lib/main.js.
- Do not provide a default export for these functions; consumers should use named imports.
- The package.json `main` points to src/lib/main.js so consumers can import from the package root.

CLI and examples

- A simple CLI mode is acceptable but optional; the project includes a start:cli script that runs src/lib/main.js.
- README must include concise usage examples showing:
  - Importing the functions: import { fizzBuzz, fizzBuzzSingle } from './src/lib/main.js'
  - Calling the functions and the expected return values for the examples used in acceptance tests.

Test file

- Tests that assert the API surface must live in tests/unit/main.test.js and include at least one test that imports the module and asserts the named exports exist.

Acceptance criteria

- Named exports fizzBuzz and fizzBuzzSingle exist and are exported from src/lib/main.js.
- README includes the import example and two short examples demonstrating fizzBuzz(15) and fizzBuzzSingle(7).
- tests/unit/main.test.js contains a test that imports the package entry and verifies the named exports are present.

Notes

Do not expose internal helpers beyond the two required functions unless there is a compelling reason and accompanying tests.