# Description

Enhance the existing argument echo functionality by introducing built-in commands for help, version, and mission. This feature transforms the CLI into a more user-friendly tool that surfaces usage guidance, version information, and the repository mission statement.

# Behavior

When the CLI is invoked with one of the recognized flags, the command performs the following actions:

- --help or -h  
  Prints a usage summary describing available commands and options, then exits.

- --version or -v  
  Reads version from package.json and prints the version string, then exits.

- --mission  
  Reads the contents of MISSION.md and prints the mission statement to the console, then exits.

- No recognized flags  
  Falls back to original behavior: echoes the provided arguments array.

# CLI Interface

The CLI located in src/lib/main.js now supports the following invocation patterns:

  node src/lib/main.js --help
  node src/lib/main.js -h
  node src/lib/main.js --version
  node src/lib/main.js -v
  node src/lib/main.js --mission
  node src/lib/main.js arg1 arg2 ...

# Implementation Details

- Add dependency on minimist (already declared) to parse flags.
- Import version from package.json via the ESM import statement.
- Use fs/promises to asynchronously read MISSION.md when --mission is passed.
- Ensure that only one command is executed per invocation and that unrecognized flags do not disrupt fallback behavior.
- Maintain original console output format when echoing arguments.

# Testing

- Update tests/unit/main.test.js to include cases covering --help, --version, and --mission flags, asserting that the correct content is printed without errors.
- Add feature-level tests in sandbox/tests/main-commands.test.js to simulate each flag invocation and verify exit behavior.
- Ensure fallback echo behavior remains covered by existing tests.
