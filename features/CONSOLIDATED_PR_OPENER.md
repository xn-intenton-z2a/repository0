# CONSOLIDATED_PR_OPENER

## Overview
Introduce a consolidated pull request opener mode that merges the HTTP server and diagnostics feature branches into a single pull request. This complements the separate PR mode and integrates into CI workflows.

## Behavior

- When invoked with `--open-prs-consolidated`:
  • Authenticate via `gh auth status`.
  • Create branch `open-prs-http-diagnostics` using `git checkout -b open-prs-http-diagnostics`.
  • Run:
    ```bash
    gh pr create --title "Merge HTTP server and diagnostics features" --body "- resolves #2188\n- resolves #2193"
    ```
  • On success, log `Opened consolidated PR for HTTP server and diagnostics` and exit code 0.
  • On error, log `Consolidated PR error: <message>` to stderr and exit code 1.

## CLI Usage

- `npm run open-prs-consolidated`  
- `node src/lib/main.js --open-prs-consolidated`

## CI Integration

Add or update `.github/workflows/pr_opener.yml` with a job `open_consolidated_pr` that:
1. Runs after build and test jobs (`needs: [build]`).
2. Uses `actions/checkout@v3` and `actions/setup-node@v3` (node v20).
3. Installs dependencies (`npm install`).
4. Executes `npm run open-prs-consolidated`.

## Tests

- Unit test for `parseConsolidatedPrArg(args)`:  
  • `[]` → `false`  
  • `['--open-prs-consolidated']` → `true`
- Unit test for `openConsolidatedPr()` mocking `child_process.exec` to verify:
  1. `gh auth status`
  2. `git checkout -b open-prs-http-diagnostics`
  3. PR creation command above
  4. Console logs success message
- Integration test for `main(['--open-prs-consolidated'])`:
  • Stub `exec` and `process.exit` to capture calls and verify exit code 0 and log output.

## Implementation Details

- In `src/lib/main.js`:
  • Export `parseConsolidatedPrArg(args)` and `openConsolidatedPr()` using Node’s `child_process.exec`.
  • Wrap invocation in `main(args)` with `try/catch` for error handling and exit codes.
- Update `package.json` scripts:
  ```json
  "open-prs-consolidated": "node src/lib/main.js --open-prs-consolidated"
  ```