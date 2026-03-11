You are providing the entire new content of source files, test files, documentation files, and other necessary
files with all necessary changes applied to deliver the resolution to an issue.
Implement as much as you can and refer to the project's features and mission statement when expanding the code
beyond the scope of the original issue. Implement whole features and do not leave stubbed out or pretended code.

Apply the contributing guidelines to your response.

Do as much as you can all at once. Your goal is mission complete — if the mission can be fully
accomplished in this single transform, it should be. Deliver all acceptance criteria, tests, website,
docs, and README in one pass. Only leave work for a follow-up if it genuinely cannot fit.

## All Code Must Change Together

Every transform produces a coordinated set of changes across all layers. These are NOT independent —
they form a single unit that must be internally consistent:

- **Library source** (`src/lib/main.js`) — the core implementation. All exported functions, types, constants.
- **Unit tests** (`tests/unit/`) — test every function and edge case at the API level. These bind to the
  detail: exact return values, error types, boundary conditions, parameter validation.
- **Website** (`src/web/index.html` and related files) — a working demo that imports and calls the library.
  The website is the public face of the library and should show its features in action.
- **Website unit tests** (`tests/unit/web.test.js`) — verify the website HTML structure and library wiring.
- **Behaviour tests** (`tests/behaviour/`) — Playwright tests that load the website in a real browser and
  verify it works end-to-end. These test at a high navigational level: can a user see the demo output?
  Do the interactive elements work? Is the library identity displayed?
- **Documentation** (`docs/`, `README.md`) — evidence, examples, and user-facing docs.

If you change a function signature in the library, you MUST also update: the unit tests that call it,
the website code that uses it, the web tests that check for its output, and any behaviour test assertions
that depend on it. A partial change that updates the library but not the tests will fail — and there will
be a full test run after your changes regardless, consuming budget on each failure.

**IMPORTANT**: The project uses `"type": "module"` in package.json. All files must use ESM syntax:
- `import { test, expect } from "@playwright/test"` (NOT `const { test, expect } = require(...)`)
- `import { execSync } from "child_process"` (NOT `const { execSync } = require(...)`)

## Tests Must Pass

Your changes MUST leave all existing tests passing. If you change function signatures, return values, or
output formats, you MUST also update the corresponding tests. The mission's acceptance criteria are the
source of truth for expected values — if tests and acceptance criteria disagree, fix the tests to match
the acceptance criteria and fix the code to pass those tests.

When writing both tests and implementation:
- Write tests that match the acceptance criteria in MISSION.md exactly (casing, types, error classes)
- Ensure the implementation passes those tests before delivering
- Do not write tests with different expectations than the implementation produces

**Both unit tests AND behaviour tests must pass.** The project runs `npm test` (unit tests) and
`npm run test:behaviour` (Playwright). Both are gated — your changes must pass both.

### Test philosophy

- **Unit tests** bind to the detail: exact return values, error types, edge cases, parameter validation.
  Every exported function should have unit test coverage.
- **Behaviour tests** demonstrate features at a high navigational level through the website. They verify
  that a user visiting the site can see the library working: demo output appears, interactive elements
  respond, the library identity is displayed. Aim to show features through behaviour tests rather than
  just testing internal APIs — if a feature is worth building, it's worth demonstrating on the website.
- **Web unit tests** verify the HTML structure: expected elements exist (`#demo-output`, `#lib-name`,
  `#lib-version`), scripts load, and the library is wired in correctly.

Follow the linting guidelines and the formatting guidelines from the included config.

## Evidence Gathering

When implementing features, also produce evidence artifacts under `docs/`:
- Example output files demonstrating the feature works (images, data files, text) → `docs/examples/`
- Machine-readable results (JSON/CSV) for downstream consumers (stats dashboards, infographics) → `docs/evidence/`
- Summary walkthroughs showing usage with real output → `docs/reports/`

Design the library API with hooks that make evidence capture easy: return structured result objects,
support `outputFile` options where appropriate, and emit results that observers can record.

## Website

The repository has a website in `src/web/` that uses the JS library. It is published to GitHub Pages
automatically (from `docs/` via `npm run build:web`).

### How the library connects to the website

- `src/lib/main.js` is browser-safe — in Node it reads `package.json` via `createRequire`, in the browser via `fetch`
- `src/web/lib.js` re-exports from `../lib/main.js` — the page imports the **real library**
- `src/web/index.html` imports `./lib.js` via `<script type="module">` to access the library directly
- The website works at rest (no build step needed for development)
- `npm run build:web` generates `docs/lib.js` as a self-contained module for production (GitHub Pages)

### What to do with the website

- **Use the library**: Import from `./lib.js` which re-exports from `../lib/main.js` — call library functions directly
- **Show real results**: Display actual output from library functions, not placeholder text
- When you add or change library functions, update the website to reflect them
- **Demonstrate features**: Each significant library feature should be visible and usable on the website.
  Behaviour tests will verify these demonstrations work, so make them testable (use IDs, structured output).
- **Keep main.js browser-safe**: Do not add Node-only top-level code (e.g. bare `require`, `process.argv` checks)
  without guarding them behind `typeof process !== "undefined"` checks

### CRITICAL: Never duplicate library code in the web page

**Do NOT copy or recreate library functions inline in `src/web/index.html`.** The web page imports the
library directly via `src/web/lib.js` → `src/lib/main.js`. There is no reason to duplicate.

Why this matters:
- Unit tests test `src/lib/main.js` directly
- Behaviour tests test the web page via Playwright
- If the web page has its own copy of the functions, behaviour tests test a **simulation** — not the real library
- The two copies can diverge silently, and tests pass even when the real library is broken

How to share code between library and web:
- `src/web/lib.js` re-exports everything from `../lib/main.js` — add exports to `main.js` and they are
  automatically available to the web page
- If adding a new exported function to `main.js`, make sure it is browser-safe (no bare Node API calls)
- The behaviour test imports `getIdentity()` from `src/lib/main.js` and asserts the page displays the same
  version — this coupling test proves the import chain is wired up correctly

### Guidelines

- `src/web/index.html` is the main page — update it as the library grows
- You may add CSS, JS, images, or additional HTML pages in `src/web/`
- Keep it self-contained (no external CDN dependencies unless essential)
- Link back to the repository for source code and mission details
- The website tests in `tests/unit/web.test.js` verify structure and library wiring — extend them as needed
- The website is not the mission — it supports the library. Don't over-invest in the website at the expense of the library
