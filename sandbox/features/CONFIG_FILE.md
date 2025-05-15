# Config File Support

# Purpose
Allow users to define default CLI options in a JSON or YAML config file to avoid repeating common flags and streamline workflows.

# CLI Behavior
- Introduce a --config flag that accepts a path to a config file. If omitted, the tool searches for .plotconfig.json or .plotconfig.yaml in the current working directory then in the user home directory.
- Config file may include default values for range, resolution, output, export data filename, stroke color, stroke width, fill color, background color, serve port, and other supported CLI options.
- Merge config values with CLI flags so that explicit CLI flags always take precedence over config defaults.

# Implementation Details
- In sandbox/source/main.js parse raw args for --config flag before existing parsing logic. Determine config file path or default locations.
- Use js yaml library to parse JSON or YAML if file exists. On parse errors or missing file when explicitly specified, output descriptive error and exit with code 1.
- Merge parsed config object into minimist defaults and args array before handling help version mission serve polar and plot logic.
- Ensure type conversion and validation follow existing patterns for numeric and string options.

# Testing
- Add sandbox tests config-file.test.js covering:
  - CLI using a valid config file providing default range and output values without explicit flags generates plot with those values.
  - CLI with invalid config path or malformed content prints error message and exits nonzero.
  - CLI passing both config file and explicit flags applies explicit flags over config values.

# Documentation
- Update sandbox/docs/CLI_USAGE.md under global options to document --config flag, search order and config file format examples.
- Update README.md features section to mention Config File Support.