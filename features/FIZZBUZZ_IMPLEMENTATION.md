# FIZZBUZZ_IMPLEMENTATION

Purpose

Describe the minimal implementation, CLI integration and test requirements necessary to satisfy the mission and make the library usable in Node and the browser.

Specification

- Library API:
  - Export named functions fizzBuzz and fizzBuzzSingle from src/lib/main.js.
  - Provide small, well-scoped helper functions only if needed (avoid new runtime dependencies).
- CLI behaviour (node src/lib/main.js):
  - When invoked with a numeric argument, print fizzBuzz(n) lines to stdout, one per line.
  - When invoked without args print a usage hint and a short demo (for example fizzBuzz(15)).
  - Invalid CLI input prints a human-friendly error to stderr and exits non-zero.
- Browser/web demo:
  - A minimal example page imports the ESM build and displays fizzBuzz(15) and an input/button to recompute the list with inline validation.

Tests

- Unit tests (tests/unit) must cover:
  - Correct outputs for fizzBuzz and fizzBuzzSingle (including fizzBuzz(15) and single-value checks).
  - Error handling per ERROR_HANDLING feature (TypeError/RangeError cases).
  - CLI behaviour: at least smoke tests for running main() with no args and with invalid args.

Acceptance Criteria

- Named exports fizzBuzz and fizzBuzzSingle exist in src/lib/main.js.
- The CLI prints fizzBuzz results when given a numeric arg and shows demo output without args; invalid input exits non-zero.
- The web demo builds with existing build:web script and displays fizzBuzz(15) with a recompute control.
- Unit tests covering the library API and validation exist and pass in CI.

Notes

- Keep implementation minimal and avoid large refactors; prefer concise, well-tested code.
