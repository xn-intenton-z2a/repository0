# PR_OPENER

## Overview
Unify the existing separate and consolidated pull-request opener capabilities into a single CLI feature. Users can open individual pull requests for each feature issue or a single consolidated pull request that merges both the HTTP server and diagnostics features.

## Behavior

- Separate PR mode (--open-prs):
  • Verify GitHub CLI authentication using gh auth status
  • For each issue in [2188, 2193]:
    - Create branch pr-<issue> using git checkout -b pr-<issue>
    - Open a pull request with gh pr create --title "Implement feature for issue #<issue>" --body "Resolves issue #<issue>"
    - On success, log "Opened PR for issue #<issue>"
  • Exit with code 0 if all succeed; on any error, log "PR opener error: <message>" to stderr and exit with code 1

- Consolidated PR mode (--open-prs-consolidated):
  • Verify GitHub CLI authentication using gh auth status
  • Create branch open-prs-http-diagnostics using git checkout -b open-prs-http-diagnostics
  • Open a single pull request with gh pr create --title "Merge HTTP server and diagnostics features" --body "- resolves #2188\n- resolves #2193"
  • On success, log "Opened consolidated PR for HTTP server and diagnostics"
  • Exit with code 0 on success; on error, log "Consolidated PR error: <message>" to stderr and exit with code 1

- All other modes (--mission, --diagnostics, --serve, --help, default) remain unchanged

## CLI Usage

- npm run open-prs               # or node src/lib/main.js --open-prs
- npm run open-prs-consolidated  # or node src/lib/main.js --open-prs-consolidated

## Tests

- Unit tests for parseOpenPrsArg and parseConsolidatedPrArg flag detection
- Unit tests for openPrs and openConsolidatedPr mocking child_process.exec to verify command sequences and logs
- Integration tests for main(["--open-prs"]) and main(["--open-prs-consolidated"]) stubbing exec and process.exit, capturing logs and exit codes

## Implementation Details

- In src/lib/main.js, export parseOpenPrsArg, parseConsolidatedPrArg, openPrs, openConsolidatedPr
- Wrap opener calls in try/catch to handle errors and exit codes
- Use Node's built-in child_process.exec to run gh auth status, git checkout, and gh pr create commands
- Update package.json scripts: add open-prs and open-prs-consolidated entries