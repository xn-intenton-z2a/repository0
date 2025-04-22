# AGENTIC_LIB

## Crawl Summary
Agentic-lib provides reusable GitHub Actions workflows with core functionalities in .github/workflows/ (GPL-3) and demonstration examples in examples/ (MIT). The main module (src/lib/main.js) implements agenticHandler that accepts a JSON payload with either a single command (string) or multiple commands (array). Each valid command increments globalThis.callCount and returns an executionTimeMS. Batch processing is throttled via the env variable MAX_BATCH_COMMANDS. The CLI supports flags --agentic, --dry-run, --version, --verbose, --diagnostics, --status, --digest, --simulate-error, --simulate-delay <ms>, --apply-fix, and --cli-utils. AWS SQS integration is provided via createSQSEventFromDigest and digestLambdaHandler, and logging is handled with logInfo and logError.

## Normalised Extract
Table of Contents:
1. Component Breakdown
   - Re-usable Workflows: Located in .github/workflows/, stable under GPL-3.
   - Example Workflows: Located in examples/, provided under MIT license.
   - Main Module (main.js): Located in src/lib/main.js, implements agenticHandler, tracks globalThis.callCount, and supports batch processing.
2. AgenticHandler Function
   - Accepts JSON payload: either { command: string } or { commands: string[] }.
   - Processes commands sequentially, increments globalThis.callCount, returns results with executionTimeMS for each command.
   - Batch processing throttled by MAX_BATCH_COMMANDS env variable; excess commands lead to error response.
   - Trims whitespace and lowercases inputs; rejects non-actionable commands (e.g., 'NaN', empty strings) with explicit error messages.
3. CLI Commands
   - --agentic: Invoke agenticHandler with JSON payload.
   - --dry-run: Performs a dry run without executing actions.
   - --version: Outputs version from package.json with timestamp in JSON format.
   - --verbose: Enables detailed logging for debugging.
   - --diagnostics: Provides a diagnostic report of configuration and environment details.
   - --status: Outputs runtime health summary including config, Node.js version, callCount, and uptime.
   - --digest: Processes a sample digest event via AWS integration.
   - --simulate-error: Simulates an error scenario and exits with non-zero status.
   - --simulate-delay <ms>: Delays processing by specified milliseconds.
   - --apply-fix: Applies automated fixes and outputs success message, then exits.
   - --cli-utils: Lists all CLI commands with descriptions.
4. AWS Integration
   - createSQSEventFromDigest: Builds a mock SQS event from a digest payload.
   - digestLambdaHandler: Processes SQS events, handles JSON errors, and generates fallback messageId if needed.
5. Logging
   - logInfo: Logs informational messages.
   - logError: Logs error details with stack traces when verbose is active.
6. Licensing & Attribution
   - Core licensed under GPL-3 with attribution; examples under MIT; mandatory attribution string.


## Supplementary Details
AgenticHandler specification:
- Input: JSON payload with either property 'command' (string) or 'commands' (array of strings).
- Process: Validates each command by trimming whitespace, converting to lowercase; rejects if command is 'nan' or empty.
- Increment: globalThis.callCount is incremented for each successful command.
- Return: Aggregated result in form { results: [{ command: <string>, executionTimeMS: <number>, status: <'success' or 'error'> }], error?: <string> }.
- Batch Throttling: If process.env.MAX_BATCH_COMMANDS is set and number of commands exceeds it, processing is aborted with an error message.

CLI configuration details:
- --agentic requires a well-formatted JSON payload.
- --dry-run executes without changing state.
- --version reads version from package.json and appends timestamp.
- --simulate-delay requires an integer argument indicating delay in milliseconds.

AWS Integration specifics:
- createSQSEventFromDigest(digest: string): Constructs an object with structure { Records: [ { messageId: <string>, body: digest } ] }.
- digestLambdaHandler(event: object): Processes event, catches JSON parsing exceptions, uses fallback messageId if missing.

Logging functions:
- logInfo(message: string): void
- logError(error: Error): void

Configuration options:
- MAX_BATCH_COMMANDS: Numeric value; default is not set. When set, limits batch size and rejects excessive commands.

Best practices:
- Always validate input payloads for agenticHandler.
- Use --dry-run flag for testing new commands.
- Monitor globalThis.callCount for tracking command invocations.
- Use verbose logging (--verbose) during troubleshooting.

Troubleshooting procedures:
- Run node src/lib/main.js --diagnostics to get current configuration and environment details.
- If batch is rejected due to MAX_BATCH_COMMANDS, verify environment variable value using echo $MAX_BATCH_COMMANDS.
- In case of non-actionable prompts, check input after trimming and lowercasing.
- Use --simulate-error and --simulate-delay to test error handling and latency scenarios.

