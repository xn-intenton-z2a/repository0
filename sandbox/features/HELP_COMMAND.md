# Help Command

## Overview
The CLI will support a `--help` flag that displays detailed usage instructions, available flags, and examples. This enhances user experience by providing built-in guidance without referring to external documentation.

## Behavior
- When invoked with `--help`, the CLI prints:
  - A short description of the tool based on the repository mission.
  - A list of supported flags (`--help`, `--mission`, `--version`) with explanations.
  - Usage examples for common workflows.
- After displaying help text, the process exits with code 0.
- The help text is printed to standard output.

## Implementation Details
- Modify `sandbox/source/main.js` to detect the `--help` flag before other flags and output the help message.
- Ensure ordering: `--help` takes precedence over other flags. If both `--help` and other flags are present, only help is shown.

## Tests
- Add a feature-level test in `sandbox/tests/help.test.js` covering:
  - Invoking main with `--help` prints expected help content and exits with code 0.
  - No side effects when `--help` is provided.

## Documentation
- Update `sandbox/docs/USAGE.md` and `sandbox/docs/README.md` to include help usage section.
- Examples:
  - `npm run start -- --help` prints usage instructions.

## Compatibility
- Follows existing CLI structure.
- No new dependencies required.
