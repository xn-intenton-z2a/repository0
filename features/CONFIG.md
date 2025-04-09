# CONFIG with SYSTEM_INFO & PERSISTENCE

## Overview
This enhanced CONFIG feature continues to report the current CLI tool settings (e.g., TOOL_VERSION, INVALID_TOKENS, DYNAMIC_WARNING_INDEX) and detailed system information, while adding persistent configuration management. Users can now view and modify default settings in a persistent JSON file (e.g., config.json) directly via the CLI. This unified module not only displays configuration and system diagnostics but also supports read and write operations for user-specific settings, reinforcing the repository’s mission of transparency, streamlined automation, and healthy collaboration.

## CLI Integration
- **Command Flag:** The `--config` flag remains in use. In addition to outputting current information, it now supports subcommands:
  - `get [key]`: Displays the value of a specific configuration key. If no key is provided, it displays all current settings.
  - `set <key> <value>`: Updates the configuration persistently in the configuration file (e.g., config.json).
  - `reset`: Resets the configuration file to default settings.
- **System Information:** As before, the command gathers system details using Node’s `os` and `process` modules (OS type, Node version, process ID, uptime, and memory usage) and includes them in the output.

## Persistent Configuration Management
- **Configuration File:** A file named `config.json` will be used to store persistent settings. On first run, if the file does not exist, it will be created with default values (e.g., `INVALID_TOKENS: "nan"`, `DYNAMIC_WARNING_INDEX: "false"`, etc.).
- **Read/Write Operations:**
  - **Get Mode:** When invoked with `--config get [key]`, the tool reads the configuration file and outputs the requested setting(s).
  - **Set Mode:** With `--config set <key> <value>`, the CLI validates the key and updates the configuration file accordingly, providing confirmation to the user. Supported keys include, but are not limited to, `INVALID_TOKENS`, `DYNAMIC_WARNING_INDEX`, and other future configurable options.
  - **Reset Mode:** The `--config reset` option reinitializes the configuration file to its default settings.
- **Integration with Global Flags:** Updates to configuration affect behavior such as numeric parsing, warning index reporting, and JSON output formatting.

## Error Handling & Validation
- Invalid keys or values will result in clear error messages. For example, attempting to set `DYNAMIC_WARNING_INDEX` to an invalid value will prompt a standardized error message.
- File I/O issues (e.g., inability to create or update `config.json`) will be caught and an error message will be displayed without terminating the CLI unexpectedly.

## Testing & Documentation
- **Unit Tests:** Extend existing tests to cover the new persistent configuration commands. Tests should simulate file creation, get/set operations, and resetting to default values.
- **Documentation:** Update the README and CLI usage documentation to include examples such as:
  - `node src/lib/main.js --config` (to display current settings and system info)
  - `node src/lib/main.js --config get DYNAMIC_WARNING_INDEX`
  - `node src/lib/main.js --config set INVALID_TOKENS "NaN,undefined"`
  - `node src/lib/main.js --config reset`
- **Inline Comments:** In `src/lib/main.js`, document the new persistent configuration management logic and file I/O operations for clarity.

## Alignment with Repository Mission
By merging detailed system reporting with persistent configuration management, this feature furthers our mission of promoting healthy collaboration and streamlined automation. Users gain transparency not only into the current state of the CLI tool but also into how its behavior can be customized persistently, enhancing both diagnostics and user experience in a modular, single-source environment.