## Reference Details
API Specifications:
Function: agenticHandler(payload: { command?: string, commands?: string[] }): { results: Array<{ command: string, executionTimeMS: number, status: string }>, error?: string }
- Accepts either a single command as a string property 'command' or an array of commands under 'commands'.
- Returns an object with a 'results' array where each element contains:
  * command: string
  * executionTimeMS: number (milliseconds processing time)
  * status: 'success' or 'error'

CLI Method Signatures:
- node src/lib/main.js --agentic '{"command": "doSomething"}'
- node src/lib/main.js --agentic '{"commands": ["cmd1", "cmd2"]}'
- Additional CLI flags: --dry-run, --version, --verbose, --diagnostics, --status, --digest, --simulate-error, --simulate-delay <ms>, --apply-fix, --cli-utils

AWS Integration Functions:
- createSQSEventFromDigest(digest: string): { Records: Array<{ messageId: string, body: string }> }
- digestLambdaHandler(event: object): void

Logging Functions:
- logInfo(info: string): void
- logError(error: Error): void

Complete Code Example:
// Example invocation of agenticHandler
const payload = { command: 'doSomething' };
const result = agenticHandler(payload);
console.log(result);

// Batch processing example
const batchPayload = { commands: ['cmd1', 'cmd2'] };
const batchResult = agenticHandler(batchPayload);
console.log(batchResult);

// CLI usage example (shell commands):
// node src/lib/main.js --agentic '{"command": "doSomething"}'
// node src/lib/main.js --dry-run
// node src/lib/main.js --simulate-delay 500

Configuration Options:
- process.env.MAX_BATCH_COMMANDS: Integer, e.g., 10; if set and commands array length > MAX_BATCH_COMMANDS, returns error.

Troubleshooting Commands:
- node src/lib/main.js --diagnostics (outputs configuration, Node.js version, and environment variables)
- echo $MAX_BATCH_COMMANDS (check current batch limit setting)

Best Practices:
- Validate and sanitize incoming payloads before invoking agenticHandler.
- Use --dry-run for testing commands in production environments.
- Monitor globalThis.callCount for performance metrics.
- Leverage verbose logging for detailed error insights (use --verbose).

Licensing:
- GPL-3 for core workflows; MIT for example workflows. Attribution required: "This work is derived from https://github.com/xn-intenton-z2a/agentic-lib"

## Information Dense Extract
Agentic-lib: reusable workflows in .github/workflows (GPL-3) and examples (MIT). Main module (src/lib/main.js) exports agenticHandler(payload: { command?: string, commands?: string[] }) returning { results: [{ command, executionTimeMS, status }], error? } with sequential processing, globalThis.callCount++, and batch limit via process.env.MAX_BATCH_COMMANDS. CLI flags: --agentic, --dry-run, --version, --verbose, --diagnostics, --status, --digest, --simulate-error, --simulate-delay <ms>, --apply-fix, --cli-utils. AWS integrations via createSQSEventFromDigest(digest: string) -> { Records: [{ messageId, body }] } and digestLambdaHandler(event). Logging via logInfo(string) and logError(Error). Input validation: trim, lowercase; reject 'nan' or empty. Command examples: node src/lib/main.js --agentic '{"command": "doSomething"}', node src/lib/main.js --agentic '{"commands": ["cmd1","cmd2"]}'. Configuration options require explicit env variable settings. Best practices include dry-run testing, verbose logging, and diagnostics command. Attribution: "This work is derived from https://github.com/xn-intenton-z2a/agentic-lib".

## Sanitised Extract
Table of Contents:
1. Component Breakdown
   - Re-usable Workflows: Located in .github/workflows/, stable under GPL-3.
   - Example Workflows: Located in examples/, provided under MIT license.
   - Main Module (main.js): Located in src/lib/main.js, implements agenticHandler, tracks globalThis.callCount, and supports batch processing.
2. AgenticHandler Function
   - Accepts JSON payload: either { command: string } or { commands: string[] }.
   - Processes commands sequentially, increments globalThis.callCount, returns results with executionTimeMS for each command.
   - Batch processing throttled by MAX_BATCH_COMMANDS env variable; excess commands lead to error response.
   - Trims whitespace and lowercases inputs; rejects non-actionable commands (e.g., 'NaN', empty strings) with explicit error messages.
