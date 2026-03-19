# EXPORTS_AND_API

Purpose

Define the public module surface so consumers (library users, website, tests and CLI) can import and run the FizzBuzz functions reliably.

API contract

- The project exports two named ES module exports from src/lib/main.js:
  - fizzBuzz
  - fizzBuzzSingle
- Both exports accept a single argument and behave as specified in FIZZBUZZ_CORE and INPUT_VALIDATION.

Consumer examples (informational)

- Import as named exports from the package or directly from the source file (ES module): import { fizzBuzz, fizzBuzzSingle } from 'repo' or from './src/lib/main.js' in local demos.
- The CLI entry (npm run start:cli -> node src/lib/main.js) should not crash when the module provides these named exports; the CLI may import and invoke fizzBuzzSingle for quick demos.

Acceptance criteria (testable)

- src/lib/main.js exports fizzBuzz and fizzBuzzSingle as named exports.
- Importing these names using ES module syntax does not throw at runtime.
- The README contains at least one import example showing named imports and demonstrates expected outputs for fizzBuzz(15) and fizzBuzzSingle(3).
