# CLI Flags Support

# Overview
Enhance the main script to accept and process standard CLI flags such as --help and --version without external dependencies.

# Behavior
When invoked with --help, display usage instructions and list available flags.
When invoked with --version, read and output the version from package.json.
When invoked without flags or with unrecognized flags, fallback to existing behavior: log the provided arguments.

# Implementation
Use process.argv to detect flags, format output to stdout, and exit cleanly. Maintain ESM module style. No additional dependencies.

# Tests
Add unit tests to verify:
- --help produces the expected usage message.
- --version outputs the version matching package.json.
- Default invocation logs arguments as before.
Ensure existing tests continue to pass.