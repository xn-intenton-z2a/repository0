# EXPORTS_AND_API

Purpose

Define how the library is exported and consumed so downstream code and the website can import the functions reliably.

Behavior

- Export both functions as named ES module exports from src/lib/main.js.
- The package.json main entry already points to src/lib/main.js; implementations must keep the file as the canonical entrypoint for library consumers and CLI entry.
- Provide clear examples in README showing how to import both functions using import { fizzBuzz, fizzBuzzSingle } from './src/lib/main.js' or from the package when published.

Acceptance criteria

- Both fizzBuzz and fizzBuzzSingle are named exports of src/lib/main.js and can be imported via ES module syntax.
- The project start:cli script (node src/lib/main.js) should continue to run without crashing when the exports exist (no runtime import errors).
- README contains at least one import example demonstrating named imports and the expected outputs for fizzBuzz(15) and fizzBuzzSingle(3).
