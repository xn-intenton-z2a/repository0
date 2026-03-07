# WEB_EXAMPLES

Specification

Overview

WEB_EXAMPLES provides a single, small, and testable web demonstration plus canonical example artifacts that showcase the Hamming distance library in-browser and as copyable examples. The feature bundles a self-contained ES module demo, example output consumed by the docs build, and clear README guidance so consumers can reproduce CLI and web examples without writing test harnesses.

Goals

- Present an easy-to-run browser demo that exercises both string and bit Hamming distance APIs.
- Provide example artifacts (examples/cli-output.md and minimal example snippets) that can be included in docs and used by CI tests.
- Keep the implementation compact: a single ES module under src/web plus small README and examples changes.

Behavior

- The web demo exposes two modes: string and bits.
  - String mode: two labelled text inputs for left and right values; validation enforces both are strings and displays a friendly error when the strings differ in length measured by Unicode code points. When valid, compute and display the Hamming distance using code point semantics.
  - Bits mode: two labelled numeric inputs for non-negative integers; validation enforces integers and non-negativity and displays a user-friendly error for invalid values. When valid, compute and display the bit Hamming distance.
- The UI includes quick-fill buttons for canonical examples: karolin vs kathrin (string), empty vs empty (string), 1 vs 4 (bits), 0 vs 0 (bits), and a surrogate-pair emoji example to demonstrate code point counting.
- Errors in the UI map to the same TypeError and RangeError semantics as the library; UI messages are user-friendly while retaining error type visibility in console logs for debugging.

Implementation notes

- Implement the demo as a single ES module file at src/web/hamming-demo.js that imports named exports hammingDistance and hammingDistanceBits from src/lib/main.js and exports a mount function taking a DOM element to attach the demo.
- Inline minimal CSS and labels in the module so the file is self-contained and safe to copy into docs/ by the existing build:web script.
- Provide a small examples artifact at examples/cli-output.md documenting expected CLI outputs for key cases so docs builds can include reproducible example output.
- The demo must be usable in JSDOM for DOM tests: the exported mount function should accept an optional options object to prefill left/right or x/y values for programmatic tests.

Tests and Examples

- Add DOM unit tests under tests/unit/ that mount the demo in a JSDOM environment and assert results and visible error messages. Tests should simulate user input and quick-fill button clicks.
- Required test cases:
  - string mode: karolin vs kathrin -> 3
  - string mode: empty vs empty -> 0
  - string mode: mismatched code point lengths -> visible RangeError-like validation message
  - bits mode: 1 vs 4 -> 2
  - bits mode: 0 vs 0 -> 0
  - unicode surrogate-pair example: differing emoji -> 1
- Create examples/cli-output.md with exact expected stdout lines for the CLI for canonical examples so docs and CI can consume them.
- Update README with a Web Demo section that links to src/web/hamming-demo.js, describes how to run the demo via npm run build and open docs/index.html, and shows the canonical CLI example outputs pulled from examples/cli-output.md.

Accessibility and UX

- Inputs must have labels and placeholders; results and errors must be rendered in the DOM with accessible roles so tests can query them reliably.
- Quick-fill buttons should be keyboard-focusable and have accessible names.

Acceptance Criteria

- src/web/hamming-demo.js exists and exports a mount function which supports programmatic prefill options for tests.
- examples/cli-output.md is present with expected CLI outputs for karolin vs kathrin, empty vs empty, 1 vs 4, and 0 vs 0.
- README contains a Web Demo section referencing the demo file, the examples artifact, and instructions to run npm run build:web then open docs/index.html.
- DOM unit tests pass asserting the canonical examples and that invalid inputs show the correct visible validation messages.
- The demo is included in docs/ after running npm run build:web because the build copies src/web to docs/.

Notes

- The feature intentionally remains small: one ES module, one examples artifact, one README section, and DOM tests. No server or new dependencies are required.
- Grapheme cluster normalization remains out of scope; the demo uses code point iteration and references the README Unicode section for guidance.
