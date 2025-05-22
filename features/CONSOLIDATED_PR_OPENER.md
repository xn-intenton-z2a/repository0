# CONSOLIDATED_PR_OPENER

## Overview
Introduce a consolidated pull request opener mode to the CLI. When invoked with `--open-prs-consolidated`, the tool will create a single branch and open one PR that resolves issues #2188 and #2193.

## Behavior
- When run with `--open-prs-consolidated`:
  • Verify GitHub CLI authentication with `gh auth status`.
  • Create a branch `open-prs-http-diagnostics`.
  • Run `gh pr create --title "Merge HTTP server and diagnostics features" --body "- resolves #2188\n- resolves #2193"`.
  • On success, print `Opened consolidated PR for HTTP server and diagnostics` and exit code 0.
  • On failure, print stderr to `console.error` and exit with nonzero code.
- All existing modes (`--open-prs`, `--mission`, `--diagnostics`, `--serve`, `--help`, default) remain unchanged.

## CLI Usage
- npm run open-prs-consolidated
- node src/lib/main.js --open-prs-consolidated

## Tests
- Unit tests for `parseConsolidatedPrArg`:
  • `[]` → false
  • `['--open-prs-consolidated']` → true
- Unit test for `openConsolidatedPr` mocking `child_process.exec` to verify commands:
  1. `gh auth status`
  2. `git checkout -b open-prs-http-diagnostics`
  3. `gh pr create --title "Merge HTTP server and diagnostics features" --body "- resolves #2188\n- resolves #2193"`
  • Verify `console.log('Opened consolidated PR for HTTP server and diagnostics')`.
- Integration test for `main(['--open-prs-consolidated'])`:
  • Stub `exec` and `process.exit` to capture calls.
  • Assert log and `process.exit(0)`.

## Implementation Details
- In `src/lib/main.js`:
  • Export `parseConsolidatedPrArg(args: string[]): boolean`.
  • Implement `openConsolidatedPr(): Promise<void>` using `child_process.exec` in sequence.
  • In `main(args)`, detect `--open-prs-consolidated` first, `await openConsolidatedPr()`, then `process.exit(0)`.
- Add `open-prs-consolidated` script in `package.json`.
- No new dependencies required.