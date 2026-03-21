# CLI_TOOL

Summary

Provide a small command line interface in src/lib/main.js that allows running fizzBuzz and fizzBuzzSingle from the shell. This complements the library API and enables behaviour tests.

Behavior and options

- Support a flag to print the library identity and version; keep existing --version and --identity behaviour.
- Add support for a --single N option which prints the fizzBuzzSingle output for integer N to stdout and exits 0 on success.
- Add support for a --fizz N option which prints the fizzBuzz output for integer N as one value per line or as JSON; tests should assert the one value per line rendering to simplify comparison.
- Validate inputs the same way the library does and exit with non-zero status if invalid.

Acceptance criteria

- Running node src/lib/main.js --single 7 prints 7 and exits zero.
- Running node src/lib/main.js --fizz 15 prints fifteen lines whose fifteenth line is FizzBuzz and exits zero.
- Existing options --version and --identity continue to work.
- CLI behaviour has unit tests or script tests that exercise the parsing and validation.
