# CLI Commands

Introduce standard command-line flags to enhance the main script as a true CLI utility.

# Behavior

- --help, -h: Display usage instructions listing all available commands and their descriptions.
- --version, -v: Output the current version number as defined in package.json.
- --mission, -m: Read and display the contents of MISSION.md to inform the user of the repository mission.
- No flags or only positional arguments: Echo the provided arguments as before.
- Unknown flags: Print an error message, display usage, and exit with a non-zero status.

# Implementation

1. Add dependency on minimist for argument parsing (or reuse existing minimist import).
2. In src/lib/main.js:
   - Parse argv using minimist to detect flags.
   - For help/version/mission flags, perform the file read or version lookup and print appropriate output.
   - For unknown flags, show error and help.
   - Preserve existing argument echo functionality when no flags are set.
3. Update sandbox/source/main.js to delegate to the enhanced main function.
4. Modify package.json scripts or dependencies only if necessary to support file reading (no new packages beyond minimist). 

# Testing

- Write unit tests in tests/unit/main.test.js to cover each flag:
  - Verify help output contains usage lines.
  - Verify version output matches package.json version.
  - Verify mission output matches MISSION.md content.
  - Verify positional arguments are echoed correctly.
  - Verify unknown flags produce an error and exit code.
- Use Vitest to stub filesystem reads of MISSION.md and package version if needed.

# Documentation

- Update README.md to include:
  - A CLI usage section showing examples for --help, --version, --mission, and argument echo.
  - Link to MISSION.md and section describing mission flag usage.
