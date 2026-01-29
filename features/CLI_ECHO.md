# CLI_ECHO

# Description
Add a dedicated echo command to the CLI that repeats back provided message parts for quick debugging and verification of flag parsing.

# Usage
1. The user invokes the CLI with echo as the first argument followed by message parts.
2. The CLI collects all following arguments into messageParts.
3. The CLI joins messageParts into a single string separated by spaces.
4. The CLI prints the joined message to stdout and exits with status code 0.

# Implementation
- In src/lib/main.js:
  1. Extend parseArgs(args) to detect the first argument "echo":
     - Set options.echo = true
     - Set options.messageParts = args.slice(1)
  2. Export function echoMessage(messageParts) that:
     - Joins messageParts with spaces
     - Logs the resulting string via console.log
     - Returns the joined string for testing
  3. In main(args):
     - After parsing options, if options.echo is true:
       * Call echoMessage(options.messageParts)
       * Call process.exit(0)
     - Otherwise continue existing dispatch flows

# Testing
- In tests/unit/main.test.js:
  1. Unit tests for parseArgs(["echo","hello","world"]): assert options.echo is true and messageParts equals ["hello","world"].
  2. Tests for echoMessage(["hello","world"]): spy on console.log, assert return value and logged string is "hello world".
  3. Integration test for main(["echo","test","message"]): spy on console.log and process.exit, verify echoMessage invoked, message printed, exit code 0.