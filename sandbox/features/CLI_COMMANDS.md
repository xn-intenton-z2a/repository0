# CLI Commands

Introduce standard command-line flags to enhance the main CLI utility beyond simple argument echoing, fully implementing help and version outputs alongside the existing mission and echo behaviors.

# Behavior

- --help, -h
  - Display usage instructions listing all available commands and their descriptions.  
  - Usage should include flag names, shorthand, and a brief description for each flag.
- --version, -v
  - Output the current version number as defined in package.json.  
- --mission, -m
  - Read and display the contents of MISSION.md to inform the user of the repository mission.  
- No flags or only positional arguments
  - Echo the provided arguments as before.
- Unknown flags
  - Print an error message indicating the unknown flag, display usage, and exit with a non-zero status.

# Implementation

1. Dependencies
   - Already import minimist for argument parsing.  
   - Use fs/promises for file reads.
2. CLI Entrypoint (sandbox/source/main.js)
   - Extend the minimist configuration to include alias for help and version.
   - After parsing, check in order:  
     - If help flag is set, print usage text and exit 0.  
     - Else if version flag is set, read package.json version and print it, then exit 0.  
     - Else if mission flag is set, read MISSION.md and print it, then exit 0.  
     - Else if any unknown non-positional flags present, print error and usage, exit 1.  
     - Else delegate to echoMain for positional arguments.
3. Echo Function (src/lib/main.js)
   - Remain unchanged, logging arguments with JSON.stringify.
4. Usage Text
   - Define a static usage string or generate dynamically reading flag descriptions.
   - Ensure usage text matches spec in README and docs.

# Testing

- sandbox/tests/cli-commands.test.js
  - Verify --help and -h produce usage text containing flag list.  
  - Verify --version and -v output the version from package.json.  
  - Verify --mission and -m output MISSION.md content (existing tests cover mission).  
  - Verify no flags fallback to echo behavior.  
  - Verify unknown flags (e.g. --foo) produce error message, usage, and exit code non-zero.
  
- Update tests/unit/main.test.js if needed to stub version lookup and filesystem reads.

# Documentation

- Update README.md:
  - Add a section CLI Usage showing examples for --help, --version, --mission, unknown flag, and default echo.
  - Link to USAGE.md or embed usage text.
- Update sandbox/docs/USAGE.md to include help and version options and examples.
