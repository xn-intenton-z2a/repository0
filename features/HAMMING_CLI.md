# HAMMING_CLI

Summary

An optional command-line interface feature that wraps the core Hamming functions, allowing quick verification and scripting of Hamming computations from the terminal. The CLI is intended as a lightweight convenience for developers and demonstrators and must be implemented only if the core library is present.

Motivation

Provide a simple, dependency-free CLI to compute Hamming distances for two strings or two integers without requiring a small script. The CLI improves discoverability and eases manual testing and demonstrations.

Specification

- Implement a small CLI entry point under examples/ or src/ that accepts arguments to run either string Hamming distance or bit-level Hamming distance.
- The CLI must validate inputs and return appropriate non-zero exit codes on error. Error messages must reference the same TypeError and RangeError semantics as the library functions.
- The CLI must not change library exports; it must import the named exports from src/lib/main.js.
- Provide usage examples in README.md and an example file under examples/ demonstrating typical invocations.

Behavior

- When invoked in string mode with two string arguments of equal length, print the integer Hamming distance to stdout and exit 0.
- When invoked in bit mode with two non-negative integers, print the integer Hamming distance in bits to stdout and exit 0.
- On validation errors, print a clear error message to stderr and exit with a non-zero exit code.

Acceptance criteria

- CLI exists at examples/hamming-cli.js or similar and imports the library functions rather than reimplementing them.
- Running the CLI in string mode on karolin and kathrin outputs the value 3 and returns exit code 0.
- Running the CLI in bit mode on 1 and 4 outputs the value 2 and returns exit code 0.
- The README includes a short usage section describing how to run the CLI and shows two examples that match the core acceptance criteria.
- The CLI does not alter library behavior and is optional; library unit tests continue to pass if the CLI is present.

Notes

This feature is optional relative to the core library. If time or scope prevents implementing the CLI now, the spec remains as a future enhancement and the core library feature should be prioritized.