# USAGE_EXAMPLES

## Overview

Provide minimal, runnable examples that demonstrate the library API and CLI using only the repository source so readers and CI can validate behaviour without a build step.

## Specification

- examples/ layout (files under examples/)
  - examples/node-example.js
    - Import { fizzBuzz, fizzBuzzSingle } from ../../src/lib/main.js (relative path from examples/).
    - Print the result of fizzBuzzSingle(3) as a single line (expected output: Fizz\n).
    - Print the result of fizzBuzz(5) as five lines (each entry on its own line), so the third output line equals Fizz.
    - Exit with process.exit(0).
  - examples/web-example.html
    - A single-file HTML page using a small inline script that imports the library from ../../src/lib/main.js (ES module) and exposes:
      - Single mode: input + button to display fizzBuzzSingle(n) in a result area.
      - Range mode: input + button to display fizzBuzz(n) as a numbered list.
    - Validate inputs in the browser per FIZZBUZZ_CORE rules and show inline validation messages; do not call library when input is invalid.

- README.md examples
  - Add concise snippets showing ES module import and exact expected outputs for fizzBuzzSingle(3) and fizzBuzz(15).
  - Document CLI invocations with expected stdout lines for --single and --range modes.

- Tests
  - Add tests/unit/examples.test.js which spawns node examples/node-example.js and asserts:
    - stdout first line equals Fizz (with trailing newline) and exit code 0.
    - stdout third line equals Fizz for the 5-line range output.
  - Examples run without transpilation or build steps using node from repository root.

## Acceptance criteria

- README.md contains snippets that exactly match the outputs produced by examples/node-example.js and the unit tests.
- examples/node-example.js runs with node and prints a single-line Fizz followed by five lines for fizzBuzz(5) where the third line is Fizz, exit 0.
- examples/web-example.html provides Single and Range controls for inputs 3, 5, 7 and 15 and displays validation messages for invalid inputs.
- tests/unit/examples.test.js spawns the node example and asserts exact stdout bytes and numeric exit code.

## Implementation notes

- Keep examples dependency-free and use relative imports to src/lib/main.js.
- Avoid visual styling; focus on behaviour and testability.
- Do not reimplement fizzbuzz logic in examples; import and reuse core exports.
