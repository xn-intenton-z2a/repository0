# FIZZBUZZ_CLI

Summary

Specify a small command-line interface mode for the library that demonstrates fizzBuzzSingle and fizzBuzz behaviour when invoked as a Node script. The CLI is optional for interactive use and for behaviour tests that exercise the website build or examples. Extend the CLI to support an optional output format flag to emit JSON and to support a --label option for localisation labels without changing the canonical library behaviour.

Specification

- When src/lib/main.js is executed with node directly (node src/lib/main.js) it should act in CLI mode if an environment variable or process.argv indicates a CLI invocation.
- CLI accepts a single positional integer argument n. When provided, it prints the fizzBuzz sequence from 1..n, one entry per line, to stdout by default.
- CLI accepts an optional flag --format=json (or -j) which causes the CLI to emit the full sequence as a JSON array to stdout instead of one-per-line text.
- CLI accepts an optional flag --label or --labels that accepts a comma-separated pair fizz=Foo,buzz=Bar to override the Fizz and Buzz words for display only; when provided the CLI must call the additive localisation helpers from the library (for example fizzBuzzWithWords) rather than changing the canonical outputs.
- When provided with no argument, CLI prints usage help to stdout and exits with code 0.
- When provided invalid input, CLI prints a concise error message to stderr and exits with a non-zero exit code.
- The CLI must reuse the exported library functions (fizzBuzz / fizzBuzzSingle and the localisation helpers) rather than duplicating logic.

Testing guidance

- Behaviour tests should run node src/lib/main.js 15 and assert stdout contains the expected 15 lines ending with FizzBuzz and exit code 0.
- Behaviour tests should run node src/lib/main.js 15 --format=json and assert stdout is valid JSON and matches JSON.stringify(fizzBuzz(15)).
- Behaviour tests should run node src/lib/main.js 15 --labels fizz=Foo,buzz=Bar and assert the final line contains FooBar and positions match those of Fizz/Buzz replacements.
- Tests for invalid input should assert non-zero exit code and an error message on stderr.

Acceptance criteria

- CLI prints correct output for n=15 with one entry per line and exit code 0
- CLI prints usage when run without args and exits 0
- CLI returns non-zero exit code and prints error message on invalid input
- CLI --format=json produces JSON array equal to JSON.stringify(fizzBuzz(15))
- CLI --labels fizz=Foo,buzz=Bar shows Foo and Bar in the correct positions and does not change canonical library outputs

Notes

This feature adds a small, well-scoped extension to the CLI to make automated checks and demos easier. Implementation should be a short runtime branch in src/lib/main.js that parses process.argv and calls the library exports. The JSON output must be produced by serialising the array returned by fizzBuzz and localisation must be achieved by calling the additive helpers; do not duplicate core logic or modify canonical functions.

# FIZZBUZZ_WEB

Summary

Add a small interactive web demo that uses the canonical library exports to demonstrate fizzBuzz, fizzBuzzSingle, formatting and label overrides in the browser. The demo should be a single self-contained page under src/web/ that can be copied to docs/ by the existing build:web script and exercised by behaviour tests. The page is purely demonstrative and must not alter the library runtime behaviour.

Specification

- Create a single demo page file in src/web/ (for example src/web/fizzbuzz-demo.html) that loads the library from src/lib/main.js or a small browser-facing bundle and provides a minimal UI:
  - An input for n (positive integer), with client-side validation and helpful error text.
  - Controls for output format: one-per-line text and JSON (mirror CLI --format behaviour).
  - Optional inputs for label overrides fizz and buzz (comma or two separate fields) that call the library's fizzBuzzWithWords / fizzBuzzSingleWithWords helpers for display.
  - A Render button that displays the resulting sequence in a scrollable area and a copy-to-clipboard affordance for JSON output.
  - The UI must always use the library helpers rather than reimplementing logic.
- The demo page must be static and dependency-free (vanilla ES modules and DOM APIs only) so build:web can copy it into docs/ without a bundler change.
- Provide a short accessibility-minded layout: labelled inputs, accessible buttons, and results in a pre element for predictable formatting.
- When the demo is opened after running npm run build:web, the page must function in browsers targeted by Playwright used in tests and must not require a server beyond the static docs/ serve step used in start and test:behaviour workflows.

Testing guidance

- Add behaviour tests (Playwright) that run npm run build:web then open the demo page and assert interactive behaviour:
  - Enter 15, choose one-per-line, click Render, and assert the page shows 15 lines with the last line FizzBuzz.
  - Enter 15, choose JSON, click Render, parse the resulting JSON and assert it matches the programmatic output of fizzBuzz(15) imported into the test harness.
  - Enter labels fizz=Foo and buzz=Bar and assert Foo/Bar/FooBar appear at expected positions in the output.
  - Assert the demo shows a user-facing validation message and prevents rendering when n is invalid (empty, non-integer, negative).
- Unit tests should verify that the demo imports and calls the library helpers where possible (for example a small DOM-binding helper exported from the demo can be unit-tested), but primary assertions are end-to-end via Playwright.

Acceptance criteria

- A static demo page exists in src/web/ and is copied into docs/ by the build:web script.
- The page uses only the library exports to generate fizzBuzz output; no duplicate fizzBuzz logic in the page.
- Behaviour tests verify that the page renders correct outputs for n=15 in both line and JSON modes and correctly applies label overrides.
- The demo validates input and shows user errors for invalid n without crashing.

Notes

- Keep the demo small and dependency-free to avoid changing package.json or adding bundlers; use native ES modules and small compatibility shims if necessary. The demo is a pedagogical aid for reviewers and can be extended later to show formatters and other helpers but must remain readable and single-file initially.