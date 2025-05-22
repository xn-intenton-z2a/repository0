# PR_OPENER

## Overview

Extend the existing PR opener feature to support two distinct modes: separate pull requests per issue and a single consolidated pull request that merges the HTTP server and diagnostics features.

## Behavior

- Separate PR mode (`--open-prs`):
  • Verify GitHub CLI authentication with `gh auth status`
  • For each issue in [2188, 2193], create a branch `pr-<issue>` and open a pull request with title “Implement feature for issue #<issue>” and body “Resolves issue #<issue>”
  • On success, log `Opened PR for issue #<issue>`; on error, log the error and exit with a nonzero code

- Consolidated PR mode (`--open-prs-consolidated`):
  • Verify GitHub CLI authentication with `gh auth status`
  • Create a branch `open-prs-http-diagnostics`
  • Open a pull request with title “Merge HTTP server and diagnostics features” and body listing resolves #2188 and #2193
  • On success, log `Opened consolidated PR for HTTP server and diagnostics`; on error, log the error and exit with a nonzero code

- All other modes (`--mission`, `--diagnostics`, `--serve`, `--help`, default) remain unchanged

## CLI Usage

- `npm run open-prs` or `node src/lib/main.js --open-prs`
- `npm run open-prs-consolidated` or `node src/lib/main.js --open-prs-consolidated`

## Tests

- Unit tests for `parseOpenPrsArg` and `parseConsolidatedPrArg` flag detection
- Unit tests for `openPrs` and `openConsolidatedPr` mocking `child_process.exec` to verify command sequence and logging
- Integration tests for `main(["--open-prs"])` and `main(["--open-prs-consolidated"])` by stubbing `exec` and `process.exit` to capture logs and exit codes

## Implementation Details

- In `src/lib/main.js`, export `parseOpenPrsArg`, `parseConsolidatedPrArg`, `openPrs`, and `openConsolidatedPr`
- In `main(args)`, check consolidated flag first, then separate PR flag, then proceed with other modes
- Use Node’s built-in `child_process.exec` to run `gh auth status`, `git checkout -b ...`, and `gh pr create ...`, handling errors and logging appropriately
- No new dependencies are required