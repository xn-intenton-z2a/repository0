# CLI_PARSER

# Description
Add robust command line argument parsing to the main CLI function. Replace the raw JSON string output with a structured options object parsed from process arguments.

# Flags and Subcommands
1. help prints usage information and exits
2. diagnostics enables diagnostic mode for detailed output
3. serve starts a simple HTTP server on a default port
4. build-intermediate and build-enhanced perform staged build operations
5. refresh reloads configuration and data
6. merge-persist merges data and persists changes to disk

# Implementation
Modify src/lib/main.js to import its existing dependencies and use zod to define a CLI schema for allowed flags and options. Slice process.argv to extract user input, validate against the schema, and produce an options object. When help is requested or validation fails, display usage text and exit with status 0 or nonzero as appropriate. Export a parseArgs function for testing.

# Testing
Extend tests in tests/unit/main.test.js. Add unit tests for parseArgs to confirm correct parsing of each flag and flag combinations. Test that help triggers process exit with code 0 and outputs the usage text.

# Documentation
Update README.md to include a new section on CLI usage and flags. Provide inline examples of running npm run start with each flag and expected behavior without using fenced code blocks.