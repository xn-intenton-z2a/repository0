# CLI Tool Functionality

Add a set of standard command-line options to the main script to transform it into a user-friendly CLI that demonstrates core repository capabilities. The CLI should support:

1. --help    : Display usage instructions and available commands.
2. --version : Print the package version from package.json.
3. --mission : Output the contents of MISSION.md to show repository mission.
4. Default   : Echo the positional arguments in JSON format.

# Source File Changes

- Update src/lib/main.js to import a command-line parser (minimist) and file system module.
- Read package.json to get version and read MISSION.md for mission text.
- Implement a switch on parsed options to handle help, version, mission, or default echo behavior.

# Tests

- Extend tests/unit/main.test.js to cover each CLI option:
    • When invoked with --help, verify that usage text is printed and process exits normally.
    • When invoked with --version, verify printed version matches package.json.
    • When invoked with --mission, verify printed mission contains a known heading from MISSION.md.
    • When invoked without options, ensure it echoes the provided arguments as JSON.
- Add tests in tests/unit/module-index.test.js if necessary to verify index export remains undefined.

# README Updates

- Update the Usage section to document the new CLI options with examples:
    npm run start -- --help
    npm run start -- --version
    npm run start -- --mission
    npm run start -- foo bar

- Provide sample output for each option.

# Dependencies

- Ensure minimist is listed under dependencies (already present).
- No new dependencies required.
