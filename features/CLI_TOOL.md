# CLI_TOOL

Purpose
Provide a stable, testable command-line interface for the library so users can compute Hamming distances from the shell and tests can exercise the CLI surface.

Specification
- The package exposes a main function exported from src/lib/main.js that accepts an optional arguments array and performs CLI behaviour when invoked as a script.
- Supported CLI flags:
  - --version prints the package version and exits successfully.
  - --identity prints a JSON object with name, version and description and exits successfully.
  - --string <left> <right> computes the Unicode code point Hamming distance between left and right and writes the numeric result to stdout.
  - --bits <left> <right> computes the integer bit-level Hamming distance between left and right and writes the numeric result to stdout.
- CLI must reuse the exported library functions (hammingString, hammingBits, getIdentity) and must not reimplement validation logic.
- On success the CLI prints results to stdout with exit code 0. On error it prints a single-line error message to stderr and exits with a non-zero code.

Behavior
- main(args) must accept an array of strings as passed from process.argv.slice(2) and behave identically to invoking the package script from the command line.
- For --bits input, the CLI may parse integer arguments as either Numbers or BigInt literal notation (an optional trailing n) but must treat invalid integers as a validation error and exit non-zero.
- For --string input the CLI must pass the raw strings through to the library so Unicode handling is performed by hammingString.

Acceptance criteria (testable)
- Calling main(["--identity"]) prints a JSON object containing name, version and description and returns normally.
- Calling main(["--version"]) prints the version string and returns normally.
- Calling main(["--string","karolin","kathrin"]) writes a single line containing 3 to stdout and exits normally.
- Calling main(["--bits","1","4"]) writes a single line containing 2 to stdout and exits normally.
- Calling the CLI with invalid inputs (for example differing-length strings for --string or negative integers for --bits) prints an error message and results in a non-zero exit code.

Notes
- Tests should exercise main by calling it directly with an arguments array instead of spawning a new process to keep unit tests fast and deterministic.
- The CLI spec deliberately keeps output simple (plain numbers or compact JSON) to make behaviour easy to assert in unit tests.
