# PR_OPENER

## Overview

Add a new pull request opener mode to the CLI that automates the creation of a consolidated pull request for the HTTP server and diagnostics features.

## Behavior

- When run with `--open-prs`, the CLI will:
  - Verify that the GitHub CLI (`gh`) is installed and authenticated.
  - Create a new branch named `open-prs-http-diagnostics`.
  - Run:
    ```
    gh pr create --title "Merge HTTP server and diagnostics features" --body "- resolves #2188\n- resolves #2193"
    ```
    to open a pull request linking the two issues.
  - Print success or error messages and exit with code zero on success or a nonzero code on failure.

## CLI Usage

- `npm run open-prs`
- `node src/lib/main.js --open-prs`

## Tests

- Unit test for `parseOpenPrsArg` to detect the `--open-prs` flag.
- Unit test for `openPrs` that mocks `child_process.exec` and verifies the correct `gh` commands are executed.
- Integration test that stubs `exec`, calls `main` with `["--open-prs"]`, and asserts `exec` was called and `process.exit(0)` is invoked.

## Implementation Details

- Use Node.js built-in `child_process.exec` from the `child_process` module.
- Export `parseOpenPrsArg(args: string[]): boolean` and `openPrs(): Promise<void>` from `src/lib/main.js`.
- In `main(args)`, check `parseOpenPrsArg` first, then `await openPrs()`, then call `process.exit(0)`.
- Add a script `open-prs` to `package.json` pointing to `node src/lib/main.js --open-prs`.

*No new dependencies required.*