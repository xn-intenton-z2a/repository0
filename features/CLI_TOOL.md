# CLI_TOOL

Summary

Status: Partial implementation. src/lib/main.js currently exports a main(args) helper and supports --version and --identity flags; the remaining CLI enhancements described here are scoped for follow-up work.

Behavior and options

- Preserve existing behaviour: --version prints package version and exits 0; --identity prints a JSON identity object and exits 0. Default invocation prints name@version.
- Implement --single N: parse N as integer, validate using the library rules, and print the single fizzBuzzSingle(N) value to stdout as one line; exit 0 on success.
- Implement --fizz N: parse N as integer, validate using the library rules, and print fizzBuzz(N) one value per line from 1 to N; exit 0 on success.
- Error handling: invalid inputs must result in a non-zero exit code and a concise error message to stderr.
- Implementation must delegate algorithmic work to the exported library functions and keep the CLI thin for testability.

Testing and automation

- Add tests in tests/unit/cli.test.js that call the exported main(args) function or invoke the script programmatically and assert stdout content and exit codes.
- Test cases must include canonical checks for 3, 5, 7, 15 values, fizzBuzz(0) behaviour, and invalid input handling.

Acceptance criteria

- node src/lib/main.js --single 7 prints the single line 7 and exits with code 0.
- node src/lib/main.js --fizz 15 prints 15 lines with the fifteenth line equal to FizzBuzz and exits with code 0.
- --version and --identity continue to print expected outputs and exit 0.
- Invalid inputs result in non-zero exit and an error message.
- There are unit tests covering the above behaviours and they pass in CI.

Implementation notes

- Prefer calling main(args) from tests to avoid spawning child processes where possible; if spawning, use stable argument lists and assert exact stdout and exit codes.
- Keep CLI parsing deterministic and machine-parseable to simplify assertions in automated tests.
