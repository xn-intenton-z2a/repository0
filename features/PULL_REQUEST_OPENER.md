# PULL_REQUEST_OPENER

## Overview
Provide a unified pull-request opener feature that supports both separate and consolidated modes via CLI flags and integrates into CI workflows. Users can open individual pull requests per feature issue or a single consolidated pull request merging HTTP server (issue #2188) and diagnostics (issue #2193) features.

## Behavior

### Separate PR mode (`--open-prs`)
- Verify GitHub CLI authentication by running `gh auth status`.
- For each issue in `[2188, 2193]`:
  • Create branch `pr-<issue>` via `git checkout -b pr-<issue>`.
  • Run `gh pr create --title "Implement feature for issue #<issue>" --body "Resolves issue #<issue>"`.
  • Log `Opened PR for issue #<issue>` on success.
- On error: log `PR opener error: <message>` to stderr and exit code 1.
- On success: exit code 0.

### Consolidated PR mode (`--open-prs-consolidated`)
- Verify GitHub CLI authentication by running `gh auth status`.
- Create branch `open-prs-http-diagnostics` via `git checkout -b open-prs-http-diagnostics`.
- Run `gh pr create --title "Merge HTTP server and diagnostics features" --body "- resolves #2188\n- resolves #2193"`.
- Log `Opened consolidated PR for HTTP server and diagnostics` on success.
- On error: log `Consolidated PR error: <message>` to stderr and exit code 1.
- On success: exit code 0.

## CLI Usage
```bash
npm run open-prs               # or node src/lib/main.js --open-prs
npm run open-prs-consolidated  # or node src/lib/main.js --open-prs-consolidated
```

## CI Integration
Add or update `.github/workflows/pr_opener.yml` to include a job `open_consolidated_pr` that:
1. Runs after build and test jobs.
2. Uses `actions/checkout@v3` and `actions/setup-node@v3` (node 20).
3. Installs dependencies (`npm install`).
4. Executes `npm run open-prs-consolidated` to open the consolidated PR.

## Tests
- Unit tests for `parseOpenPrsArg` and `parseConsolidatedPrArg` flag detection.
- Unit tests for `openPrs()` and `openConsolidatedPr()` mocking `child_process.exec`:
  • Verify correct sequence of commands and logs.
  • Simulate errors to assert error logs and exit code 1.
- Integration tests for `main(["--open-prs"])` and `main(["--open-prs-consolidated"])`:
  • Stub `exec` and `process.exit` to capture logs and exit codes in success and failure scenarios.
