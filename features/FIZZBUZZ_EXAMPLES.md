# FIZZBUZZ_EXAMPLES_AND_STATS

# Summary

Provide compact, testable documentation and example code that demonstrates the canonical FizzBuzz library and the library's additive helpers, with special emphasis on statistics and generator helpers. This feature expands the existing examples to ensure runExamples explicitly exercises: fizzBuzz, fizzBuzzSingle, fizzBuzzWithWords, fizzBuzzFormatted, fizzBuzzStats, and fizzBuzzGenerator so unit and behaviour tests can assert canonical outputs and counts without requiring duplicate logic.

# Specification

- Purpose: Offer authoritative, dependency-free examples and README snippets demonstrating canonical usage patterns: programmatic import, CLI invocation, HTTP handler usage (handler factories), web demo integration points, and explicit stats/generator usage. Examples must call the library exports rather than reimplement logic.
- Files touched: README.md (add Usage and Examples snippets), examples/demo.js (executable examples that import src/lib/main.js and export runExamples), and features/FIZZBUZZ_EXAMPLES.md (this spec updated).
- Constraints: Implementation must be pure JS (no new dependencies), use named ESM imports from src/lib/main.js, and produce deterministic outputs that unit tests can assert exactly. Example scripts must not start servers or long-running processes; they should be small functions that return values or print to stdout and exit quickly.

# Example behaviours to demonstrate

- Import and call fizzBuzz(15) and show JSON.stringify usage for JSON output, asserting the last element is exactly "FizzBuzz".
- Import and call fizzBuzzSingle(3) and show console.log output for "Fizz".
- Demonstrate fizzBuzzWithWords(15, { fizz: 'Foo', buzz: 'Bar' }) and show that Foo, Bar and FooBar appear at canonical positions.
- Demonstrate fizzBuzzFormatted(5, (v,i) => `[${i+1}]:${v}`) and show formatted output for small n.
- Demonstrate fizzBuzzStats(15) returning an object with counts matching a scan of fizzBuzz(15) (for example { fizz:4, buzz:2, fizzBuzz:1, numbers:8, total:15 }).
- Demonstrate Array.from(fizzBuzzGenerator(5)) equals fizzBuzz(5) to show generator parity with the array-based API.

# Acceptance criteria

- README.md contains a Usage section with short examples: programmatic import from src/lib/main.js, CLI mode invocation example, and JSON output sample for fizzBuzz(15).
- examples/demo.js exists and exports a single function runExamples() which returns an object with keys: fizzbuzz, single, withWords, formatted, stats, generator. Values must be the direct outputs from the named exports in src/lib/main.js (no duplicated logic).
- Unit tests can import examples/demo.js and assert that demo.fizzbuzz equals fizzBuzz(15), demo.single equals fizzBuzzSingle(3), demo.withWords equals fizzBuzzWithWords(15, {fizz:'Foo',buzz:'Bar'}), demo.stats equals fizzBuzzStats(15), and demo.generator equals Array.from(fizzBuzzGenerator(5)).
- examples/demo.js when executed via node examples/demo.js prints a short JSON summary and exits with code 0; execution is optional for unit tests and must not run on import.
- Example outputs must use canonical strings Fizz, Buzz, FizzBuzz and must not alter core library behaviour or validation.

# Testing guidance

- Unit tests should import named exports from src/lib/main.js and examples/demo.js and assert exact equality between example outputs and direct library calls (for deterministic testing, avoid relying on console output).
- Add unit tests that assert fizzBuzzStats(15) equals the expected counts object and that Array.from(fizzBuzzGenerator(5)) strictly equals fizzBuzz(5).
- Behaviour tests may run node examples/demo.js as a subprocess to verify exit code 0 and that stdout contains a parsable JSON summary, but primary verification must be import-based assertions in unit tests.
- Keep example code synchronous and fast; avoid network or file system dependencies beyond printing a short summary when run as a script.

# Implementation notes

- examples/demo.js must export runExamples() and must not perform side-effects at import time. runExamples() should accept an optional options object to control n and words for local testing.
- runExamples({ n: 15, words: { fizz: 'Foo', buzz: 'Bar' } }) -> returns the canonical outputs and stats so tests can supply alternate inputs.
- When run as a script (node examples/demo.js) the file should call runExamples() with default values, print JSON.stringify({ summary: { n, total: results.fizzbuzz.length }, results }) and exit 0.
- Examples must use only the public named ESM exports from src/lib/main.js; no duplicate or reimplemented FizzBuzz logic is permitted.

# Backwards compatibility

- This update is additive and preserves all prior example requirements while adding explicit stats and generator demonstration. It does not change any library runtime behaviour when imported.

# Acceptance test checklist (for reviewers)

- README contains Usage examples for programmatic import, CLI usage and JSON output for fizzBuzz(15).
- examples/demo.js exports runExamples and calling it returns values identical to calling the library exports directly for the demonstrated inputs.
- Unit tests include assertions for fizzBuzzStats counts and generator parity and pass in CI.
- Behaviour tests (optional) can run examples/demo.js and parse the printed JSON summary to confirm exit code 0 and expected shape.

