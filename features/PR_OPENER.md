# PR_OPENER

## Overview
Extend the existing PR opener feature to support two distinct modes: separate pull requests per issue and a single consolidated pull request that merges the HTTP server and diagnostics features.

## Behavior
- Separate PR mode (`--open-prs`):
  • Verify GitHub CLI authentication with `gh auth status`
  • For each issue in [2188, 2193], create a branch `pr-<issue>` and run `gh pr create` with title Implement feature for issue #<issue> and body Resolves issue #<issue>
  • On success, log Opened PR for issue #<issue>; on error log the error and exit with nonzero code
- Consolidated PR mode (`--open-prs-consolidated`):
  • Verify GitHub CLI authentication with `gh auth status`
  • Create a branch `open-prs-http-diagnostics`
  • Run `gh pr create` with title Merge HTTP server and diagnostics features and body listing resolves #2188 and #2193
  • On success, log Opened consolidated PR for HTTP server and diagnostics; on error log the error and exit with nonzero code
- All other modes (`--mission`, `--diagnostics`, `--serve`, `--help`, default) remain unchanged

## CLI Usage
- `npm run open-prs` or `node src/lib/main.js --open-prs`
- `npm run open-prs-consolidated` or `node src/lib/main.js --open-prs-consolidated`

## Tests
- Unit tests for parseOpenPrsArg:
  • `parseOpenPrsArg([])` returns false
  • `parseOpenPrsArg(["--open-prs"])` returns true
- Unit tests for parseConsolidatedPrArg:
  • `parseConsolidatedPrArg([])` returns false
  • `parseConsolidatedPrArg(["--open-prs-consolidated"])` returns true
- Unit tests for openPrs mocking exec to verify the sequence of commands for issues 2188 and 2193
- Unit tests for openConsolidatedPr mocking exec to verify commands for consolidated branch creation and PR creation
- Integration tests for main with ["--open-prs"] and ["--open-prs-consolidated"] stubbing exec and process.exit, asserting correct logs and exit codes

## Implementation Details
- In `src/lib/main.js`, export `parseConsolidatedPrArg(args: string[]): boolean` and implement `openConsolidatedPr(): Promise<void>` to run auth, branch creation, and PR creation commands in sequence
- In `main(args)`, detect consolidated flag first, then separate flag, invoking `openConsolidatedPr()` or `openPrs()` accordingly and then exit
- Preserve existing code for information modes (`--mission`, `--diagnostics`), server mode (`--serve`), help (`--help`), and default echo behavior
- No new dependencies required; use Node built-in `child_process.exec` and GitHub CLI