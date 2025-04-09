# CONFIG_MANAGER

## Overview
This feature enhances the current configuration output functionality by allowing users to both view and update runtime configuration settings. The CLI command now supports sub-commands to get, set, and reset configuration values that control behaviors such as numeric parsing (e.g., INVALID_TOKENS, ALLOW_NAN), punctuation stripping (TOKEN_PUNCTUATION_CONFIG), and warning options (DYNAMIC_WARNING_INDEX, DISABLE_NAN_SUGGESTION). Configuration changes are persisted to a local JSON file (e.g., .repository0config.json), enabling customization across sessions.

## CLI Integration
- **Command Flag:** The same flag `--config` is extended to support sub-commands:
  - `get`: Displays the current configuration settings.
  - `set <key> <value>`: Updates a configuration key with the provided value.
  - `reset`: Resets the configuration to default settings.
- **Implementation Details:**
  - On `get`, the command reads from the persistent config file as well as environment variables to show effective settings.
  - On `set`, the command validates that the key is among the allowed configuration keys and that the value is valid. The new setting is saved both in memory and to the persistent JSON file.
  - On `reset`, the command removes the persistent file or resets it to default values.
  - Fallback: If no sub-command is provided, the command behaves as the original `--config` by outputting the effective configuration.

## Error Handling & Validation
- Proper validation ensures that only pre-defined configuration keys can be modified. Invalid keys or values return an error message with usage instructions.
- File I/O errors when reading or writing the persistent configuration file are caught and reported, ensuring that the primary CLI functionality continues without disruption.

## Testing & Documentation
- **Unit Tests:** New tests cover all sub-commands (get, set, reset) to ensure configuration changes are correctly applied and persisted.
- **Documentation:** The README and CLI usage guides are updated with examples:
  - `node src/lib/main.js --config get`
  - `node src/lib/main.js --config set ALLOW_NAN true`
  - `node src/lib/main.js --config reset`
- Inline code comments explain the validation and persistence logic.

## Alignment with Repository Mission
By enabling dynamic configuration management, the CONFIG_MANAGER feature fosters healthy collaboration and flexibility, allowing users to tailor the tool’s behavior to specific workflows. This improvement aligns with the repository’s mission of providing modular, self-contained utilities with practical customization options.