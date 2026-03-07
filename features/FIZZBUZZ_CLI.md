# FIZZBUZZ_CLI

## Overview
Add a small command-line interface surface to the existing library so users can run fizzBuzz and fizzBuzzSingle from the terminal using node. The CLI should be implemented in src/lib/main.js (or exported helpers there) and wired to the npm script start:cli.

## Specification
- Provide a CLI mode that accepts a subcommand or flag to select single or range mode and an integer argument.
- Single mode returns the fizzBuzzSingle value for the provided integer. Range mode returns the array output for fizzBuzz up to the provided integer, printed as one-per-line.
- Validate arguments and surface clear error messages for invalid input.

## Tests
- Add unit tests that simulate CLI invocation (where feasible) or directly call the exported helpers to validate behaviour and error messages.

## Acceptance Criteria
- The start:cli script runs without runtime errors and a user can request fizzBuzzSingle and fizzBuzz outputs.
- CLI input errors (non-integer, negative) produce non-zero exit or thrown errors suitable for tests.
- Tests covering CLI-related behaviour pass.