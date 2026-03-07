# WEB_DEMO

Specification

Overview

Provide a simple interactive web demonstration page for the Hamming distance library that can be built into the repository docs and used by humans to explore both the string and bit-distance APIs without writing code. The demo is a lightweight ES module that uses the library's named exports and the existing docs build pipeline which copies src/web into docs/.

Goals

- Make it easy for a developer or reviewer to try the library in a browser.
- Exercise Unicode code point comparison and integer bit comparisons in the UI.
- Be small and self-contained so it can be implemented as a single file under src/web and shown on the website.

Behavior

- The demo exposes two modes: string and bits.
  - String mode: two text inputs for left and right; validation enforces both are strings and displays a friendly error when lengths differ measured in code points. When valid, show the computed Hamming distance using Unicode code point semantics.
  - Bits mode: two numeric inputs for non-negative integers; validation enforces integers and non-negativity and displays a user-friendly error for invalid values. When valid, show the computed bit Hamming distance.
- The UI should present example quick-fill buttons for canonical acceptance cases: karolin vs kathrin (string), empty vs empty (string), 1 vs 4 (bits), 0 vs 0 (bits), and a Unicode emoji pair to demonstrate surrogate pair handling.
- All error messages must map to the same TypeError/RangeError semantics used by the library; the UI should render human-friendly text but not suppress the underlying error types in logs for debugging.

Implementation notes

- Implement as a single ES module file: src/web/hamming-demo.js. The module should import named exports hammingDistance and hammingDistanceBits from src/lib/main.js, wire UI controls, and export a mount function so tests can instantiate the demo in a JSDOM environment.
- Keep styling minimal and inline so the file is self-contained and harmless to the docs build.
- No server-side code required; the demo must work when served statically from docs/ after running the existing build:web script.

Tests and Examples

- Add unit or DOM tests that mount the demo in a JSDOM environment and simulate user input to assert results and error messages.
- Test cases must include at least the canonical acceptance criteria: string mode karolin vs kathrin -> 3; string mode empty vs empty -> 0; string mode mismatched lengths -> RangeError shown; bits mode 1 vs 4 -> 2; bits mode 0 vs 0 -> 0; Unicode surrogate-pair examples produce a distance of 1 when appropriate.
- Provide example instructions in the README web/demo section describing how to open the demo via the docs build: run the existing build:web script and open docs/index.html or the specific demo path.

Accessibility and UX

- Inputs must have labels, example placeholders, and visible result text. Errors should be announced in the UI and visible in the DOM for test assertions.
- Keep the demo keyboard-navigable and screen-reader friendly where possible given the small scope.

Acceptance Criteria

- A single file src/web/hamming-demo.js implements the demo and exports a mount function for testing.
- The demo appears in the docs/ output after running the existing build:web script (the build:web script copies src/web to docs/ by default).
- DOM tests pass asserting the canonical examples: karolin/kathrin -> 3; ""/"" -> 0; bits 1/4 -> 2; bits 0/0 -> 0; mismatched string lengths show a RangeError-like validation message; Unicode surrogate-pair example returns 1 when inputs differ.
- README updated with a short web demo section pointing to the demo file and explaining how to run the docs build to view it.

Notes

- The demo is intentionally simple: it demonstrates library usage in a browser and provides testable behavior that mirrors the library's unit tests rather than introducing new algorithms or normalization rules.
- Grapheme cluster normalization remains out of scope; the demo should explain that results are code point based and point to the README Unicode section for guidance.
