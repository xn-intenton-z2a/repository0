# CONSOLIDATED_PR_OPENER

## Overview
Introduce a consolidated pull request opener mode to the CLI and CI workflows. When invoked with `--open-prs-consolidated`, the tool will create a single branch and open one PR that resolves issues #2188 and #2193.

## Behavior

- Detect the `--open-prs-consolidated` flag before any other mode.
- Authenticate using GitHub CLI: `gh auth status`.
- Create branch `open-prs-http-diagnostics`: `git checkout -b open-prs-http-diagnostics`.
- Run pull request command:
  ```bash
  gh pr create \
    --title "Merge HTTP server and diagnostics features" \
    --body "- resolves #2188\n- resolves #2193"
  ```
- On success, log:
  ```
  Opened consolidated PR for HTTP server and diagnostics
  ```
- On error, log to stderr:
  ```
  Consolidated PR error: <error message>
  ```
  and exit with code 1.

## CLI Usage

- `npm run open-prs-consolidated`
- `node src/lib/main.js --open-prs-consolidated`

## CI Integration

Add or update `.github/workflows/pr_opener.yml`:
```yaml
jobs:
  open_consolidated_pr:
    runs-on: ubuntu-latest
    needs: [build]
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      - run: npm install
      - run: npm run open-prs-consolidated
```
This job runs on `workflow_dispatch` or schedule, automating branch creation and PR opening.

## Tests

- Unit test for `parseConsolidatedPrArg`:
  - `parseConsolidatedPrArg([])` returns false
  - `parseConsolidatedPrArg(["--open-prs-consolidated"])` returns true
- Unit test for `openConsolidatedPr` mocking `child_process.exec`:
  1. `gh auth status`
  2. `git checkout -b open-prs-http-diagnostics`
  3. `gh pr create --title "Merge HTTP server and diagnostics features" --body "- resolves #2188\n- resolves #2193"`
  - Verify console.log for success message
  - Simulate error and verify console.error and exit code 1
- Integration test for `main(['--open-prs-consolidated'])`:
  - Stub `exec` and `process.exit` to capture calls
  - Assert success log and `process.exit(0)`
