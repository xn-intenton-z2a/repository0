# CLI_TOOL

Summary
Provide a minimal CLI wrapper around the library so the repository can demonstrate and manually verify fizzBuzz behaviour from the command line.

Motivation
A small CLI improves developer ergonomics and provides a human-friendly demo for maintainers and CI checks.

Specification
- Behaviour
  - When invoked as node src/lib/main.js N where N is a non-negative integer, print the fizzBuzz(N) results one per line to stdout for N > 0, or print nothing for N === 0.
  - If N is missing, non-integer, or negative, print a brief error message to stderr and exit with a non-zero code.

- Implementation notes
  - Keep the CLI logic compact and co-located with the library entry point if the project design allows it, or export a small runCli helper from src/lib/main.js.

Acceptance criteria
- Running node src/lib/main.js 5 prints five lines matching standard fizz/buzz mapping.
- Invalid inputs produce non-zero exit code and user-friendly error output to stderr.
