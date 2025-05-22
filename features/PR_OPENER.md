# PR_OPENER

## Overview

Enable the CLI to automatically open separate GitHub pull requests for the HTTP server and diagnostics issue branches with a single command invocation. When the user runs the tool with the `--open-prs` flag, it will authenticate with GitHub CLI and create individual branches and PRs for each configured issue.

## Behavior

- When invoked with `--open-prs`:
  1. Run `gh auth status` to verify GitHub CLI is installed and authenticated.
  2. For each issue number in the list `[2188, 2193]`:
     - Create a new branch named `pr-<issue>` via `git checkout -b pr-<issue>`.
     - Open a pull request with:
       ```bash
       gh pr create \
         --title "Implement feature for issue #<issue>" \
         --body "Resolves issue #<issue>"
       ```
     - On success, log `Opened PR for issue #<issue>`.
     - On failure, log the error to `console.error` and exit with a nonzero code immediately.
  3. After processing all issues, exit with code `0` if all PRs succeeded.

## CLI Usage

- `npm run open-prs`
- `node src/lib/main.js --open-prs`

## Tests

- Unit tests for `parseOpenPrsArg`:
  - No arguments returns `false`.
  - `['--open-prs']` returns `true`.
- Unit tests for `openPrs`:
  - Mock `child_process.exec` to capture and verify command sequence:
    1. `gh auth status`
    2. `git checkout -b pr-2188`
    3. `gh pr create ... #2188`
    4. `gh auth status`
    5. `git checkout -b pr-2193`
    6. `gh pr create ... #2193`
  - Verify `console.log` was called for each `Opened PR for issue #2188` and `#2193`.
- Integration-style test for `main(['--open-prs'])`:
  - Stub `exec` and `process.exit` (to throw) and call `main(['--open-prs'])`.
  - Catch the exit exception and assert `process.exit(0)` was invoked.
  - Assert log messages for each opened PR.

## Implementation Details

- In `src/lib/main.js`:
  - Export `parseOpenPrsArg(args: string[]): boolean` to detect the `--open-prs` flag.
  - Export `openPrs(): Promise<void>` using Node’s built-in `child_process.exec`.
  - In `main(args)`, before other modes, detect `--open-prs`, call `await openPrs()`, then `process.exit(0)`.
- Reuse existing implementations of conflict detection, help, mission, diagnostics, and serve modes unchanged.
- No new dependencies required; rely on `child_process.exec` and `gh` CLI.