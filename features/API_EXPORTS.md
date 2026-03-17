# API_EXPORTS

Goal

Specify the public API surface for the library and how it should be consumed by other code and by the CLI entrypoint.

Exports

- The package must export fizzBuzz and fizzBuzzSingle as named exports from src/lib/main.js.
- The default module entry (package.json `main`) points to src/lib/main.js so consumers can import from the package root.

CLI and examples

- A simple CLI mode is acceptable but optional; the project already includes a start:cli script that runs src/lib/main.js.
- README must include concise usage examples showing:
  - Importing the functions: import { fizzBuzz, fizzBuzzSingle } from './src/lib/main.js'
  - Calling the functions and the expected return values for the examples used in acceptance tests.

Acceptance criteria

- Named exports exist and are documented in README.
- README includes the minimal usage examples described above (import line and two short examples showing fizzBuzz(15) and fizzBuzzSingle(7)).

Notes

Do not expose internal helpers beyond the two required functions unless there is a compelling reason and tests for them.