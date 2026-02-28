# CLI_ECHO

# Description
Add a dedicated echo command to the CLI that repeats back provided message parts for quick debugging and verifying argument parsing.

# Usage
1. User invokes the CLI with echo as the first argument and message parts following.
2. The CLI collects all arguments after echo into messageParts.
3. It joins messageParts into a single string separated by spaces.
4. It prints the joined string to stdout and exits with code 0.

# Implementation
- In src/lib/main.js:
  1. Extend parseArgs to detect if args[0] is "echo". Set options.echo and options.messageParts.
  2. Export function echoMessage(messageParts) that joins parts, logs the result, and returns it.
  3. In main(args): if options.echo is true, call echoMessage(options.messageParts) and process.exit(0).

# Testing
- In tests/unit/main.test.js:
  * Test parseArgs(["echo","hello","world"]) sets echo and messageParts correctly.
  * Test echoMessage(["hello","world"]) returns "hello world" and logs it.
  * Integration test for main(["echo","test","msg"]): spy on console.log and process.exit, confirm echoMessage is called, output printed, and exit code 0.

# Documentation
- Update README.md under **Echo Command**:
  Describe usage: npm run start -- echo <message parts>
  Provide inline example: npm run start -- echo Hello world → Prints Hello world