# CONSOLIDATED_PR_OPENER

## Overview
Add a consolidated pull request opener mode to the CLI. When invoked with `--open-prs-consolidated`, the tool will create a single branch and open one PR that resolves issues #2188 and #2193.

## Behavior

- When run with `--open-prs-consolidated`:
  - Verify GitHub CLI authentication by running `gh auth status`
  - Create branch `open-prs-http-diagnostics`
  - Run `gh pr create --title "Merge HTTP server and diagnostics features" --body "- resolves #2188\n- resolves #2193"`
  - On success, print `Opened consolidated PR for HTTP server and diagnostics` and exit with code 0
  - On failure, print the error to `console.error` and exit with a nonzero code
- All other modes (`--open-prs`, `--mission`, `--diagnostics`, `--serve`, `--help`, default) remain unchanged

## CLI Usage

```bash
npm run open-prs-consolidated      # or node src/lib/main.js --open-prs-consolidated
```

## Tests

- Unit test for `parseConsolidatedPrArg(args)`:
  - `[]` → false
  - `['--open-prs-consolidated']` → true
- Unit test for `openConsolidatedPr()` mocking `child_process.exec` to verify:
  1. `gh auth status`
  2. `git checkout -b open-prs-http-diagnostics`
  3. `gh pr create --title "Merge HTTP server and diagnostics features" --body "- resolves #2188\n- resolves #2193"`
  4. Log `Opened consolidated PR for HTTP server and diagnostics`
- Integration test for `main(['--open-prs-consolidated'])`:
  - Stub `exec` and `process.exit` to capture calls
  - Assert `console.log` was called with the success message
  - Assert `process.exit(0)` was invoked

## Implementation Details

- In `src/lib/main.js`:
  - Export `parseConsolidatedPrArg(args: string[]): boolean`
  - Export `openConsolidatedPr(): Promise<void>` using `child_process.exec`
  - In `main(args)`, detect `--open-prs-consolidated` first, await `openConsolidatedPr()`, then `process.exit(0)`
- Add script `open-prs-consolidated` in `package.json`: `node src/lib/main.js --open-prs-consolidated`
- No new dependencies required