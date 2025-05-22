# CONSOLIDATED_PR_OPENER

## Overview
Introduce a consolidated pull request opener mode to the CLI. When invoked with `--open-prs-consolidated`, the tool will create a single branch and open one PR that resolves issues #2188 and #2193.

## Behavior

- When run with `--open-prs-consolidated`:
  • Verify GitHub CLI authentication with `gh auth status`.
  • Create a branch `open-prs-http-diagnostics`.
  • Run `gh pr create --title "Merge HTTP server and diagnostics features" --body "- resolves #2188\n- resolves #2193"`.
  • On success, print `Opened consolidated PR for HTTP server and diagnostics` and exit with code 0.
  • On failure, print stderr to `console.error` and exit with a nonzero code.
- All existing modes (`--open-prs`, `--mission`, `--diagnostics`, `--serve`, `--help`, default) remain unchanged.

## CLI Usage

- `npm run open-prs-consolidated`
- `node src/lib/main.js --open-prs-consolidated`

## Tests

- Unit test for `parseConsolidatedPrArg`:
  • `[]` → false
  • `['--open-prs-consolidated']` → true
- Unit test for `openConsolidatedPr` mocking `child_process.exec` and verifies:
  1. `gh auth status`
  2. `git checkout -b open-prs-http-diagnostics`
  3. `gh pr create --title "Merge HTTP server and diagnostics features" --body "- resolves #2188\n- resolves #2193"`
- Integration test for `main(['--open-prs-consolidated'])`:
  • Stub `exec` and `process.exit` to capture calls.
  • Assert log and `process.exit(0)`.

## Implementation Details

- In `src/lib/main.js`, add:
  ```js
  export function parseConsolidatedPrArg(args) {
    return args[0] === "--open-prs-consolidated";
  }

  export async function openConsolidatedPr() {
    const require = createRequire(import.meta.url);
    const { exec } = require('child_process');
    await new Promise((res, rej) => exec('gh auth status', err => err ? rej(err) : res()));
    await new Promise((res, rej) => exec('git checkout -b open-prs-http-diagnostics', err => err ? rej(err) : res()));
    await new Promise((res, rej) => exec(
      'gh pr create --title "Merge HTTP server and diagnostics features" --body "- resolves #2188\n- resolves #2193"',
      (err, _, stderr) => err ? rej(err) : (stderr ? console.error(stderr) : console.log('Opened consolidated PR for HTTP server and diagnostics'), res())
    ));
  }
  
  // in main(args) before other modes:
  if (parseConsolidatedPrArg(args)) {
    await openConsolidatedPr();
    process.exit(0);
  }
  ```
- Update `package.json` scripts to include:
  ```json
  "open-prs-consolidated": "node src/lib/main.js --open-prs-consolidated"
  ```