# CLI_ERROR_HANDLING

# Description
Enhance the CLI parser to handle unknown or invalid flag combinations gracefully. Provide clear, user-friendly error messages and usage guidance when unrecognized flags or conflicting options are supplied.

# Validations
1. Unknown Flags
   - Detect any argument not in the supported flags list.
   - Print an error: "Error: Unknown option: <flag>".
   - Display usage information and exit with code 1.
2. Conflicting Flags
   - Identify mutually exclusive flags (e.g., --help combined with --serve).
   - Print an error: "Error: Conflicting options: <flag1> cannot be used with <flag2>".
   - Display usage information and exit with code 1.

# Implementation
- In `src/lib/main.js`:
  - Extend `parseArgs(args)`:
    - Validate each `arg` against the supported flag map.
    - On unknown flags, call `printUsage()` after printing the error message.
    - Check for defined conflicting flag pairs and error if both are present.
- Ensure `main(args)` never processes invalid or conflicting flags.

# Testing
- In `tests/unit/main.test.js`:
  - Add unit tests for `parseArgs`:
    * Unknown flag `--foo` should throw exit(1) and log error and usage.
    * Conflicting flags like `['--help','--serve']` should throw exit(1) and log a conflict error.
  - Spy on `console.error`, `console.log`, and `process.exit` to assert behavior.

# Documentation
- Update `CLI_USAGE.md`:
  - Document the error handling behavior for unknown and conflicting flags.
  - Provide examples:
    * `npm run start -- --foo` → Error: Unknown option: --foo
    * `npm run start -- --help --serve` → Error: Conflicting options: --help cannot be used with --serve