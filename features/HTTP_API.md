# HTTP_API

## Overview
This feature introduces an HTTP API endpoint for the repository0 CLI tool. In addition to the current command-line functionality, users can now interact with the tool via RESTful HTTP calls. The API exposes a subset of core CLI operations (e.g., arithmetic, statistical computations, diagnostics, configuration) and returns responses in JSON format with full metadata. This extension facilitates integration with web services, automated workflows, and remote monitoring.

## API Endpoints
- **GET /health**: Returns a basic healthcheck message (e.g., "All systems operational.") along with metadata.
- **POST /command**: Accepts a JSON payload containing a command (e.g., "--sum") and its arguments. The server processes the request as if it were passed to the CLI and returns the result with metadata (timestamp, executionDuration, inputEcho, version, warnings, etc.).
- **GET /config** and **GET /diagnostics**: Mirror the respective CLI commands.

## Session History & Audit Logging (New Extension)
To enhance traceability and support auditing of CLI interactions, this update extends the HTTP_API feature with session history capabilities. All CLI commands executed through the API (and optionally through the CLI directly when using JSON mode) will be logged in an in-memory audit trail. Optionally, this session history can be persisted to a local file for later inspection.

### New Endpoints & CLI Flag
- **GET /history**: Returns a list of recently executed commands with their metadata including timestamp, command name, input arguments, result, and any warnings. This endpoint allows users and monitoring tools to review the audit log of CLI interactions.
- **CLI Flag --history**: When invoked in CLI mode, this flag outputs the current session's command history. The output respects the global JSON mode settings (plain text or JSON with metadata).

### Implementation Details
- **Audit Logging Mechanism**: Each time a CLI command is executed (either via an HTTP POST to /command or direct CLI invocation), the command details along with its result (or error), warnings, and execution metadata are appended to an in-memory log structure. Optional persistence can be achieved by writing this log to a file (e.g., `history.log`) when the session ends or on demand.
- **Response Handling**: The new /history endpoint aggregates and returns the log entries in JSON format. In CLI mode, the --history flag triggers a retrieval and display of these log entries.
- **Error Management & Data Retention**: In case of failures in writing or reading the history log, the system gracefully falls back to in-memory logging without impacting primary functionality. The log retains entries for the duration of the session and may be configured to rollover or clear after a defined threshold.

## Testing & Documentation
- **Unit Tests**: Extend tests to simulate API calls to the /history endpoint and CLI invocations with the --history flag. Verify that all executed commands are correctly logged and the audit trail returns the expected metadata.
- **Documentation**: Update the README and API usage instructions to include examples for retrieving session history:
  - Example CLI: `node src/lib/main.js --history`
  - Example API: `curl http://localhost:3000/history`
- **Inline Comments**: In `src/lib/main.js`, document the audit logging logic and how command history is maintained and retrieved.

## Alignment with Repository Mission
By extending the HTTP_API feature with session history and audit logging capabilities, this update reinforces the mission of promoting healthy collaboration and streamlined automation. Users gain enhanced visibility over CLI interactions, facilitating debugging, monitoring, and integration into broader automation workflows.