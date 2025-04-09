# CONFIG_HANDLER

## Overview
This feature consolidates environment configuration management into a single, unified module. It now not only loads and watches configuration changes from a `.env` file but also tracks and reports differences between configuration reloads. This enhancement helps developers quickly identify what has changed in the environment, supporting automated workflows and robust debugging in line with the repository’s mission.

## Implementation Details
- **Initialization:**
  - At startup, load environment variables using the `dotenv` package.
  - Optionally validate the loaded configuration using a schema validator (e.g. with `zod`).

- **Dynamic Reloading and Diffing:**
  - Use Node.js's `fs.watch` API to monitor the `.env` file for changes. When a modification is detected, automatically reload the configuration.
  - Compare the new configuration with the previously stored configuration.
  - Generate a diff report highlighting changes (added, removed, or modified keys).
  - If the CLI flag `--config-diff` is provided, output the diff report to the console. Optionally, the diff report can also trigger an event or be logged for later analysis.

- **Integration:**
  - Integrate this enhanced module into the main CLI entry point (`src/lib/main.js`) so that configuration is loaded, diffed, and watched prior to processing any CLI commands.
  - Ensure graceful error handling if the `.env` file is missing, unreadable, or fails validation.

## Testing
- **Unit Tests:**
  - Simulate scenarios where the `.env` file is updated during runtime and verify that the new configuration values are correctly loaded.
  - Verify that the diff functionality correctly identifies changes between successive loads.
  - Test edge cases such as file access errors or invalid configuration content.

## Documentation
- Update the README and CONTRIBUTING documents to include a section on dynamic configuration management with the diff functionality.
- Provide usage examples and instructions, e.g.:
  ```bash
  # Reload configuration and show differences
  node src/lib/main.js --config-diff
  ```
- Explain the benefits of having both dynamic reloading and a diff report for troubleshooting and change auditing.
