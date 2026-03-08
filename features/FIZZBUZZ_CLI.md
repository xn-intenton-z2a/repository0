# FIZZBUZZ_CLI

Summary

Specify a small command-line interface mode for the library that demonstrates fizzBuzzSingle and fizzBuzz behaviour when invoked as a Node script. The CLI is optional for interactive use and for behaviour tests that exercise the website build or examples. Extend the CLI to support an optional output format flag to emit JSON and to support a --label option for localisation labels without changing the canonical library behaviour.

Specification

- When src/lib/main.js is executed with node directly (node src/lib/main.js) it should act in CLI mode if an environment variable or process.argv indicates a CLI invocation.
- CLI accepts a single positional integer argument n. When provided, it prints the fizzBuzz sequence from 1..n, one entry per line, to stdout by default.
- CLI accepts an optional flag --format=json (or -j) which causes the CLI to emit the full sequence as a JSON array to stdout instead of one-per-line text.
- CLI accepts an optional flag --label or --labels that accepts a comma-separated pair fizz=Foo,buzz=Bar to override the Fizz and Buzz words for display only; when provided the CLI must call the additive localisation helpers from the library (for example fizzBuzzWithWords) rather than changing the canonical outputs.
- When provided with no argument, CLI prints usage help to stdout and exits with code 0.
- When provided invalid input, CLI prints a concise error message to stderr and exits with a non-zero exit code.
- The CLI must reuse the exported library functions (fizzBuzz / fizzBuzzSingle and the localisation helpers) rather than duplicating logic.

Testing guidance

- Behaviour tests should run node src/lib/main.js 15 and assert stdout contains the expected 15 lines ending with FizzBuzz and exit code 0.
- Behaviour tests should run node src/lib/main.js 15 --format=json and assert stdout is valid JSON and matches JSON.stringify(fizzBuzz(15)).
- Behaviour tests should run node src/lib/main.js 15 --labels fizz=Foo,buzz=Bar and assert the final line contains FooBar and positions match those of Fizz/Buzz replacements.
- Tests for invalid input should assert non-zero exit code and an error message on stderr.

Acceptance criteria

- CLI prints correct output for n=15 with one entry per line and exit code 0
- CLI prints usage when run without args and exits 0
- CLI returns non-zero exit code and prints error message on invalid input
- CLI --format=json produces JSON array equal to JSON.stringify(fizzBuzz(15))
- CLI --labels fizz=Foo,buzz=Bar shows Foo and Bar in the correct positions and does not change canonical library outputs

Notes

This feature adds a small, well-scoped extension to the CLI to make automated checks and demos easier. Implementation should be a short runtime branch in src/lib/main.js that parses process.argv and calls the library exports. The JSON output must be produced by serialising the array returned by fizzBuzz and localisation must be achieved by calling the additive helpers; do not duplicate core logic or modify canonical functions.