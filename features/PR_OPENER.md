# PR_OPENER

## Overview
Unify both separate and consolidated pull-request opener capabilities into a single CLI feature. Users can either open individual pull requests per feature issue or a single consolidated pull request that merges the HTTP server (--serve) and diagnostics (--diagnostics) features.

## Behavior

- Separate PR mode (--open-prs):
  • Verify GitHub CLI authentication with gh auth status
  • For each issue in [2188, 2193]:
    - Create branch pr-<issue> via git checkout -b pr-<issue>
    - Open a pull request with gh pr create --title "Implement feature for issue #<issue>" --body "Resolves issue #<issue>"
    - On success, log Opened PR for issue #<issue>; on error log the error and exit with a nonzero code
  • Exit with code 0 if all separate PRs succeed

- Consolidated PR mode (--open-prs-consolidated):
  • Verify GitHub CLI authentication with gh auth status
  • Create branch open-prs-http-diagnostics via git checkout -b open-prs-http-diagnostics
  • Open a single pull request with gh pr create --title "Merge HTTP server and diagnostics features" --body "- resolves #2188\n- resolves #2193"
  • On success, log Opened consolidated PR for HTTP server and diagnostics; on error log the error and exit with a nonzero code
  • Exit with code 0 on success

- All other CLI modes (--mission, --diagnostics, --serve, --help, default) remain unchanged

## CLI Usage

```bash
npm run open-prs               # or node src/lib/main.js --open-prs
npm run open-prs-consolidated  # or node src/lib/main.js --open-prs-consolidated
```

## Tests

- Unit tests for parseOpenPrsArg and parseConsolidatedPrArg flag detection
- Unit tests for openPrs and openConsolidatedPr mocking child_process.exec to verify command sequence and logging
- Integration tests for main(["--open-prs"]) and main(["--open-prs-consolidated"]) by stubbing exec and process.exit to capture logs and exit codes

## Implementation Details

- In src/lib/main.js:
  • Export parseOpenPrsArg(args: string[]): boolean and parseConsolidatedPrArg(args: string[]): boolean
  • Export openPrs(): Promise<void> and openConsolidatedPr(): Promise<void> implementing commands via child_process.exec
  • In main(args), detect consolidated flag first, then separate flag, then process other modes
- No new dependencies required; rely on Node’s built-in modules and GitHub CLI