# API_EXPORTS

Goal

Define the public API surface and minimal consumer contract for the library so other code and the CLI can depend on a stable interface.

Specification

- Export the following named exports from src/lib/main.js: fizzBuzz, fizzBuzzSingle.
- Do not provide a default export for these functions; consumers must import them as named imports.
- The package.json main field points to src/lib/main.js so importing from the package root works.

Usage examples (informational)

- Import example: import { fizzBuzz, fizzBuzzSingle } from './src/lib/main.js'
- README must include a short usage snippet showing the two functions called with example inputs and describing expected return values.

Testing

- Add a unit test that imports the package entry (tests/unit/main.test.js or tests/unit/fizzbuzz.exports.test.js) and asserts the named exports exist and are functions.

Acceptance criteria

- src/lib/main.js has named exports fizzBuzz and fizzBuzzSingle.
- README contains the import example and concise examples demonstrating fizzBuzz(15) and fizzBuzzSingle(7) with expected outcomes described.
- There is a unit test that imports the package entry and verifies the named exports are present and of type function.

Notes

Keep the API minimal; do not expose internal helpers unless justified with tests and documentation.