# CLI_ECHO

# Description
Add a simple echo feature to the CLI that repeats provided arguments back to the user. This helps verify argument parsing and provides a quick debugging tool.

# Usage
1. echo <message>
   - Print the provided message and exit with code 0

# Implementation
- In src/lib/main.js:
  - Extend parseArgs to detect a new command name `echo` and collect the remaining args as `message`.
  - Export a function `echoMessage(messageParts)` that:
    1. Joins the messageParts array into a string
    2. Logs the string to stdout
    3. Returns the string for testing
  - In main(args):
    - If the first arg is `echo`, call `echoMessage(args.slice(1))` and exit with code 0
    - Otherwise, continue existing dispatch flows

# Testing
- In tests/unit/main.test.js:
  - Add unit tests for parseArgs(["echo","hello","world"]) to assert detection
  - Write tests for echoMessage(["hello","world"]) to confirm return "hello world" and console.log called
  - Integration test: main(["echo","test"]), spy on process.exit and console.log to verify behavior

# Documentation
- Update README.md under **Echo Command**:
  - Describe `echo <message>` usage
  - Provide inline example: npm run start -- echo hello world
