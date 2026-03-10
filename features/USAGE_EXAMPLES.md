# USAGE_EXAMPLES

## Overview

Provide concrete usage examples for the library and CLI so readers of README.md and consumers of examples/ can quickly run and verify fizzBuzz and fizzBuzzSingle behaviour. Examples must demonstrate correct API usage, input validation, and integration with the CLI wrapper described by CLI_INTERFACE.

## Specification

- Create an examples/ subfolder with two runnable examples:
  - node-example: a short Node script demonstrating importing named exports fizzBuzz and fizzBuzzSingle and printing their outputs for sample inputs.
  - web-example: a lightweight HTML page that imports the library (or uses the web demo module) and displays results for representative inputs.
- Update README.md examples section to include concise usage snippets for:
  - Importing the library via ES modules and calling fizzBuzz(15) and fizzBuzzSingle(3).
  - Running the CLI: node src/lib/main.js --single 3 and node src/lib/main.js --range 5 and what to expect.
- Examples must avoid using external build steps; the node example must run with node directly and the web example must be copyable into docs/ by the build:web pipeline.

## Acceptance criteria

- README.md contains usage snippets showing how to import named exports and how to run the CLI with expected outputs described.
- examples/node-example.js exists and runs with node to print expected lines for the demonstrated inputs.
- examples/web-example.html exists and, when copied into docs/, shows the same demo outputs for the same sample inputs when opened in a browser.
- Examples use the exported named functions rather than reimplementing fizzBuzz logic.
- Unit tests remain the authoritative verification of behaviour; examples are supplementary and must reflect the same behaviour asserted in tests.

## Implementation notes

- Keep examples minimal and focused on demonstrating correct library and CLI usage. Avoid adding new devDependencies. Prefer relative imports against src/lib/main.js so examples run in the repository root with node and the static build script.

---
