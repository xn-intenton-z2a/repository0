# PR_OPENER

## Overview

Extend the existing PR opener mode to open separate pull requests for the HTTP server and diagnostics issues in a single command invocation. This enhancement automates creating individual branches and PRs for issues 2188 and 2193.

## Behavior

- When run with `--open-prs`, the CLI will:
  - Verify that GitHub CLI (`gh`) is installed and authenticated.
  - For each issue in the list `[2188, 2193]`:
    - Create a branch named `pr-<issue>`.
    - Run:
      ```bash
      gh pr create --title "Implement feature for issue #<issue>" --body "Resolves issue #<issue>"
      ```
    - Print a success message such as `Opened PR for issue #<issue>`.
  - After processing all issues, exit with code zero if all commands succeeded; if any command fails, print the error and exit with a nonzero code.

## CLI Usage

- `npm run open-prs`
- `node src/lib/main.js --open-prs`

## Tests

- Unit test for `parseOpenPrsArg` to detect the `--open-prs` flag.
- Unit test for `openPrs` that mocks `child_process.exec` and verifies the sequence of commands for issues 2188 and 2193.
- Integration-style test for `main(["--open-prs"])` that stubs `exec` and `process.exit`, asserting exit code 0 and logs for each issue.

## Implementation Details

- Import `exec` from Node.js built-in `child_process` module.
- `openPrs` iterates over the array `[2188, 2193]`, performing authentication, branch creation, and PR creation for each issue.
- In `main(args)`, check `parseOpenPrsArg` before other modes and call `openPrs()` on match.
- No new dependencies required.
