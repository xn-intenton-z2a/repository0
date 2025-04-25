# Overview
This feature consolidates and implements the complete suite of command-line utilities into a single, unified CLI tools module. It merges help, version, diagnostics, status, digest, simulation commands, agentic payload handling, interactive prompts, and JSON utilities into one coherent implementation that respects all previous behaviors and expands core capabilities.

# Implementation

- Update src/lib/main.js to handle all supported flags in an integrated flow:
  - No arguments or --help
    - Display a dynamic help message listing all available commands and their descriptions.
  - --version
    - Read version from package.json and output a message including a current UTC timestamp.
  - --diagnostics
    - Collect and display environment diagnostics: Node.js version, platform, process memory usage, uptime, and CPU info.
  - --status
    - Produce a runtime health summary including event loop lag, memory statistics, and uptime.
  - --digest
    - Invoke digestLambdaHandler to simulate SQS event processing and output the resulting event object or messageId.
  - --simulate-error
    - Trigger an error simulation by throwing or logging a failure and exiting with code 1.
  - --simulate-delay <ms>
    - Pause execution for the specified duration before continuing or exiting.
  - --simulate-load <ms>
    - Execute a CPU-bound loop for the specified duration to simulate load.
  - --apply-fix
    - Perform a placeholder fix action, log success, and exit.
  - --agentic
    - Invoke agenticHandler with a JSON payload containing the remaining commands, then output results.
  - --dry-run
    - Execute agenticHandler in dry-run mode without side effects, displaying what would be done.
  - --verbose
    - Enable detailed logging and annotate each step of command execution.
  - --cli-utils
    - Output the commands object as a formatted JSON string for programmatic consumption.
  - --interactive
    - Launch an inquirer prompt listing all commands; after selection, display confirmation of the chosen command.

- Add or update imports as needed (agenticHandler, digestLambdaHandler, inquirer).
- Ensure each branch returns or exits appropriately and maintains backward compatibility.

# Tests

- In tests/unit/main.test.js:
  - Extend existing tests to cover version output including timestamp format validation.
  - Add tests for diagnostics, status and verify JSON structure or message patterns.
  - Verify digest flag calls digestLambdaHandler and logs expected output.
  - Assert simulate-error exits with code 1 and logs error.
  - Test simulate-delay and simulate-load by mocking timers and measuring delays or CPU simulation invocation.
  - Confirm apply-fix logs the success message and exits.
  - Validate agentic and dry-run flags call agenticHandler mock and format results correctly.
  - Ensure verbose flag adds additional console logs beyond core messages.
  - Retain and update tests for help, cli-utils, and interactive as before.

# Documentation

- Update README.md and docs/USAGE.md to describe every supported flag, sample invocations, expected outputs, and JSON structures.
- Provide usage examples for version, diagnostics, status, digest, simulations, apply-fix, agentic, dry-run, verbose, cli-utils, and interactive modes.
- Clarify dependencies and environment requirements for full feature set.