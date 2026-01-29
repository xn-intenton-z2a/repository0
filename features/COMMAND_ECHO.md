# COMMAND_ECHO

# Description
Add a dedicated `echo` subcommand to the CLI that repeats back any provided arguments. This enables quick verification of argument parsing and provides a simple debugging tool for users.

# Usage
1. The user invokes the CLI with `echo` as the first argument followed by any number of message parts.
2. The CLI collects all following arguments into an array `messageParts`.
3. The CLI joins `messageParts` into a single string separated by spaces.
4. The CLI prints the joined message to stdout and exits with status code 0.

# Implementation
- In `src/lib/main.js`:
  1. Extend `parseArgs(args)` to detect if the first argument is `echo`:
     - Set `options.echo = true`.
     - Store `options.messageParts = args.slice(1)`.
  2. Export a function `echoMessage(messageParts)` that:
     - Joins the array of strings `messageParts` with spaces.
     - Logs the resulting string via `console.log`.
     - Returns the joined string for testing purposes.
  3. Modify `main(args)` to:
     - After parsing arguments, if `options.echo` is true:
       * Call `echoMessage(options.messageParts)`.
       * Call `process.exit(0)` to terminate.
     - Otherwise proceed with the existing dispatch flows.

# Testing
- In `tests/unit/main.test.js`:
  1. Add unit tests for `parseArgs(["echo","hello","world"])`:
     - Assert `options.echo` is true.
     - Assert `options.messageParts` equals `['hello','world']`.
  2. Add unit tests for `echoMessage(['hello','world'])`:
     - Spy on `console.log` to capture its argument.
     - Assert the returned value and logged message is "hello world".
  3. Add an integration test for `main(['echo','test','message'])`:
     - Spy on `console.log` and `process.exit`.
     - Assert `echoMessage` is called, message is printed, and exit code 0 is used.

# Documentation
- Update `README.md` under **Echo Command**:
  - Describe usage: `npm run start -- echo <message parts>`.
  - Provide examples inline without fenced code blocks:
    npm run start -- echo Hello world  → Prints Hello world