# SYSTEM_UTILS & DEBUGGING

## Overview
This updated feature consolidates persistent configuration management, file logging, and now robust debugging tools into a single module. Users can view and modify CLI settings with a persistent JSON configuration file, log every command’s output, and trigger an extended debug mode to inspect internal state. This unification streamlines system introspection and auditability, reinforcing our mission of healthy collaboration and practical automation.

## CLI Integration

### Configuration Management & Persistent Logging
- **Configuration Commands:** Utilize the `--config` flag with subcommands:
  - `get [key]`: Retrieve specific or all configuration values from a persistent JSON file.
  - `set <key> <value>`: Update and save configuration settings.
  - `reset`: Reinitialize settings to default values.
- **File Logging:** With the global flag `--log-file <filename>`, every command’s output is appended in a JSON structured format to the specified file.

### Debugging Mode
- **Activation:** Introduce a new global flag `--debug` that can be used alongside other commands.
- **Behavior:** When the `--debug` flag is active, the system outputs extended diagnostic information including:
  - Current environment variables relevant to the CLI (e.g., `INVALID_TOKENS`, `ALLOW_NAN`, `TOKEN_PUNCTUATION_CONFIG`, and `DYNAMIC_WARNING_INDEX`).
  - Active configuration settings and their loaded state.
  - A summary of recent command audit logs (number of commands executed, execution durations, and any error counts).
  - Optional cache and performance metrics if available.
- **Output Modes:** Debug information is integrated into the normal output format:
  - In plain text mode, debug details are appended at the end of the command output in a clearly delimited section.
  - In JSON mode (with `--json` or `--json-pretty`), a dedicated `debug` field is added containing the diagnostic data.

## Implementation Details

- **File Operations:** On first run, a configuration file (e.g., `config.json`) is created if missing. All read/write operations include error checks and fallbacks.
- **Logging:** Every CLI command is logged with metadata including timestamp, version, execution duration, and cleansed input parameters. Logs are written using Node’s `fs` module.
- **Debug Data Collection:** When `--debug` is provided, internal state is collected:
  - Environment configurations
  - Current settings from the persistent configuration file
  - Aggregated audit log statistics
  - Any cached computation data (if caching is enabled in related modules)
- **Error Handling:** Errors in configuration or file operations trigger clear messages without halting the debug output. If the debug mode encounters issues, warnings are issued but core configuration data is still returned.

## Testing & Documentation

- **Unit Tests:** Tests will simulate configuration gets/sets/resets, file logging operations, and debug command invocations to verify that state data and environment details are correctly output in both plain text and JSON formats.
- **Documentation:** Update the README and CLI usage guides with examples:
  - Without Debug: `node src/lib/main.js --config get`
  - With Debug: `node src/lib/main.js --debug --config get`
  - Logging Example: `node src/lib/main.js --log-file history.log --sum 3 4 5 --debug`

## Alignment with Repository Mission
By merging persistent configuration, file logging, and an enhanced debugging mode into SYSTEM_UTILS, this feature provides comprehensive system introspection. It enhances transparency and traceability, streamlines troubleshooting, and solidifies the repository’s commitment to modular, self-contained CLI utilities that promote healthy collaboration and efficient automation.