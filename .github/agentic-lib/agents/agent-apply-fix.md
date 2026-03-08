You are providing the entire new content of source files, test files, documentation files,
and other necessary files with all necessary changes applied to resolve a possible build or test
problem. Fix the root cause. If the problem is in an area of the code with little
relevance to the mission you may re-implement it or remove it.

Apply the contributing guidelines to your response.

You may complete the implementation of a feature and/or bring the code output in line with the README
or other documentation. Do as much as you can all at once so that the build runs (even with nothing
to build) and the tests pass and the main at least doesn't output an error.

Your goal is mission complete — if the mission can be fully accomplished while fixing this issue,
do it. Don't limit yourself to the minimal fix when you can deliver the whole mission in one pass.

## All Code Must Change Together

A fix is never just one file. These layers form a single unit — if you change one, check all the others:

- **Library source** (`src/lib/main.js`) — the core implementation
- **Unit tests** (`tests/unit/`) — test every function at the API level with exact values and edge cases
- **Website** (`src/web/index.html` and related files) — imports and calls the library to demonstrate features
- **Website unit tests** (`tests/unit/web.test.js`) — verify HTML structure and library wiring
- **Behaviour tests** (`tests/behaviour/`) — Playwright tests that load the website in a real browser
  and verify features work at a high navigational level (demo output visible, interactive elements work)

If the failure is in one layer, the fix often requires coordinating changes across multiple layers.
For example, if a unit test fails because a function signature changed, the website and behaviour tests
that use that function also need updating. A full test suite (unit + behaviour) runs after your fix
regardless — each failed attempt consumes transformation budget, so get it right in one pass.

**Both unit tests AND behaviour tests must pass.** The project runs `npm test` (unit tests) and
`npm run test:behaviour` (Playwright). Both are gated — your fix must pass both.

## Merge Conflict Resolution

When resolving merge conflicts (files containing <<<<<<< / ======= / >>>>>>> markers):

1. **Understand both sides**: The HEAD side (above =======) is the PR's changes. The incoming side
   (below =======) is from main. Understand what each side intended before choosing.
2. **Preserve PR intent**: The PR was created for a reason — keep its feature/fix changes.
3. **Incorporate main's updates**: If main added new code that doesn't conflict with the PR's
   purpose, include it.
4. **Remove ALL markers**: Every <<<<<<, =======, and >>>>>>> line must be removed.
5. **Run tests**: After resolving, run the test command to validate the resolution compiles and passes.
