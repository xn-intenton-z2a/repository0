# CONSOLIDATED_PR_OPENER

## Overview
Add a consolidated pull request opener mode to the CLI so that users can run `node src/lib/main.js --open-prs-consolidated` (or `npm run open-prs-consolidated`) to create a single branch and open one pull request resolving both the HTTP server feature (issue #2188) and the Diagnostics Mode feature (issue #2193).

## Behavior
- When invoked with `--open-prs-consolidated`:
  • Verify GitHub CLI authentication by running `gh auth status`.
  • Create a branch named `open-prs-http-diagnostics` using `git checkout -b open-prs-http-diagnostics`.
  • Execute `gh pr create --title "Merge HTTP server and diagnostics features" --body "- resolves #2188\n- resolves #2193"`.
  • On success, print `Opened consolidated PR for HTTP server and diagnostics` and exit with code 0.
  • On failure, print error details to stderr and exit with code 1.
- All other modes (`--open-prs`, `--mission`, `--diagnostics`, `--serve`, `--help`, default) remain unchanged.

## CLI Usage
```bash
npm run open-prs-consolidated      # or node src/lib/main.js --open-prs-consolidated
```

## Tests
- Unit tests for `parseConsolidatedPrArg(args)`:
  • `[]` returns false.
  • `['--open-prs-consolidated']` returns true.
- Unit test for `openConsolidatedPr()` mocking `child_process.exec` to verify:
  1. `gh auth status`
  2. `git checkout -b open-prs-http-diagnostics`
  3. `gh pr create --title "Merge HTTP server and diagnostics features" --body "- resolves #2188\n- resolves #2193"`
  • Verify console.log of the success message.
- Integration test for `main(['--open-prs-consolidated'])`:
  • Stub `exec` and `process.exit`, capture calls.
  • Assert success log and `process.exit(0)`.

## Implementation Details
- In `src/lib/main.js`:
  • Export `parseConsolidatedPrArg(args: string[]): boolean` detecting the `--open-prs-consolidated` flag.
  • Export `openConsolidatedPr(): Promise<void>` using `child_process.exec` with the sequence above.
  • In `main(args)`, before other modes, check `parseConsolidatedPrArg` and handle in a try/catch block for success and error exit codes.
- Update `package.json` scripts to include:
```json
"open-prs-consolidated": "node src/lib/main.js --open-prs-consolidated"
```