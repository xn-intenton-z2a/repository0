# DOCS_EXAMPLES

# Summary

Add a compact, testable documentation and examples feature that provides executable usage examples for the canonical FizzBuzz library and centralises example scripts for README and tests. The feature includes: short README usage examples, a small examples/ demo script that exercises named exports (fizzBuzz, fizzBuzzSingle, fizzBuzzWithWords, fizzBuzzFormatted, fizzBuzzStats), and acceptance criteria and test guidance so behaviour tests and reviewers can validate library outputs without changing core library behaviour.

# Specification

- Purpose: Provide authoritative, dependency-free examples and README snippets demonstrating canonical usage patterns: programmatic import, CLI invocation, HTTP handler usage (handler factories), and web demo integration points. Examples must call the library exports rather than reimplement logic.
- Files touched: README.md (add usage examples section), examples/demo.js (executable examples that import src/lib/main.js), and features/FIZZBUZZ_EXAMPLES.md (this spec).
- Constraints: Implementation must be pure JS (no new dependencies), use named ESM imports from src/lib/main.js, and produce deterministic outputs that unit tests can assert exactly. Example scripts must not start servers or long-running processes; they should be small functions that return values or print to stdout and exit quickly.

# Example behaviours to demonstrate

- Import and call fizzBuzz(15) and log the returned array; show JSON.stringify usage for JSON output.
- Import and call fizzBuzzSingle(3) and show console.log output.
- Demonstrate fizzBuzzWithWords(15, { fizz: 'Foo', buzz: 'Bar' }) and show positions of Foo, Bar and FooBar.
- Demonstrate fizzBuzzFormatted(5, (v,i) => `[${i+1}]:${v}`) and show formatted output.
- Demonstrate fizzBuzzStats(15) returning counts matching canonical values.

# Acceptance criteria

- README.md contains a Usage section with at least three short examples: importing the library in code, using the CLI mode invocation, and showing JSON output from fizzBuzz(15).
- examples/demo.js exists (or is updated) with named exports or a main function that returns an object containing results for fizzBuzz(15), fizzBuzzSingle(3), fizzBuzzWithWords(15, {fizz:'Foo',buzz:'Bar'}) and fizzBuzzStats(15). The file must be executable with node examples/demo.js and must exit with code 0 after printing a short summary.
- Unit tests may import examples/demo.js and assert exact values programmatically; the examples must expose functions or exports amenable to imports (avoid running side-effects on import).
- Example outputs use the canonical strings Fizz, Buzz, FizzBuzz in the canonical positions and do not alter core library behaviour.

# Testing guidance

- Add or update unit tests to import examples/demo.js and assert example results equal the outputs from direct calls to the named exports from src/lib/main.js (for example: demo.fizzbuzz === fizzBuzz(15)). Tests must not rely on console output; they should call exported functions from the example script.
- Behaviour tests (optional) may run node examples/demo.js in a subprocess to assert exit code 0 and that stdout contains JSON snippets for the demonstrated values, but primary verification must be achieved by importing example functions directly.
- Keep example code synchronous and fast; avoid network or file system dependencies beyond reading README or printing to stdout.

# Implementation notes

- examples/demo.js should export a single function runExamples() that returns an object with keys: fizzbuzz, single, withWords, stats, formatted. This allows tests to import and assert exact values without side-effects.
- README snippets should be short, copy-pastable, and reference the library entrypoint import path used in this repository (src/lib/main.js). Provide examples for both ESM import and CLI usage (node src/lib/main.js 15 --format=json).
- Do not change existing library exports or validation behaviour; examples must call into the library and reuse validation helpers where parsing is required.

# Backwards compatibility

- This feature is purely documentary and additive. It must not change runtime behaviour of the library when imported; it only adds example scripts and README content.

# Acceptance test checklist (for reviewers)

- README contains Usage examples for programmatic import, CLI and JSON output.
- examples/demo.js exports runExamples and calling it returns the same values as calling the library exports directly for the demonstrated inputs.
- Unit tests import examples/demo.js and assert equality against direct library calls.

