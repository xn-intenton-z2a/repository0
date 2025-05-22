# CONSOLIDATED_PR_OPEN_PR

## Overview

Add a new consolidated pull request opener command that merges HTTP server and diagnostics features into a single branch and PR. This enables users to run one command and have both feature branches combined and a PR opened for review.

## Behavior

- When invoked with `--open-prs-consolidated`:
  • Verify GitHub CLI authentication by running `gh auth status`.
  • Create a branch named `open-prs-http-diagnostics`.
  • Run `gh pr create --title "Merge HTTP server and diagnostics features" --body "- resolves #2188\n- resolves #2193"`.
  • Log `Opened consolidated PR for HTTP server and diagnostics` on success.
  • Exit with code 0 on success and with code 1 on any error, printing error details.
- Other CLI modes (`--open-prs`, `--mission`, `--diagnostics`, `--serve`, `--help`, default) remain unchanged.

## CLI Usage

```bash
node src/lib/main.js --open-prs-consolidated
```

## Tests

- Unit test for `parseConsolidatedPrArg`:
  • `[]` returns false.
  • `["--open-prs-consolidated"]` returns true.
- Unit test for `openConsolidatedPr`:
  • Mock `child_process.exec` to verify commands: `gh auth status`, `git checkout -b open-prs-http-diagnostics`, `gh pr create ...`.
  • Verify log message on success.
- Integration test for `main(["--open-prs-consolidated"])`:
  • Stub exec and `process.exit` to throw error capture.
  • Assert correct log and exit code 0.

## Implementation Details

- In `src/lib/main.js`:
  • Export `parseConsolidatedPrArg(args: string[]): boolean`.
  • Export `openConsolidatedPr(): Promise<void>` using `child_process.exec` to run the required commands in sequence.
  • In `main(args)`, detect the consolidated flag first and call `openConsolidatedPr()`, then `process.exit(0)`.
- In `package.json`, add script:

```json
"open-prs-consolidated": "node src/lib/main.js --open-prs-consolidated"
```

- No new dependencies required.