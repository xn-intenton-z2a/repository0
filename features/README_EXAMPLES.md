# README_EXAMPLES

Purpose

Ensure the repository README documents library usage, the CLI, and includes minimal examples for both library and command-line usage so new users can exercise the project quickly.

Behavior

- README should include concise examples for the named exports fizzBuzz and fizzBuzzSingle showing typical usage and expected output.
- README should include an example of the CLI usage (node src/lib/main.js --n 15 and node src/lib/main.js --single 3) and the expected console output for both text and JSON formats.
- Examples should avoid long code blocks; include only the minimal commands or snippets required to reproduce output.

Implementation notes

- Update README.md in the repository root with a short "Usage" section containing:
  - Library example: import { fizzBuzz, fizzBuzzSingle } from './src/lib/main.js' and a tiny snippet showing fizzBuzzSingle(3) -> Fizz and fizzBuzz(5) -> ["1","2","Fizz","4","Buzz"].
  - CLI example: node src/lib/main.js --n 15 (text) producing lines ending with FizzBuzz, and node src/lib/main.js --n 15 --format json producing a JSON array.
  - Edge-case notes: mention behavior for 0, negative, and non-integer inputs.

Acceptance criteria

- README contains a Usage section with at least one library example and one CLI example.
- The examples are accurate with respect to the mission acceptance criteria (fizzBuzz(15) ends with FizzBuzz; fizzBuzzSingle(3) -> Fizz; fizzBuzzSingle(5) -> Buzz; fizzBuzzSingle(7) -> 7; fizzBuzz(0) -> []).
- The README notes expected error behavior for negative and non-integer inputs.
- The feature file is distinct from CORE_FIZZBUZZ, EDGE_CASE_TESTS, and FIZZBUZZ_CLI and complements them by targeting documentation and examples.
