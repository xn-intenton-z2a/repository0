# AGENTIC_LIB

## Crawl Summary
agenticHandler processes JSON payloads with property 'command' or 'commands' array, increments globalThis.callCount and reports executionTimeMS. CLI supports flags: --agentic, --dry-run, --version, --verbose, --diagnostics, --status, --digest, --simulate-error, --simulate-delay <ms>, --simulate-load <ms>, --apply-fix, --cli-utils. AWS integrations include createSQSEventFromDigest and digestLambdaHandler functions for SQS event simulation and error handling. Environment variables MAX_BATCH_COMMANDS and COMMAND_ALIASES control batch throttling and alias substitution respectively.

## Normalised Extract
Table of Contents:
1. Component Breakdown
   - Re‑usable Workflows: Located in .github/workflows, stable, GPL‑3 licensed with attribution.
   - Example Workflows: Located in examples, MIT licensed for demonstrative purposes.
   - The Evolving main.js: Located in src/lib/main.js, JavaScript module for re‑usable workflows, tracks command invocations via globalThis.callCount.
2. Agentic Library Functions
   - agenticHandler: Accepts JSON payloads (single 'command' or 'commands' array), processes each command sequentially, logs executionTimeMS for each, supports optional batch throttling via MAX_BATCH_COMMANDS.
3. CLI Options
   - --agentic: Processes command(s) as JSON payload; examples: node src/lib/main.js --agentic '{"command":"doSomething"}' or node src/lib/main.js --agentic '{"commands":["cmd1","cmd2"]}'
   - --dry-run: Executes without action
   - --version: Outputs version info and timestamp
   - --verbose: Enables detailed logging
   - --diagnostics: Provides diagnostic report including configuration and Node.js version
   - --status: Outputs runtime health summary
   - --digest: Initiates SQS event simulation and processing via digestLambdaHandler
   - --simulate-error: Triggers error simulation with immediate exit
   - --simulate-delay <ms>: Delays command execution
   - --simulate-load <ms>: Simulates CPU load
   - --apply-fix: Applies fix and logs success, stops execution
   - --cli-utils: Lists all CLI commands with descriptions
4. AWS Integrations and Logging
   - AWS Functions: createSQSEventFromDigest (formats digest to SQS event), digestLambdaHandler (processes SQS messages with fallback for missing messageId)
   - Logging: logInfo and logError functions to log operations and error stacks when verbose mode is enabled

## Supplementary Details
Exact Technical Specifications:
- agenticHandler(input: { command?: string, commands?: string[] }): Processes input JSON payload. For single command, expects a string; for batch, expects an array of strings. Increments globalThis.callCount and returns executionTimeMS for each successfully processed command.
- Environment Variable MAX_BATCH_COMMANDS: When set (e.g., MAX_BATCH_COMMANDS=10), if the number of commands in a batch exceeds this limit, agenticHandler returns an error (exact error message: "Batch command limit exceeded").
- Environment Variable COMMAND_ALIASES: Must be a JSON string (e.g., '{ "ls": "list", "rm": "remove" }') that maps short commands to actual commands; substitution occurs automatically before processing.
- CLI Commands:
   --agentic: Accepts payload with either "command" or "commands" key. 
   --dry-run: Simulates execution without performing actions.
   --version: Reads version from package.json and appends a timestamp in ISO format.
   --verbose: Activates logging at debug level.
   --diagnostics: Reports current configuration variables, Node.js version (e.g., v14.17.0), and environment variables.
   --status: Returns JSON with keys: configuration, Node.js version, globalThis.callCount, uptime (in seconds), select environment variables.
   --simulate-error: Immediately logs error message "Simulated error" and exits with status code 1.
   --simulate-delay <ms>: Uses setTimeout to delay processing for specified milliseconds.
   --simulate-load <ms>: Executes CPU-intensive loop for given milliseconds to simulate heavy processing.
   --apply-fix: Executes fix routine, logs "Applied fix successfully", then terminates further execution.
   --cli-utils: Displays a complete summary of available CLI commands and their brief usage.
- AWS Integrations:
   createSQSEventFromDigest(digest: string): Returns an object structured as a typical SQS message event. 
   digestLambdaHandler(event): Processes event, uses try-catch for JSON parsing, logs and accumulates failed records. Generates fallback messageId if missing (e.g., messageId = 'fallback-' + Date.now()).

## Reference Details
API Specifications and SDK Method Signatures:

