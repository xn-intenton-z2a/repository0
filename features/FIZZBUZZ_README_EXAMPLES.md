# FIZZBUZZ_README_EXAMPLES

## Summary
Improve README.md with concise usage examples that demonstrate the named exports, the CLI usage, and the expected outputs so new users can quickly verify the library behavior and run the examples locally.

## Goals
- Add usage examples for both library and CLI use cases to README.md.
- Ensure examples demonstrate correct handling of edge cases (0, negative, non-integer) and show expected thrown errors in prose form rather than verbatim stack traces.
- Keep examples short and focused on quick verification steps.

## Behavior
- README will show how to import the named exports from src/lib/main.js and call both fizzBuzz and fizzBuzzSingle.
- README will include a brief CLI usage snippet describing how to run the CLI with and without --json and what to expect.
- Examples should avoid long code blocks and rather show command usage and expected plain-text output lines.

## Acceptance Criteria
- [ ] README shows how to import and call fizzBuzz and fizzBuzzSingle and demonstrates the expected results for n = 15 and n = 7.
- [ ] README documents CLI usage with examples for normal output and --json.
- [ ] README mentions the error types thrown for invalid inputs and how they map to exit codes for the CLI.

---

Notes for contributors: keep examples compatible with the project scripts; update package.json scripts only if necessary and document any changes in the README.