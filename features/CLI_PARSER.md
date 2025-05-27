# CLI_PARSER

# Description
Extend the existing command-line interface to include a version flag alongside help, diagnostics, HTTP serving, build workflows, configuration validation, and data persistence. When the version flag is provided, the tool reports its current version and exits.

# Flags and Subcommands
1. --help               Show usage information and exit
2. --version            Show the tool version and exit
3. --diagnostics        Collect and display system and environment diagnostics and exit
4. --serve              Start an HTTP server on a configurable port
5. --build-intermediate Perform staged build operations to generate an intermediate manifest
6. --build-enhanced     Execute enhanced build transformations on the intermediate manifest
7. --refresh            Reload, validate, and normalize configuration from JSON or YAML files
8. --merge-persist      Merge data sources and persist the combined result to disk

# Version Flag
When --version is provided:
- Read the version field from package.json
- Print the version string to stdout
- Exit with status code 0

# Implementation
- In src/lib/main.js, update parseArgs to detect the version flag
- Export a new function printVersion() that reads package.json and returns the version string
- In main(args), if options.version is true, call printVersion(), console.log the version, and exit 0

# Testing
- In tests/unit/main.test.js add unit tests for parseArgs(["--version"]) to assert version flag is true
- Add tests for printVersion(): mock package.json import, verify returned value matches mocked version
- Test main(["--version"]) to spy on console.log and process.exit, confirming correct version output and exit code

# Documentation
- Update README.md under CLI Usage to include --version flag description
- Provide inline examples: npm run start --version should output the current version, for example 1.2.0-0