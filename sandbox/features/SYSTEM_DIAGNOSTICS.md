# Overview

Introduce a new diagnostics command to the CLI that outputs key runtime and environment details in JSON format. This feature empowers users to quickly gather system information for debugging, automation, or telemetry purposes.

# Functional Requirements

- Support the following command flags:
  - --diagnostics (alias: --diag): Collect and print a JSON object containing:
    - nodeVersion: The Node.js version string (process.version)
    - platform: The operating system platform (process.platform)
    - architecture: CPU architecture (process.arch)
    - cwd: Current working directory (process.cwd())
    - uptime: Process uptime in seconds (process.uptime())
    - memoryUsage: process.memoryUsage() object with rss, heapTotal, heapUsed properties
- When invoked with --diagnostics or --diag, log only the diagnostics JSON to stdout and exit with code 0.
- If combined with other flags, --diagnostics takes precedence and triggers only diagnostic output.

# Tests

- Test that invoking main with ["--diagnostics"] logs parseable JSON with all required keys.
- Test that the types of each value match the expected JavaScript types:
  - nodeVersion is a string
  - platform is a string
  - architecture is a string
  - cwd is a string
  - uptime is a number
  - memoryUsage is an object with numeric rss, heapTotal, heapUsed
- Test alias: invoking main with ["--diag"] produces equivalent output.
- Test that arbitrary flags do not trigger diagnostics unless --diagnostics or --diag is explicitly present.

# Documentation

- Update README.md to document the new diagnostics command under the "Commands" section:
  - Describe purpose of --diagnostics and --diag
  - Provide an example:
    npm run start -- --diagnostics
  - Show sample JSON output in the README

# Implementation Notes

- Use built-in process APIs to collect runtime information; no new dependencies required.
- Extend the existing flag parsing logic in src/lib/main.js to detect --diagnostics or --diag before other commands.
- Ensure JSON.stringify is used with two-space indentation for readability.
- Maintain compatibility with ESM and Node >=20.