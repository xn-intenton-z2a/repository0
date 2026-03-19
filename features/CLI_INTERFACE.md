# CLI_INTERFACE

Summary

Add a small CLI wrapper around the library entry point so users can convert a single argument (an integer or a Roman numeral) from the command line and CI can exercise the behaviour with process-level tests.

Goal

Provide a minimal, well-specified command-line interface implemented by the existing library entry point (node src/lib/main.js) that prints the converted value to stdout, prints helpful usage or error messages to stderr, and uses deterministic exit codes so behaviour can be asserted in tests.

Specification

- Invocation: run node src/lib/main.js with a single argument which is either an integer (string digits) or a Roman numeral string (uppercase letters I V X L C D M).
- Behaviour when single argument is provided:
  - If the argument is a finite integer in the inclusive range 1..3999, print the Roman numeral representation to stdout and exit with code 0.
  - If the argument is a string that is a valid Roman numeral per VALIDATION rules, print its integer value to stdout and exit with code 0.
  - If the integer is outside 1..3999, write a short RangeError message to stderr and exit with a non-zero code (prefer 2).
  - If the Roman numeral is invalid according to VALIDATION rules, write a short TypeError message to stderr and exit with a non-zero code (prefer 3).
- Behaviour when no arguments or more than one argument is provided:
  - Print a single-line usage message to stderr describing expected single-argument usage and exit with code 1.
- Output format:
  - stdout contains only the converted value followed by a single newline; no additional text.
  - stderr messages must be brief and suitable for exact matching in tests (for example: "RangeError: number out of range" or "TypeError: invalid Roman numeral").
- Implementation note:
  - The CLI should delegate to named exports intToRoman and romanToInt from src/lib/main.js where possible so the same library logic is exercised by unit and CLI tests.

Acceptance criteria (testable)

1. Running node src/lib/main.js 1994 prints MCMXCIV to stdout and exits with code 0.
2. Running node src/lib/main.js MCMXCIV prints 1994 to stdout and exits with code 0.
3. Running node src/lib/main.js 0 writes a RangeError message to stderr and exits with a non-zero code.
4. Running node src/lib/main.js IIII writes a TypeError message to stderr and exits with a non-zero code.
5. Running node src/lib/main.js with no arguments writes the usage message to stderr and exits with code 1.
6. The README references the CLI usage and examples so the behaviour is documented.

Files to change

- src/lib/main.js: ensure module both exports named functions and when executed directly as a script parses process.argv, delegates to library functions, and implements the exit code and output rules above.
- README.md: include a short line describing the CLI usage so tests and users can discover it.

Notes

- Keep stdout/stderr concise and exact to enable deterministic process-level tests.
- Preserve named exports so the library-level API remains testable independently of the CLI.
