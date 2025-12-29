# CLI_ECHO

# Description
Add a simple echo command to the CLI that repeats back any provided arguments. This helps verify that argument parsing is working correctly and offers a quick debugging tool for users.

# Command and Arguments
- **echo** <message parts>
  - Collect all arguments following the `echo` command as `messageParts`.
  - Join `messageParts` into a single string and print it to stdout.
  - Exit with status code 0.

# Implementation
- In `src/lib/main.js`:
  1. Extend `parseArgs(args)` so that if the first element is `echo`, set `options.echo = true` and capture `options.messageParts = args.slice(1)`.
  2. Export a function `echoMessage(messageParts)` that:
     - Joins the array `messageParts` with spaces.
     - Logs the resulting string to stdout.
     - Returns the joined string for testing.
  3. In `main(args)`, after parsing options:
     - If `options.echo` is true, call `echoMessage(options.messageParts)` and `process.exit(0)`.
     - Otherwise continue existing flag dispatch flows.

# Testing
- In `tests/unit/main.test.js`:
  1. Add unit tests for `parseArgs(["echo","hello","world"])`:
     - Assert `options.echo` is true and `options.messageParts` equals `["hello","world"]`.
  2. Write tests for `echoMessage(["hello","world"])`:
     - Spy on `console.log` to capture output.
     - Assert that it returns `"hello world"` and calls `console.log` with the same string.
  3. Add an integration test for `main(["echo","test message"])`:
     - Spy on `console.log` and `process.exit`.
     - Verify `echoMessage` is invoked, the message is printed, and the process exits with code 0.

# Documentation
- Update `README.md` under **Echo Command**:
  - Describe usage: `npm run start -- echo <message>`.
  - Provide an inline example without fenced code blocks:
    npm run start -- echo Hello world  → Prints Hello world