# HAMMING_CLI

Summary

An optional command-line interface feature that wraps the core Hamming functions, allowing quick verification and scripting of Hamming computations from the terminal. The CLI is a small convenience that imports the library exports and must not reimplement library logic or alter exported behavior.

Motivation

Improve discoverability and make manual testing and demonstrations simple for developers who prefer a terminal workflow. The CLI also serves as a lightweight example showing how to import and use the library from scripts.

Specification

- Provide a small executable example under examples/ (e.g., examples/hamming-cli.js) that imports hammingDistance and hammingDistanceBits from src/lib/main.js.
- The CLI must support two modes: string mode and bit mode.
  - String mode: accept two string arguments and print the Hamming distance (per code point) when lengths are equal.
  - Bit mode: accept two non-negative integers and print the bit Hamming distance.
- Input validation must mirror library behavior and error types:
  - On invalid types, print a clear error message referencing TypeError and exit with a non-zero code.
  - On invalid ranges (unequal string lengths, negative integers), print a clear error message referencing RangeError and exit with a non-zero code.
- The CLI must not change library exports or behaviour; it must import and call the named exports.
- The CLI should be small, dependency-free, and usable with node examples/hamming-cli.js args...

Behavior and usage examples

- examples/hamming-cli.js string karolin kathrin  -> prints: 3 and exits 0
- examples/hamming-cli.js bit 1 4               -> prints: 2 and exits 0

Acceptance criteria

- A CLI example file exists under examples/ (examples/hamming-cli.js or similar) and imports the library functions.
- Running the CLI in string mode with karolin and kathrin outputs 3 and exits with code 0.
- Running the CLI in bit mode with 1 and 4 outputs 2 and exits with code 0.
- The CLI prints clear error messages and exits non-zero for TypeError and RangeError conditions that match the library semantics.
- README includes a short usage section describing how to run the CLI and shows two examples that match the core acceptance criteria.

Notes

- The CLI is optional; the core library remains the primary feature. Keep CLI implementation as a small demonstrator that relies entirely on the library exports.