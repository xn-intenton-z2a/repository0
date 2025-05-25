# PULL_REQUEST_OPENER

## Overview
Provide a unified pull-request opener feature that automates separate and consolidated modes via CLI flags and integrates into CI workflows. Users can open individual pull requests per feature issue or a single consolidated pull request merging the HTTP server and diagnostics features.

## Behavior

### Separate PR mode (`--open-prs`)
- Verify GitHub CLI authentication by running `gh auth status`.
- For each issue in [2188, 2193]:
  • Create branch `pr-<issue>` via `git checkout -b pr-<issue>`.
  • Run `gh pr create --title "Implement feature for issue #<issue>" --body "Resolves issue #<issue>"`.
  • On success, log `Opened PR for issue #<issue>`.
- On error, log `PR opener error: <message>` to stderr and exit code 1.
- On success, exit code 0.

### Consolidated PR mode (`--open-prs-consolidated`)
- Verify GitHub CLI authentication by running `gh auth status`.
- Create branch `open-prs-http-diagnostics` via `git checkout -b open-prs-http-diagnostics`.
- Run `gh pr create --title "Merge HTTP server and diagnostics features" --body "- resolves #2188\n- resolves #2193"`.
- On success, log `Opened consolidated PR for HTTP server and diagnostics`.
- On error, log `Consolidated PR error: <message>` to stderr and exit code 1.
- On success, exit code 0.

### CI Integration
Add or update `.github/workflows/pr_opener.yml` with a job `open_consolidated_pr` that:
1. Runs after build and test jobs (`needs: [build]`).
2. Checks out code, sets up Node.js v20, installs dependencies, and runs `npm run open-prs-consolidated`.

## Tests
- Unit tests for flag parsing:
  • `parseOpenPrsArg([])` → false; `parseOpenPrsArg(["--open-prs"])` → true.
  • `parseConsolidatedPrArg([])` → false; `parseConsolidatedPrArg(["--open-prs-consolidated"])` → true.
- Unit tests for `openPrs()` and `openConsolidatedPr()` mocking `child_process.exec`:
  • Verify command sequence and success logs.
  • Simulate errors and assert error logs and exit code 1.
- Integration tests for `main(["--open-prs"])` and `main(["--open-prs-consolidated"])` by stubbing `exec` and `process.exit` to capture logs and exit codes.