Function: agenticHandler
Signature: function agenticHandler(payload: { command?: string, commands?: string[] }): { results: Array<{ executionTimeMS: number, command: string }>, globalCallCount: number }
Description: Processes a JSON payload containing a single command or an array of commands, updates globalThis.callCount for each valid command, and returns an aggregated response containing individual execution times.

CLI Commands (with exact usage examples):
--agentic: node src/lib/main.js --agentic '{"command": "doSomething"}'
Batch: node src/lib/main.js --agentic '{"commands": ["cmd1", "cmd2"]}'
--dry-run: node src/lib/main.js --dry-run
--version: node src/lib/main.js --version
--verbose: node src/lib/main.js --verbose
--diagnostics: node src/lib/main.js --diagnostics
--status: node src/lib/main.js --status
--digest: node src/lib/main.js --digest
--simulate-error: node src/lib/main.js --simulate-error
--simulate-delay: node src/lib/main.js --simulate-delay 500
--simulate-load: node src/lib/main.js --simulate-load 1000
--apply-fix: node src/lib/main.js --apply-fix
--cli-utils: node src/lib/main.js --cli-utils

Exact Environment Configurations:
MAX_BATCH_COMMANDS: (Type: number, Default: not set, Effect: Rejects batch if number of commands exceeds value)
COMMAND_ALIASES: (Type: JSON string, e.g., '{ "ls": "list", "rm": "remove" }', Effect: Substitutes command aliases before processing)

Detailed Troubleshooting Procedures:
1. For command rejections due to batch size: Check MAX_BATCH_COMMANDS environment variable; if batch exceeds limit, the error "Batch command limit exceeded" is returned.
2. For JSON payload parsing errors: Ensure the JSON string is properly formatted; error logs will include JSON parsing error details.
3. For simulated errors: Use --simulate-error to trigger error behavior and verify system error logging; expected output: log message "Simulated error" and exit code 1.
4. For performance issues: Use --simulate-delay and --simulate-load to test system response under latency and load conditions; verify executionTimeMS values in the response.

Best Practices:
- Always validate JSON payloads before invoking agenticHandler.
- Use the --dry-run flag during testing to avoid unintended state changes.
- Monitor globalThis.callCount to track agentic command invocations over time.
- Log detailed diagnostics (using --verbose or --diagnostics) when troubleshooting integration issues.
- Ensure correct configuration of environment variables (MAX_BATCH_COMMANDS and COMMAND_ALIASES) to avoid processing errors.

Code Comment Example:
// Example: Processing a single agentic command
// Input: { "command": "doSomething" }
// Expected: Increment globalThis.callCount and return executionTimeMS for the command
// Invocation: node src/lib/main.js --agentic '{"command": "doSomething"}'


## Information Dense Extract
agenticHandler(payload:{command?:string,commands?:string[]}): returns {results:[{executionTimeMS:number,command:string}],globalCallCount:number}; CLI: --agentic, --dry-run, --version, --verbose, --diagnostics, --status, --digest, --simulate-error, --simulate-delay <ms>, --simulate-load <ms>, --apply-fix, --cli-utils; ENV: MAX_BATCH_COMMANDS (number, rejects batch > limit), COMMAND_ALIASES (JSON mapping); AWS: createSQSEventFromDigest(digest:string) returns SQS event object, digestLambdaHandler(event) with fallback messageId; Troubleshooting: JSON parse errors, batch limit exceeded error ('Batch command limit exceeded'), simulated error returns exit code 1; Best Practices: validate JSON, use --dry-run, monitor globalThis.callCount, use --verbose/--diagnostics; CLI examples exactly as provided.

## Sanitised Extract
Table of Contents:
1. Component Breakdown
   - Reusable Workflows: Located in .github/workflows, stable, GPL3 licensed with attribution.
   - Example Workflows: Located in examples, MIT licensed for demonstrative purposes.
   - The Evolving main.js: Located in src/lib/main.js, JavaScript module for reusable workflows, tracks command invocations via globalThis.callCount.
2. Agentic Library Functions
   - agenticHandler: Accepts JSON payloads (single 'command' or 'commands' array), processes each command sequentially, logs executionTimeMS for each, supports optional batch throttling via MAX_BATCH_COMMANDS.
