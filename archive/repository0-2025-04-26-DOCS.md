docs/USAGE.md
# docs/USAGE.md
# CLI Utilities Usage

This document describes the available CLI commands and how to invoke them using the dynamic help message feature.

## Dynamic Help Message

When you run the CLI without any arguments, or with the `--help` flag, the application displays a dynamic help message that lists all available CLI commands and their descriptions.

### Available Commands:

- **--agentic:** Processes command(s) as JSON payload.
- **--dry-run:** Executes without action.
- **--version:** Outputs version info and timestamp in the format:
  
        Version: <semver>, Timestamp: <ISO8601>
  
  This output is generated dynamically by reading the version from `package.json` and using the current time.
- **--verbose:** Enables detailed logging.
- **--diagnostics:** Provides a diagnostic report including:
  - Version (from `package.json`)
  - Timestamp (current ISO8601 format)
  - Node.js Version
  - Platform
  - Memory usage report
- **--status:** Outputs runtime health summary.
- **--digest:** Initiates SQS event simulation and processing via digestLambdaHandler.
- **--simulate-error:** Triggers error simulation with immediate exit.
- **--simulate-delay <ms>:** Delays command execution.
- **--simulate-load <ms>:** Simulates CPU load.
- **--apply-fix:** Applies fix and logs success, stops execution.
- **--cli-utils:** Outputs all CLI commands and their descriptions in a structured JSON format.
- **--interactive:** Launches an interactive prompt where you can select a command from a list. Upon selection, the CLI confirms your choice.

## Version and Diagnostics

The following flags provide detailed information about the runtime environment:

### Version Flag

Invoking the CLI with the `--version` flag will output a single line containing the version and timestamp. For example:

    node src/lib/main.js --version

Expected output:

    Version: 2.1.0-0, Timestamp: 2025-04-25T22:44:19.123Z

### Diagnostics Flag

Invoking the CLI with the `--diagnostics` flag will output a multi-line diagnostic report. For example:

    node src/lib/main.js --diagnostics

Expected output:

    Version: 2.1.0-0
    Timestamp: 2025-04-25T22:44:19.123Z
    Node.js Version: v20.x.x
    Platform: linux
    Memory Usage: { ... }

This information helps in assessing the current runtime state as well as system details.

## How to Invoke

Simply run the CLI using Node.js:

    node src/lib/main.js --help

Or simply:

    node src/lib/main.js

Both methods will display the available commands, ensuring you always have an up-to-date overview of CLI options.

To get the list in a JSON formatted output, run:

    node src/lib/main.js --cli-utils

This will output a structured JSON string of the commands which can be programmatically processed if required.

### Interactive Mode

Interactive mode improves the user experience by letting you choose a command from a list. Run the CLI with the `--interactive` flag:

    node src/lib/main.js --interactive

You will be presented with a list of available commands. After making a selection, the CLI will display a confirmation message such as:

    You selected: --agentic
