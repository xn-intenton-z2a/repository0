# CLI_TOOL

Purpose

Provide a small command-line interface that demonstrates and exercises the library from the terminal. This improves discoverability and gives a simple human test harness for the core functions.

Specification

- Add a CLI entrypoint that can be invoked with node src/lib/main.js or via npm run start:cli.
- The CLI accepts one optional numeric argument count. When provided, it computes fizzBuzz(count) and prints the resulting array joined by newline to stdout.
- If no argument is provided the CLI prints a usage line plus the output for count = 15 as a demo.
- The CLI must validate inputs and exit with a non-zero status when user input is invalid. Error messages should be brief and human readable.

Behaviour

- node src/lib/main.js 5 prints:
  1
  2
  Fizz
  4
  Buzz

- node src/lib/main.js with no args prints a short header, usage example and the fizzBuzz(15) result for manual verification.

Acceptance Criteria

- The repository includes a CLI entrypoint at src/lib/main.js that uses the exported fizzBuzz or fizzBuzzSingle functions to compute output.
- Running node src/lib/main.js 3 prints three lines where line 3 is Fizz.
- Running node src/lib/main.js invalidInput prints a validation error to stderr and exits with non-zero status.
- The CLI is documented in README with example invocations.
