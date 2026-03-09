# FIZZBUZZ_WEB_EXAMPLE

Summary

Add a small interactive web example page under src/web/ demonstrating the fizzBuzz library in the browser. The page offers an input for n and a button to render results, using the library as a module in the browser build. This improves the library's discoverability and provides a visual smoke-test.

Rationale

The repository already contains a web folder that is copied to docs during the build. A simple interactive example provides an easy manual check that the library works in a browser environment and supports the mission's requirement to make features visible on the website.

Scope

- Add a minimal UI: an integer input, a generate button, and a results container.
- Use the exported library API in src/lib/main.js when building the web example (via existing build:web script which copies src/web to docs).
- Provide basic accessibility labels and input validation.

Behavior

- When a user enters a positive integer and presses generate, the page displays the fizzBuzz output as an ordered list.
- When input is invalid, show an inline error message and do not update results.

Tests

- Add a behaviour-level test plan that can be implemented as a Playwright test later: open the page, enter 15, click generate, assert the last list item is FizzBuzz.
- Unit tests are optional for this feature; focus is on the web example and documentation.

Acceptance Criteria

- The example page exists under src/web and is copied into docs by the build:web script.
- Manually using the page with input 15 shows an ordered list whose final item is FizzBuzz.
- README references the web example and explains how to run npm run start to view it locally.

Implementation Notes

- Keep the web example minimal and dependency-free; use plain JavaScript and the library entrypoint.
- Do not require a frontend bundler; rely on simple module usage compatible with the project's existing build steps.
