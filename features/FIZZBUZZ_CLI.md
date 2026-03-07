# FIZZBUZZ_CLI

## Summary

Specification for a small CLI wrapper around the core FizzBuzz library. The CLI provides a convenient way to run the fizzBuzz output from the command line and is suitable for small demos and CI checks.

## Motivation

A CLI increases the library's discoverability and makes quick manual verification and demos easier. The project already includes a start:cli script; this feature standardises the CLI behaviour and exit codes.

## Behaviour and usage

- Entrypoint: src/lib/main.js should accept command-line invocation when run as node src/lib/main.js.
- Usage: node src/lib/main.js N
- Output: print each element of fizzBuzz(N) on its own line to stdout.
- Validation:
  - If N is absent or not a numeric integer, print a helpful error message to stderr and exit with code 2.
  - If N is negative, print a clear RangeError-like message to stderr and exit with code 3.
  - Zero should result in no lines printed and exit code 0.
- Exit codes:
  - 0: success
  - 2: invalid usage / type error
  - 3: range error (negative numbers)

## Acceptance criteria

- [ ] Running node src/lib/main.js 15 prints 15 lines matching the standard fizzBuzz sequence and exits 0.
- [ ] Running node src/lib/main.js 0 prints nothing and exits 0.
- [ ] Running without arguments prints usage information to stderr and exits with code 2.
- [ ] Passing a non-integer like 3.5 prints an explanatory message and exits 2.
- [ ] Passing a negative value prints an explanatory message and exits 3.
- [ ] The CLI uses the same library functions (fizzBuzz/fizzBuzzSingle) and does not duplicate core logic.

## Tests (guidance)

Add e2e tests or unit tests that spawn the node process (use child_process.spawnSync) in tests/e2e/ or tests/unit/ as appropriate. Tests should capture stdout, stderr and exit code and assert all acceptance criteria.

## Implementation notes

- Keep CLI logic minimal: parse and validate inputs, call the library, write output, set process.exitCode.
- Ensure no side effects when required as a module (i.e., only run CLI code when invoked directly: if (import.meta.url === process.argv[1] or equivalent pattern).
- Reuse library exports to avoid logic drift and to make unit testing of library separate from CLI behaviour.