3. CLI Options
   - --agentic: Processes command(s) as JSON payload; examples: node src/lib/main.js --agentic '{'command':'doSomething'}' or node src/lib/main.js --agentic '{'commands':['cmd1','cmd2']}'
   - --dry-run: Executes without action
   - --version: Outputs version info and timestamp
   - --verbose: Enables detailed logging
   - --diagnostics: Provides diagnostic report including configuration and Node.js version
   - --status: Outputs runtime health summary
   - --digest: Initiates SQS event simulation and processing via digestLambdaHandler
   - --simulate-error: Triggers error simulation with immediate exit
   - --simulate-delay <ms>: Delays command execution
   - --simulate-load <ms>: Simulates CPU load
   - --apply-fix: Applies fix and logs success, stops execution
   - --cli-utils: Lists all CLI commands with descriptions
4. AWS Integrations and Logging
   - AWS Functions: createSQSEventFromDigest (formats digest to SQS event), digestLambdaHandler (processes SQS messages with fallback for missing messageId)
   - Logging: logInfo and logError functions to log operations and error stacks when verbose mode is enabled

## Original Source
Agentic-lib Reusable Workflows Documentation
https://github.com/xn-intenton-z2a/agentic-lib

## Digest of AGENTIC_LIB

# Agentic-lib Technical Documentation

This document was retrieved on 2023-10-05.

# Component Breakdown

1. Re‑usable Workflows (Core Functionality)
   - Location: .github/workflows/
   - Stable, well‑tested, integrated in CI/CD pipelines
   - Licensing: GPL‑3 with attribution

2. Example Workflows (Demonstrative Content)
   - Location: examples/
   - Used for learning and experimentation
   - Licensing: MIT

3. The Evolving main.js (JavaScript Implementation)
   - Location: src/lib/main.js
   - Implements re‑usable workflows as a JS module
   - Tracks successful agentic command invocations with globalThis.callCount
   - Supports batch processing, optional throttling via MAX_BATCH_COMMANDS environment variable

# Agentic Library Functions

- Primary Function: agenticHandler
  - Accepts a JSON payload with either a single property 'command' or an array of commands ('commands')
  - For each valid command, increments global invocation counter and logs executionTimeMS (in ms)
  - Batch processing: sequential execution; if command count exceeds value in MAX_BATCH_COMMANDS, returns an error

# CLI Invocation Examples

- Single command:
  node src/lib/main.js --agentic '{"command": "doSomething"}'

- Batch processing:
  node src/lib/main.js --agentic '{"commands": ["cmd1", "cmd2"]}'

- Dry run flag:
  node src/lib/main.js --dry-run

# Additional CLI Options

--version: Displays version info from package.json with timestamp in JSON

--verbose: Activates detailed logging for debugging

--diagnostics: Outputs diagnostic report including current configuration, Node.js version, and environment variables

--status: Outputs a runtime health summary (configuration, Node.js version, callCount, uptime, select env variables)

--digest: Processes a sample digest event using a simulated SQS event

--simulate-error: Logs a simulated error and exits with a non-zero status code

--simulate-delay <ms>: Delays execution by specified milliseconds

--simulate-load <ms>: Executes a CPU‑intensive loop to simulate processing load for given ms

--apply-fix: Applies automated fixes and logs a success message "Applied fix successfully" (execution stops immediately)

--cli-utils: Displays a summary of available CLI commands with short descriptions

# AWS Integrations

- SQS Integration:
  - Function createSQSEventFromDigest: Formats a digest into a mock AWS SQS event
  - Function digestLambdaHandler: Processes incoming SQS events, handles JSON parsing errors, and accumulates failed records. Generates fallback messageId when absent.

# Environment Variables & Configuration

- MAX_BATCH_COMMANDS: Limits maximum commands in a batch. If exceeded, returns error.

- COMMAND_ALIASES: JSON mapping for command alias substitution (e.g., { "ls": "list", "rm": "remove" })

# Logging

- Functions: logInfo and logError provide detailed logging with configuration details and error stacks (activated when verbose mode is enabled)

# Licensing and Attribution

- Licensed under GNU General Public License (GPL‑3) for core workflows and MIT for example workflows
- Any derived work must include: "This work is derived from https://github.com/xn-intenton-z2a/agentic-lib"


## Attribution
- Source: Agentic-lib Reusable Workflows Documentation
- URL: https://github.com/xn-intenton-z2a/agentic-lib
- License: License: Mixed (GPL and MIT as indicated within individual files)
- Crawl Date: 2025-04-25T04:02:34.679Z
- Data Size: 664104 bytes
- Links Found: 5178

## Retrieved
2025-04-25
