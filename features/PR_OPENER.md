# PR_OPENER

## Overview

Unify both separate and consolidated pull-request opener capabilities into a single CLI feature. Users can either open individual pull requests per feature issue or a single consolidated pull request that merges the HTTP server and diagnostics features.

## Behavior

- Separate PR mode (`--open-prs`):
  • Verify GitHub CLI authentication (run `gh auth status`).
  • For each issue in [2188, 2193]:
    - Create branch `pr-<issue>` via `git checkout -b pr-<issue>`.
    - Open a pull request with `gh pr create --title "Implement feature for issue #<issue>" --body "Resolves issue #<issue>"`.
    - On success, log `Opened PR for issue #<issue>`; on error, log the error to console.error and exit with a nonzero code.
  • Exit with code 0 if all separate PRs succeed.

- Consolidated PR mode (`--open-prs-consolidated`):
  • Verify GitHub CLI authentication (run `gh auth status`).
  • Create branch `open-prs-http-diagnostics` via `git checkout -b open-prs-http-diagnostics`.
  • Open a single pull request with `gh pr create --title "Merge HTTP server and diagnostics features" --body "- resolves #2188\n- resolves #2193"`.
  • On success, log `Opened consolidated PR for HTTP server and diagnostics`; on error, log the error to console.error and exit with a nonzero code.
  • Exit with code 0 on success.

- All other CLI modes (`--mission`, `--diagnostics`, `--serve`, `--help`, default) remain unchanged.

## CLI Usage

```bash
# Separate mode: one PR per issue
npm run open-prs      # or node src/lib/main.js --open-prs

# Consolidated mode: single PR for both issues
npm run open-prs-consolidated  # or node src/lib/main.js --open-prs-consolidated
```

## Tests

- Unit tests for `parseOpenPrsArg`: no flags → false; [`"--open-prs"`] → true.
- Unit tests for `parseConsolidatedPrArg`: no flags → false; [`"--open-prs-consolidated"`] → true.
- Unit tests for `openPrs`: mock `child_process.exec`, verify sequence for issues 2188 and 2193, and logging.
- Unit tests for `openConsolidatedPr`: mock `child_process.exec`, verify auth, branch creation, PR creation steps and success log.
- Integration tests for `main(["--open-prs"])` and `main(["--open-prs-consolidated"])`: stub `exec` and `process.exit`, assert correct logs and exit codes.

## Implementation Details

- In `src/lib/main.js`:
  • Export `parseOpenPrsArg(args: string[]): boolean` and `parseConsolidatedPrArg(args: string[]): boolean`.
  • Export `openPrs(): Promise<void>` and `openConsolidatedPr(): Promise<void>` implementing the commands via `child_process.exec`.
  • In `main(args)`, detect consolidated flag first, then separate flag, then delegate to other modes.
- No new dependencies required; rely on Node’s built-in modules and GitHub CLI.