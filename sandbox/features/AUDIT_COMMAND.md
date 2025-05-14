# Audit Command

## Overview
Add an --audit flag to the CLI that runs npm audit and reports security vulnerabilities, enabling users to quickly identify and address dependency issues.

## Behavior
- Detect an audit boolean option in CLI arguments.
- Invoke npm audit --json in the repository root using a child process.
- If the command returns valid JSON with a vulnerabilities object:
  - Parse the JSON containing vulnerability details.
  - If vulnerabilities are present, print a formatted JSON object with two-space indentation and exit with code 0.
  - If no vulnerabilities found, print 'No vulnerabilities found.' to standard output and exit with code 0.
- On spawn failure or invalid JSON parse, print a descriptive error message to standard error and exit with code 1.

## Implementation Details
- In sandbox/source/main.js, extend minimist options to include audit mapped to audit boolean.
- After the outdated branch, add an else if (audit) branch that:
  - Imports child_process and calls spawnSync('npm', ['audit', '--json'], { encoding: 'utf8' }).
  - Checks result.error or non-zero result.status to detect execution errors.
  - Parses result.stdout when available:
    - If parse succeeds and parsed.vulnerabilities has keys, console.log(JSON.stringify(parsed, null, 2)).
    - If parsed.vulnerabilities is empty or stdout empty, console.log('No vulnerabilities found.').
  - Wrap spawn and parse in a try catch to handle exceptions and call process.exit with the appropriate code.

## Tests
- Create sandbox/tests/audit.test.js with scenarios:
  - With Vulnerabilities: Mock child_process.spawnSync to return a stdout string of JSON containing vulnerabilities and status 0. Invoke main(['--audit']) and assert console.log is called with formatted JSON and process.exit(0).
  - No Vulnerabilities: Mock spawnSync to return parsed.vulnerabilities empty or empty stdout and status 0. Assert console.log is called with 'No vulnerabilities found.' and process.exit(0).
  - Spawn Failure: Mock spawnSync to throw an error or return an error property. Assert console.error with error message and process.exit(1).
  - Invalid JSON: Mock spawnSync to return invalid JSON in stdout. Assert console.error and process.exit(1).

## Documentation
- Update sandbox/docs/USAGE.md and sandbox/docs/README.md to include a section for the --audit flag:
  - Show usage example:
    npm run start -- --audit
  - Describe example outputs for both vulnerability report and no vulnerabilities case.

## Compatibility
- No new dependencies required; uses built-in child_process module.
- Follows existing CLI structure in sandbox/source/main.js.
- Aligns with Vitest testing setup and sandboxed source and test paths.