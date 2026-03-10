# USAGE_EXAMPLES

## Overview

Provide concrete, runnable examples that demonstrate the library API and the CLI wrapper so readers of README.md and consumers of examples/ can quickly run and verify fizzBuzz and fizzBuzzSingle behaviour. Examples are supplementary to unit tests and must import and invoke the exported named functions from src/lib/main.js rather than reimplementing logic.

## Specification

- examples/ layout
  - examples/node-example.js: a small Node script that imports the named exports fizzBuzz and fizzBuzzSingle from ../../src/lib/main.js (relative path from examples/) and prints:
    - the fizzBuzzSingle(3) result on one line
    - the fizzBuzz(5) result as one line per entry
    - exit with code 0
  - examples/web-example.html: a single-file HTML demo that imports a small demo module from ../../src/lib/main.js (ES module import) and renders:
    - an input and button for Single mode that displays fizzBuzzSingle(n)
    - an input and button for Range mode that displays fizzBuzz(n) as a numbered list
    - validate inputs in the browser using the same rules as the core library and show inline validation messages without calling the library when invalid

- README.md examples section
  - Add concise usage snippets showing:
    - ES module import and calling fizzBuzz(15) and fizzBuzzSingle(3)
    - Running the CLI: node src/lib/main.js --single 3 and node src/lib/main.js --range 5 and the expected outputs
  - Ensure wording matches exact outputs asserted in unit tests (e.g., fizzBuzzSingle(3) prints Fizz)

- Tests and CI usage
  - Provide a lightweight integration test (tests/unit/examples.test.js) that:
    - spawns node examples/node-example.js and asserts stdout includes Fizz for single and that the third line of range output is Fizz
  - Ensure examples do not require build steps and run directly with node in the repository root

- Implementation constraints
  - Do not add new dependencies
  - Use relative imports to src/lib/main.js so examples run with node as-is
  - Keep examples minimal and focused on demonstrating correct library and CLI usage

## Acceptance criteria

- README.md contains precise usage snippets that mirror unit test expectations.
- examples/node-example.js exists and when run with node prints a single-line Fizz from fizzBuzzSingle(3) and five lines for fizzBuzz(5) where the third line is Fizz.
- examples/web-example.html exists and when opened in a browser (or copied into docs/ by build:web) provides Single and Range controls that show the correct outputs for inputs 3, 5, 15, and 7, and display validation messages for invalid inputs.
- A test tests/unit/examples.test.js spawns examples/node-example.js and asserts stdout and exit code as described.
- Examples import and reuse the exported named functions from src/lib/main.js; no fizzbuzz logic is reimplemented in the examples.

## Implementation notes

- Keep examples minimal and avoid styling or frameworks; the web example should be a small static page that uses plain DOM APIs.
- The node example should be runnable with node examples/node-example.js from the repository root without transpilation.
- The integration test should be lightweight and avoid introducing flakiness: use exact stdout line assertions and deterministic exit codes.

---
