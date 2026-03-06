# FIZZBUZZ_CLI

Summary

A companion feature that provides a minimal, dependency-free command-line interface to the FizzBuzz library. The CLI offers a quick developer/demo UX and a small set of end-to-end tests that exercise the public library behavior via node invocation.

Goals

- Provide a CLI entrypoint implemented in src/lib/main.js (or a thin wrapper that delegates to the library) supporting:
  - --single N or a single positional integer to print fizzBuzzSingle(N) to stdout.
  - --range N or a single positional integer to print fizzBuzz(N) as one value per line (1..N replacements applied).
  - Optional flags: --one-per-line to force line-separated output, default may be one-per-line for readability.
  - Proper exit codes: 0 for success, non-zero for invalid input with explanatory message to stderr.
- Add lightweight e2e tests that spawn node to run the CLI and assert stdout, stderr, and exit codes.
- Document CLI usage with brief examples in README.md and examples/ directory.

Usage

- node src/lib/main.js --single 3  -> prints Fizz and exits 0
- node src/lib/main.js --range 15   -> prints 15 lines, last line is FizzBuzz
- node src/lib/main.js 3           -> prints Fizz (positional treated as single)

Input validation and behavior

- CLI must reuse library validation: negative inputs -> exit non-zero and write an error to stderr; non-integers and non-finite values -> exit non-zero with explanatory stderr.
- For zero range, CLI prints nothing and exits 0.
- CLI implementation must not add external dependencies and should keep parsing simple using process.argv.

Testing and Acceptance Criteria

E2E tests should be located under tests/e2e or tests/unit and include:

- node src/lib/main.js --single 3 prints "Fizz" to stdout and exits with code 0.
- node src/lib/main.js --range 15 prints exactly 15 non-empty lines and the final line equals "FizzBuzz".
- node src/lib/main.js 15 --one-per-line prints 15 lines identical to the --range behavior.
- Invalid inputs (e.g., -1, 3.5, NaN) cause non-zero exit and write a helpful message to stderr.

Acceptance checklist:

- CLI prints expected results for single and range modes.
- CLI exits with appropriate codes and messages for invalid input.
- README contains brief CLI examples.
- E2E tests pass via npm test.

Implementation notes

- Implement argument parsing manually (process.argv) and delegate core logic to fizzBuzz and fizzBuzzSingle named exports.
- Keep the CLI thin and ensure messages and exit codes match the library semantics.
- Use child_process.spawnSync in tests to run node and capture stdout/stderr for assertions.

Compatibility

This feature complements FIZZBUZZ_CORE, does not change the core API, and is achievable entirely inside the repository's single-file library and tests. It supports the project's mission by improving developer UX and providing end-to-end verification of library behaviour.
