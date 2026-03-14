---
description: Fix build or test failures by applying coordinated changes across all code layers
---

You are providing the entire new content of source files, test files, documentation files,
and other necessary files with all necessary changes applied to resolve a possible build or test
problem. Fix the root cause. If the problem is in an area of the code with little
relevance to the mission you may re-implement it or remove it.

Apply the contributing guidelines to your response.

## Available Tools

- `read_file` — Read any file in the repository to understand the current implementation
- `write_file` — Write changes to files (writable paths only, as listed in the prompt)
- `list_files` — List files in a directory to explore repository structure
- `run_command` — Run shell commands (git write commands are blocked)
- `list_issues` / `get_issue` — Query GitHub issues (open, closed, or filtered by label)
- `list_prs` — List open pull requests
- `git_diff` / `git_status` — View uncommitted changes and working tree status
- `create_issue` / `comment_on_issue` — Create issues or add comments for follow-up work

Note: `run_tests` is not listed here because the task handler automatically validates tests after your session completes. Focus on making the right code changes rather than running tests yourself.

## Context Provided

The task handler provides the following in your prompt:

- **PR title and body** (or workflow run ID for main build fixes)
- **Failure details** — actual CI log output from failing check runs, or conflict markers for merge conflicts
- **Test command** — the command that will be validated after the session
- **Writable and read-only paths** — which files you can modify
- **Contributing guidelines** — project-specific coding standards
- **Agent instructions** — from the workflow configuration

The handler operates in three modes:
1. **Merge conflict resolution** — when `NON_TRIVIAL_FILES` are present, resolve git conflict markers
2. **Failing checks on a PR** — when check runs have failed, fix the code to make them pass
3. **Main build fix** — when `FIX_RUN_ID` is set with no PR, fix a broken build on the main branch

## Context Gathering (Before Fixing)

Before applying a fix, gather context to avoid repeating past failures:

1. **Read intentïon.md** (attached) — look for recurring failure patterns. If the same test or build has failed before, check what was tried and what didn't work. Don't repeat a fix that was already reverted.
2. **Review closed issues** — use `list_issues` with state "closed" to see if a similar fix was already attempted. Learn from what succeeded and what didn't.
3. **Check related issues** — use `list_issues` and `get_issue` to find related issues that may contain user context about the failure, workarounds, or root cause analysis.

This prevents wasting budget on approaches that have already been tried and failed.

You may complete the implementation of a feature and/or bring the code output in line with the README
or other documentation. Do as much as you can all at once so that the build runs (even with nothing
to build) and the tests pass and the main at least doesn't output an error.

Your goal is mission complete — if the mission can be fully accomplished while fixing this issue,
do it. Don't limit yourself to the minimal fix when you can deliver the whole mission in one pass.

## All Code Must Change Together

A fix is never just one file. These layers form a single unit — if you change one, check all the others:

- **Library source** (`src/lib/main.js`) — the core implementation
- **Unit tests** (`tests/unit/`) — test every function at the API level with exact values and edge cases
- **Website** (`src/web/index.html` and `src/web/lib.js`) — `lib.js` re-exports from `../lib/main.js`, so the
  page imports the **real library** directly. **NEVER duplicate library functions inline in the web page** —
  add exports to `main.js` and they are automatically available via `lib.js`.
- **Website unit tests** (`tests/unit/web.test.js`) — verify HTML structure and library wiring
- **Behaviour tests** (`tests/behaviour/`) — Playwright tests that load the website in a real browser
  and verify features work at a high navigational level (demo output visible, interactive elements work).
  Includes a coupling test that imports `getIdentity()` from `src/lib/main.js` and asserts the page version matches.

If the failure is in one layer, the fix often requires coordinating changes across multiple layers.
For example, if a unit test fails because a function signature changed, the website and behaviour tests
that use that function also need updating. A full test suite (unit + behaviour) runs after your fix
regardless — each failed attempt consumes transformation budget, so get it right in one pass.

**Both unit tests AND behaviour tests must pass.** The project runs `npm test` (unit tests) and
`npm run test:behaviour` (Playwright). Both are gated — your fix must pass both.

**IMPORTANT**: The project uses `"type": "module"` in package.json. All files must use ESM syntax:
- `import { test, expect } from "@playwright/test"` (NOT `const { test, expect } = require(...)`)
- `import { execSync } from "child_process"` (NOT `const { execSync } = require(...)`)

## Merge Conflict Resolution

When resolving merge conflicts (files containing <<<<<<< / ======= / >>>>>>> markers):

1. **Understand both sides**: The HEAD side (above =======) is the PR's changes. The incoming side
   (below =======) is from main. Understand what each side intended before choosing.
2. **Preserve PR intent**: The PR was created for a reason — keep its feature/fix changes.
3. **Incorporate main's updates**: If main added new code that doesn't conflict with the PR's
   purpose, include it.
4. **Remove ALL markers**: Every <<<<<<, =======, and >>>>>>> line must be removed.
5. **Run tests**: After resolving, run the test command to validate the resolution compiles and passes.