3. CLI Commands
   - --agentic: Invoke agenticHandler with JSON payload.
   - --dry-run: Performs a dry run without executing actions.
   - --version: Outputs version from package.json with timestamp in JSON format.
   - --verbose: Enables detailed logging for debugging.
   - --diagnostics: Provides a diagnostic report of configuration and environment details.
   - --status: Outputs runtime health summary including config, Node.js version, callCount, and uptime.
   - --digest: Processes a sample digest event via AWS integration.
   - --simulate-error: Simulates an error scenario and exits with non-zero status.
   - --simulate-delay <ms>: Delays processing by specified milliseconds.
   - --apply-fix: Applies automated fixes and outputs success message, then exits.
   - --cli-utils: Lists all CLI commands with descriptions.
4. AWS Integration
   - createSQSEventFromDigest: Builds a mock SQS event from a digest payload.
   - digestLambdaHandler: Processes SQS events, handles JSON errors, and generates fallback messageId if needed.
5. Logging
   - logInfo: Logs informational messages.
   - logError: Logs error details with stack traces when verbose is active.
6. Licensing & Attribution
   - Core licensed under GPL-3 with attribution; examples under MIT; mandatory attribution string.

## Original Source
intentïon agentic-lib Documentation
https://github.com/xn-intenton-z2a/agentic-lib

## Digest of AGENTIC_LIB

# Agentic-lib Documentation

This document was retrieved on 2023-10-12.

## Component Breakdown

1. Re-usable Workflows
   - Location: .github/workflows/
   - Purpose: Backbone of the agentic system for testing, publishing, and issue management.
   - Stability: Stable and well-tested.
   - Licensing: GPL-3 with attribution clause.

2. Example Workflows
   - Location: examples/
   - Purpose: Demonstrative examples for learning and reference.
   - Stability: Functional, for experimentation.
   - Licensing: MIT license.

3. Main JavaScript Module (main.js)
   - Location: src/lib/main.js
   - Purpose: JavaScript re-implementation of Re-usable Workflows providing programmatic access.
   - Features: Tracks invocation count (globalThis.callCount), supports batch processing, and detailed observability.

## AgenticHandler Function

- Function: agenticHandler
- Input: JSON payload in two forms:
  * Single command: { "command": "doSomething" }
  * Batch commands: { "commands": ["cmd1", "cmd2"] }
- Processing: Validates each command; on success increments globalThis.callCount; returns a response with results array containing an executionTimeMS field.
- Batch Throttling: Controlled via environment variable MAX_BATCH_COMMANDS to limit the number of commands; exceeding limit returns error message.
- Error Handling: Trims whitespace, converts to lowercase; rejects non-actionable inputs like 'NaN' or empty strings with explicit error messages.

## CLI Flags and Behavior

- --agentic: Executes agenticHandler with provided JSON payload.
  * Single command invocation example: node src/lib/main.js --agentic '{"command": "doSomething"}'
  * Batch processing example: node src/lib/main.js --agentic '{"commands": ["cmd1", "cmd2"]}'

- --dry-run: Executes a simulated run without any actions.
- --version: Displays package.json version and a timestamp in JSON format.
- --verbose: Enables detailed logging for debugging.
- --diagnostics: Outputs configuration report, Node.js version, and environment variables.
- --status: Provides a runtime health summary including configuration, callCount, uptime, and select environment variables.
- --digest: Initiates processing of a sample digest event via AWS integration.
- --simulate-error: Simulates error; logs a simulated error and exits with non-zero status code.
- --simulate-delay <ms>: Delays execution for specified milliseconds before further processing.
- --apply-fix: Applies automated fixes and logs success message "Applied fix successfully"; stops execution immediately.
- --cli-utils: Displays a summary of all CLI commands along with brief descriptions.

## AWS Integrations

- SQS Integration:
  * Function: createSQSEventFromDigest
    - Purpose: Constructs a mock AWS SQS event from a given digest, formatting payload in typical SQS message style.
  * Function: digestLambdaHandler
    - Purpose: Processes incoming SQS events; handles JSON parsing errors, accumulates failed records, and generates fallback messageId if omitted.

## Logging Functions

- logInfo(info: string): void
- logError(error: Error): void

## Licensing and Attribution

- Core licensing under GPL-3 with attribution requirements.
- Example workflows under MIT License.
- Attribution must include: "This work is derived from https://github.com/xn-intenton-z2a/agentic-lib"

## Crawling Details

- Data Size: 659985 bytes
- Links Found: 5161
- No errors reported during crawl.


## Attribution
- Source: intentïon agentic-lib Documentation
- URL: https://github.com/xn-intenton-z2a/agentic-lib
- License: License: Mixed (GPL & MIT)
- Crawl Date: 2025-04-22T04:48:26.192Z
- Data Size: 659985 bytes
- Links Found: 5161

## Retrieved
2025-04-22
