# CLI Utilities Usage

This document describes the available CLI commands and how to invoke them using the dynamic help message feature.

## Dynamic Help Message

When you run the CLI without any arguments, or with the `--help` flag, the application displays a dynamic help message that lists all available CLI commands and their descriptions.

### Available Commands:

- **--agentic:** Processes command(s) as JSON payload.
- **--dry-run:** Executes without action.
- **--version:** Outputs version info and timestamp.
- **--verbose:** Enables detailed logging.
- **--diagnostics:** Provides diagnostic report including configuration and Node.js version.
- **--status:** Outputs runtime health summary.
- **--digest:** Initiates SQS event simulation and processing via digestLambdaHandler.
- **--simulate-error:** Triggers error simulation with immediate exit.
- **--simulate-delay <ms>:** Delays command execution.
- **--simulate-load <ms>:** Simulates CPU load.
- **--apply-fix:** Applies fix and logs success, stops execution.
- **--cli-utils:** Outputs all CLI commands and their descriptions in a structured JSON format.

## How to Invoke

Simply run the CLI using Node.js:

    node src/lib/main.js --help

Or simply:

    node src/lib/main.js

Both methods will display the available commands, ensuring you always have an up-to-date overview of CLI options.

To get the list in a JSON formatted output, run:

    node src/lib/main.js --cli-utils

This will output a structured JSON string of the commands which can be programmatically processed if required.

## Example

To see the help message in action, run:

    node src/lib/main.js --help

To see the JSON formatted command list, run:

    node src/lib/main.js --cli-utils
