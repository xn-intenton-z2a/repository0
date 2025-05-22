# PR_OPENER

## Overview
Enhance the existing PR opener mode to support both opening separate pull requests for each feature issue and creating a single consolidated pull request that merges the HTTP server and diagnostics features together.

## Behavior

- Separate PR mode (`--open-prs`): unchanged behavior, opens individual PRs for issues 2188 and 2193.

- Consolidated PR mode (`--open-prs-consolidated`):
  • Verify GitHub CLI authentication with gh auth status.
  • Create a branch named open-prs-http-diagnostics.
  • Run gh pr create with title "Merge HTTP server and diagnostics features" and body listing resolves #2188 and #2193.
  • Log a success message indicating the new PR URL.
  • Exit with code 0.

## CLI Usage

- npm run open-prs               # opens separate PRs per issue
- node src/lib/main.js --open-prs

- npm run open-prs-consolidated  # opens a single consolidated PR
- node src/lib/main.js --open-prs-consolidated

## Tests

- Unit tests for parseOpenPrsArg and parseConsolidatedPrArg flag detection.
- Unit test for openPrs (separate mode) mocking child_process.exec sequence for two issues.
- Unit test for openConsolidatedPr mocking exec commands for consolidated branch and PR creation.
- Integration tests for main with ["--open-prs"] and ["--open-prs-consolidated"] stubbing exec and process.exit, verifying correct calls and exit codes.

## Implementation Details

- Update src/lib/main.js:
  • Export parseConsolidatedPrArg(args) to detect `--open-prs-consolidated`.
  • Implement openConsolidatedPr() that performs authentication, branch creation open-prs-http-diagnostics, and a single gh pr create for both issues.
  • In main(args), check consolidated flag first, then separate flag, then existing modes.

- Add npm script `open-prs-consolidated` in package.json mapping to node src/lib/main.js --open-prs-consolidated.

- Preserve existing dependencies and existing implementations of separate PR opener, info modes, and server modes.