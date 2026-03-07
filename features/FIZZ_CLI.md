# FIZZ_CLI

# Summary

Provide a small command-line wrapper that exposes the library as a CLI utility. Allow users to run FizzBuzz from the command line, specifying n and optional flags for the options extension (custom divisors and simple range syntax). The CLI is primarily an ergonomic convenience and demonstration of library usage.

# Motivation

A CLI helps developers quickly sanity-check the library, demonstrates practical usage, and provides a simple example for the website and README. It also aids manual verification during development.

# Scope

In-scope:
- A CLI entrypoint implemented in src/lib/main.js that runs when invoked via npm run start:cli or node src/lib/main.js.
- Accepts positional argument n (integer) and optional flags:
  - --divisor D:LABEL (can be provided multiple times) to add a divisor and label pair.
  - --range START:END to output only that inclusive range.
  - --format json|lines to choose output format (default lines).
- CLI must reuse the library functions and honor the FIZZ_OPTIONS behaviour when flags are provided.

Out-of-scope:
- Advanced CLI frameworks or interactive prompts.

# CLI behaviour

- Example: node src/lib/main.js 15
  - Prints fizzBuzz(15) one per line.
- Example: node src/lib/main.js 15 --divisor 7:Sev --format json
  - Prints JSON array including Sevs where applicable.
- Invalid inputs print a helpful message to stderr and exit with non-zero code.

# Tests

- Unit tests or small e2e tests should assert CLI exit codes and sample outputs using spawn or child_process.
- Test that default invocation produces expected lines for known inputs, and that divisor flags modify output as expected.

# Documentation

- README should include a CLI usage section with examples and note that the CLI is a thin wrapper over the library.

# Acceptance Criteria

- CLI runs with node src/lib/main.js <n> and prints results in lines by default.
- Flags --divisor and --range influence output according to FIZZ_OPTIONS semantics.
- CLI exits non-zero on error and prints human-friendly error messages.
- CLI examples exist in README.