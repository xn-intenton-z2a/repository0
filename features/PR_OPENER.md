# PR_OPENER

## Overview
Extend and refine the existing PR opener modes to provide robust, user-friendly handling for both separate and consolidated pull-request creation. This feature ensures clear usage, error handling, and exit codes while preserving other CLI modes.

## Behavior

### Separate PR mode (`--open-prs`)
- Verify GitHub CLI authentication with `gh auth status`.
- For each issue in [2188, 2193]:
  - Create a branch `pr-<issue>` via `git checkout -b pr-<issue>`.
  - Open a pull request with `gh pr create --title "Implement feature for issue #<issue>" --body "Resolves issue #<issue>"`.
  - On success, log `Opened PR for issue #<issue>`.
- Exit with code 0 if all PRs succeed; on any error, log `PR opener error: <message>` to stderr and exit with code 1.

### Consolidated PR mode (`--open-prs-consolidated`)
- Verify GitHub CLI authentication with `gh auth status`.
- Create branch `open-prs-http-diagnostics` via `git checkout -b open-prs-http-diagnostics`.
- Open a single pull request with `gh pr create --title "Merge HTTP server and diagnostics features" --body "- resolves #2188\n- resolves #2193"`.
- On success, log `Opened consolidated PR for HTTP server and diagnostics`.
- Exit with code 0 on success; on error, log `Consolidated PR error: <message>` to stderr and exit with code 1.

### Common CLI Details
- Handle `--help`, `--mission`, `--diagnostics`, `--serve` and default echo modes unchanged.
- Enforce mutually exclusive checks and usage help before any opener modes.

## CLI Usage

```bash
node src/lib/main.js --open-prs               # opens separate PRs for issues 2188, 2193
node src/lib/main.js --open-prs-consolidated  # opens consolidated PR for both issues
```

## Tests
- Unit tests for `parseOpenPrsArg` and `parseConsolidatedPrArg` flags.
- Unit tests for `openPrs` and `openConsolidatedPr` mocking `child_process.exec`:
  - Verify command sequence and success logs.
  - Simulate CLI errors and assert error logs and exit code 1.
- Integration tests for `main(["--open-prs"])` and `main(["--open-prs-consolidated"])`:
  - Stub `exec` and `process.exit`, capture logs and exit codes for both success and error scenarios.

## Implementation Details
- In `src/lib/main.js`, wrap opener calls in `try/catch` for clear errors and exit codes.
- Export and implement `parseOpenPrsArg`, `parseConsolidatedPrArg`, `openPrs`, `openConsolidatedPr` using `child_process.exec`.
- Update `package.json` scripts: add `open-prs` and `open-prs-consolidated`.
