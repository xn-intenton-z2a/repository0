# FIZZBUZZ_CLI

Purpose

Provide a small command-line interface for the fizzbuzz library so users can run fizzbuzz without writing JS. This demonstrates the library API and is suitable for examples and manual testing.

Behavior

- Executable via node src/lib/main.js when run as a script.
- Accepts flags:
  - --n <number> (required for list mode)
  - --single <number> (prints single fizzbuzz output)
  - --format json|text (default text)
  - --help prints usage and exits 0

- Input validation mirrors library behavior: non-integers print a helpful error to stderr and exit non-zero; negative numbers exit non-zero with a RangeError message.

Implementation notes

- Keep CLI parsing minimal (process.argv) so it stays dependency-free.
- Print one value per line for text format; print JSON array or JSON string for json format.
- Exit codes: 0 on success, 2 for usage errors, 3 for invalid input (TypeError/RangeError).

Acceptance criteria

- Running node src/lib/main.js --n 15 prints 15 lines ending with FizzBuzz (text format).
- Running node src/lib/main.js --single 3 prints Fizz.
- Running node src/lib/main.js --help exits 0 and prints usage.
- Non-integer input causes a non-zero exit code and an explanatory message on stderr.
