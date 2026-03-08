# FIZZBUZZ_EXAMPLES

# Summary

Provide a compact, dependency-free examples module and README usage snippets that demonstrate the canonical FizzBuzz library and its additive helpers. The examples must call the named ESM exports from src/lib/main.js (fizzBuzz, fizzBuzzSingle, fizzBuzzWithWords, fizzBuzzFormatted, fizzBuzzStats, fizzBuzzGenerator) and expose a single programmatic entry point for unit tests and optional CLI execution.

# Specification

- Purpose: Offer authoritative, deterministic examples and short README snippets that show programmatic import, CLI invocation, label overrides, formatted output, statistics, and generator parity, using only the library exports.
- Files to provide or update: README.md (add or extend Usage and Examples snippets) and examples/demo.js (export runExamples and support CLI invocation when executed directly). Do not modify other files.
- Constraints: Examples must be plain ES modules, dependency-free, synchronous, fast, and must not start servers or long-running processes. Import-time side-effects are forbidden; any execution must occur only when runExamples is called or when executed as a script.

# Behavior to demonstrate

- Programmatic import: calling fizzBuzz(15) returns an array whose last element is exactly the string FizzBuzz.
- Single value: calling fizzBuzzSingle(3) returns the string Fizz.
- Custom words: fizzBuzzWithWords(15, { fizz: 'Foo', buzz: 'Bar' }) produces Foo, Bar and FooBar at canonical positions while leaving canonical functions unchanged.
- Formatting: fizzBuzzFormatted(5, formatter) maps each value using the provided formatter and validates formatter must be a function.
- Statistics: fizzBuzzStats(15) returns counts matching a scan of fizzBuzz(15), for example { fizz:4, buzz:2, fizzBuzz:1, numbers:8, total:15 }.
- Generator parity: Array.from(fizzBuzzGenerator(5)) strictly equals fizzBuzz(5).

# API of examples/demo.js

- Export: async function runExamples(options?) where options is optional and may include n (default 15) and words (optional object with fizz and buzz strings).
- Return shape: an object with keys fizzbuzz, single, withWords, formatted, stats, generator where each value is the direct result from the corresponding library export for the provided options.
- CLI behaviour: when examples/demo.js is executed via node, it should call runExamples() with defaults, print a single-line JSON.stringify of { summary: { n, total: results.fizzbuzz.length }, results } to stdout, and exit 0. Importing the module must not print or exit.

# Acceptance criteria

- README.md contains a Usage section with short examples covering programmatic import, CLI invocation, and JSON output for fizzBuzz(15).
- examples/demo.js exists, exports runExamples as specified, and does not perform side-effects on import.
- Unit tests can import examples/demo.js and assert equality between example outputs and direct library calls, for example demo.fizzbuzz equals fizzBuzz(15) and demo.generator equals Array.from(fizzBuzzGenerator(5)).
- The CLI run of examples/demo.js prints a valid single-line JSON summary and exits with code 0 when executed as a subprocess; tests must prefer import-based assertions.
- All example outputs use canonical strings Fizz, Buzz, FizzBuzz and do not alter core library behaviour or validation.

# Testing guidance

- Write unit tests that import runExamples and call runExamples({ n: 15, words: { fizz: 'Foo', buzz: 'Bar' } }) and assert outputs exactly match the results of calling the library exports directly with the same inputs.
- Add unit tests that assert fizzBuzzStats(15) equals the expected counts object and that Array.from(fizzBuzzGenerator(5)) equals fizzBuzz(5).
- Behaviour tests may execute node examples/demo.js as a subprocess to assert exit code 0 and parse stdout JSON, but primary verification should be import-based.

# Implementation notes

- runExamples must call the library exports for computation and must not reimplement FizzBuzz logic.
- Ensure runExamples performs input validation by delegating to the library exports so error types and messages remain canonical and testable.
- Keep the example code minimal and synchronous; use only standard language features so tests run reliably in CI.

# Backwards compatibility

- This feature is additive and does not change any library runtime behaviour when the library is imported normally. Examples are purely demonstrative and testable.
