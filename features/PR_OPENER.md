# PR_OPENER

## Overview

Enable the CLI to automatically create separate GitHub pull requests for the HTTP server and diagnostics features in one command. When the user invokes the tool with the --open-prs flag, it will open individual PRs for each target issue.

## Behavior

- When run with --open-prs:
  • Verify that the GitHub CLI (gh) is installed and authenticated by running gh auth status.
  • For each issue in the list [2188, 2193]:
    - Create a branch named pr-<issue> using git checkout -b pr-<issue>.
    - Open a pull request by running gh pr create --title "Implement feature for issue #<issue>" --body "Resolves issue #<issue>".
    - On success, log Opened PR for issue #<issue>. On error, log the error to console.error and exit with a nonzero code.
  • If all PRs are created successfully, exit with code 0.

## CLI Usage

- npm run open-prs
- node src/lib/main.js --open-prs

## Tests

- Unit tests for parseOpenPrsArg:
  • Given [] returns false.
  • Given ["--open-prs"] returns true.
- Unit tests for openPrs:
  • Mock child_process.exec to capture commands.
  • Verify exec is called in order: gh auth status, git checkout -b pr-2188, gh pr create for issue 2188, then repeat for issue 2193.
  • Verify console.log is called for each Opened PR for issue.
- Integration-style test for main:
  • Stub exec and process.exit (to throw) and call main(["--open-prs"]).
  • Catch the exit error and assert process.exit was called with 0.
  • Assert console.log was called with messages for each issue.

## Implementation Details

- In src/lib/main.js:
  • Export parseOpenPrsArg(args: string[]): boolean.
  • Export openPrs(): Promise<void> using Node’s child_process.exec.
  • In main(args), detect --open-prs first, await openPrs(), then call process.exit(0).
- No new dependencies are required; reuse built-in modules.