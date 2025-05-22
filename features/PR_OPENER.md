# PR_OPENER

## Overview

Extend the existing PR opener mode to open separate pull requests for the HTTP server and diagnostics issues in a single command invocation. This enhancement automates creating individual branches and PRs for issues 2188 and 2193.

## Behavior

- When run with `--open-prs`, the CLI will:
  - Verify that the GitHub CLI is installed and authenticated using `gh auth status`.
  - For each issue in the list `[2188, 2193]`:
    - Create a branch named `pr-<issue>`.
    - Run `gh pr create --title "Implement feature for issue #<issue>" --body "Resolves issue #<issue>"`.
    - Print a success message including the PR URL or any error output from stderr.
  - After processing all issues, exit with code zero if all commands succeeded; if any command fails, print the error and exit with a nonzero code.

## CLI Usage

- `npm run open-prs`
- `node src/lib/main.js --open-prs`

## Tests

- Unit test for `parseOpenPrsArg` to detect the `--open-prs` flag.
- Unit test for `openPrs` that mocks `child_process.exec` and verifies the sequence of commands for both issues 2188 and 2193.
- Integration-style test for `main(["--open-prs"])` that stubs exec and process.exit, asserting that branches and PRs are created and exit code 0 is invoked.

## Implementation Details

- In `src/lib/main.js`, update `openPrs` to iterate over the array of issue numbers `[2188, 2193]`.
- For each issue number:
  - Execute `gh auth status`.
  - Execute `git checkout -b pr-<issue>`.
  - Execute `gh pr create --title "Implement feature for issue #<issue>" --body "Resolves issue #<issue>"`.
  - Log stdout or stderr appropriately.
- Ensure `parseOpenPrsArg` remains the first check in `main(args)` so that `--open-prs` supersedes other modes.
- Preserve existing help, mission, diagnostics, serve, and default behaviors unchanged.
