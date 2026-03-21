# README_EXAMPLES

Summary
Add clear usage examples to README.md demonstrating library and CLI usage so users and tests can verify intended behavior.

Content requirements
- Library usage: show how to import the named exports fizzBuzz and fizzBuzzSingle from src/lib/main.js and describe expected return values for example inputs (for example calling fizzBuzzSingle with 3 yields Fizz; calling fizzBuzz with 15 yields an array of 15 strings ending with FizzBuzz).
- CLI usage: document the npm run start:cli command and the expected simple output for a sample input so reviewers can run the CLI to observe behavior.
- Keep examples short, descriptive and matching real output produced by the implemented functions.

Acceptance criteria
- [ ] README contains both a library usage example and a CLI usage example
- [ ] Examples in README match the implemented behavior and are easy to run locally

Notes
- Do not rely on external tools; examples must work in a fresh clone after installing dev dependencies and running npm test or npm run start:cli as documented.
