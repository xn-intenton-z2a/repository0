Repository seeded at Fri May 16 22:43:57 UTC 2025
https://github.com/xn-intenton-z2a/repository0/discussions/1862#discussioncomment-13175710

# Discussion Seed Trace

This repository was seeded from a GitHub Discussion.

- **Title**: 
- **URL**: https://github.com/xn-intenton-z2a/repository0/discussions/1862#discussioncomment-13175710
- **Created at**: 2025-05-16T22:44:16.957Z

Archiving intentïon to branch https://github.com/xn-intenton-z2a/repository0/tree/intention-2025-05-16T22-45Z at Fri May 16 22:45:25 UTC 2025

Archiving intentïon to branch https://github.com/xn-intenton-z2a/repository0/tree/intention-2025-05-16T23-00Z at Fri May 16 23:01:03 UTC 2025

Archiving intentïon to branch https://github.com/xn-intenton-z2a/repository0/tree/intention-2025-05-16T23-32Z at Fri May 16 23:32:48 UTC 2025

Archiving intentïon to branch https://github.com/xn-intenton-z2a/repository0/tree/intention-2025-05-17T00-01Z at Sat May 17 00:01:21 UTC 2025

Archiving intentïon to branch https://github.com/xn-intenton-z2a/repository0/tree/intention-2025-05-17T00-45Z at Sat May 17 00:45:37 UTC 2025
2025-05-17T00:53:51.355Z - Issue 2000 was updated with Title: Improve CLI `plot` subcommand: add error-handling tests and update documentation

Objective
--------
Ensure the `plot` subcommand handles user errors reliably and that documentation clearly describes both successful and error flows.

Why
---
- Currently missing tests for error conditions (missing or unsupported function name).
- Documentation in `sandbox/docs/USAGE.md` and root `README.md` does not describe error behaviors or exit codes.

Scope of Work
-------------
1. Tests (`sandbox/tests/cli.test.js`)
   - Add a test case for invoking `node sandbox/source/main.js plot` without a function name:
      Expect exit status `1` and stderr containing exactly `Function name is required for plot subcommand.`
   - Add a test case for invoking with an unsupported function name (e.g. `plot unknown`):
      Expect exit status `1` and stderr beginning with `Unsupported function:`.
2. Documentation
   a. `sandbox/docs/USAGE.md`
     - Under the **`plot` Subcommand** section, add an **Error Cases** subsection:
        **Missing `functionName`**: show the exact error message and exit code.
        **Unsupported `functionName`**: show the error message format and exit code.
   b. Root `README.md`
     - In the **Running the Demo** or **Usage** section, add a brief `plot` subcommand syntax and reference the full `USAGE.md` including error flows.

Acceptance Criteria
-------------------
1. Tests cover:
   - Missing `functionName` returns exit code `1` and prints the exact stderr message.
   - Unsupported `functionName` returns exit code `1` and prints a stderr message starting with `Unsupported function:`.
   - Existing tests for successful `plot quadratic` and `plot sine` remain passing.
2. Documentation:
   - `sandbox/docs/USAGE.md` includes an **Error Cases** subsection with examples and expected exit codes.
   - `README.md` references usage and points to `USAGE.md` for full details.
3. Running `npm test` shows zero failures.
4. No changes made outside of `sandbox/tests/cli.test.js`, `sandbox/docs/USAGE.md`, and `README.md`.

Verification
------------
```bash
npm test
node sandbox/source/main.js plot       # Expect exit code 1 and specific stderr
node sandbox/source/main.js plot foo   # Expect exit code 1 and stderr starting with "Unsupported function:"
```
2025-05-17T00:53:58.218Z - Worked to resolved issue Add global CLI commands besides plot and update documentation and tests for help version mission and echo behaviors. Add global CLI commands besides plot and update documentation and tests for help version mission and echo behaviors
