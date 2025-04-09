# DRY_RUN

## Overview
This feature introduces a dry-run mode to the CLI tool. When enabled via a new global flag (`--dry-run`), the tool simulates the execution of any command without performing side effects, logging, or invoking external processes. This mode is particularly useful for debugging, testing scripts, and verifying command inputs without modifying state or triggering actions like HTTP calls or file logging.

## CLI Integration
- **Flag Addition:** Introduce a new global flag `--dry-run` that can be used in combination with any other command.
- **Behavior:** When `--dry-run` is active, the CLI will parse and validate command inputs, then produce a structured output indicating what would be executed, including all computed results, potential warnings, and metadata. No external side effects (e.g., file logging, scheduled command execution, HTTP API calls) will occur.
- **Output:** In dry-run mode, the tool will output all computed values and actions in both plain text and JSON modes, mirroring the normal execution output while explicitly stating that this is a simulated run.

## Implementation Details
- **Input Parsing:** The existing input parsing logic is reused. Before invoking the command handler, the tool checks if `--dry-run` is set. If so, it routes the command through a simulation wrapper.
- **Simulation Wrapper:** Each command’s handler is wrapped so that it collects the intended actions and computed results without executing side effects. For example, scheduled executions in TIMER or external API calls in HTTP_API are bypassed with a warning message indicating that these actions would have been executed in a normal run.
- **Diagnostic Output:** The dry-run output includes detailed metadata such as timestamp, version, execution duration (simulated), input echo, and a special flag indicating that the command was not executed for real.

## Error Handling & Validation
- **Consistent Reporting:** Validation and error handling are performed as usual, ensuring that users receive the same warnings and errors. However, any operation that would trigger state changes or side effects is instead logged as a simulated action.
- **Fallback:** If a command inherently requires state changes that cannot be simulated, the tool will report this limitation while still processing the remainder of the input.

## Testing & Documentation
- **Unit Tests:** New tests should simulate dry-run invocations across different commands (e.g., arithmetic operations, configuration queries, and scheduling commands) to ensure the output correctly indicates a dry-run. Tests must also verify that no external systems are affected during simulation.
- **Documentation:** Update the README and CLI usage guides with examples demonstrating dry-run usage:
  - Example: `node src/lib/main.js --dry-run --sum 3 4 5`
  - Document that dry-run mode is meant for testing and validation and does not perform any irreversible actions.

## Alignment with Repository Mission
The DRY_RUN feature aligns with the repository’s mission by enhancing the modular, self-contained CLI utility’s usability and safety. By allowing users to simulate command execution, the tool promotes healthy collaboration and reduces risk during development and automation workflows.