# WEB_EXAMPLES

Feature name: WEB_EXAMPLES

Summary

A compact browser demo module showing string and bit Hamming distance usage and validation. The demo is a single ES module at src/web/hamming-demo.js that imports hammingDistance and hammingDistanceBits and exposes a mount function for programmatic tests and manual use.

Behavior

- Modes: string and bits.
  - String mode validates left and right as Unicode code point sequences and shows RangeError-like validation when lengths differ.
  - Bits mode validates non-negative integer inputs and shows user-friendly errors for invalid values.
- Quick-fill buttons for canonical examples: karolin vs kathrin, empty vs empty, 1 vs 4, 0 vs 0, and an emoji surrogate-pair example.
- Errors shown in the UI map to the same TypeError/RangeError semantics as the library; console logs include error names for debugging.

Implementation notes

- Implement src/web/hamming-demo.js as a self-contained ES module that exports mount(container, options) where options can prefill values for programmatic tests.
- Inline minimal accessible HTML and CSS inside the module so npm run build:web can copy it to docs/ for the static demo.
- The mount function must be usable in JSDOM so DOM unit tests can interact with inputs and buttons.

Tests and Examples

- DOM unit tests under tests/unit/ that mount the demo in JSDOM and assert visible results and error messages.
- Required test cases: karolin vs kathrin -> 3; empty vs empty -> 0; mismatched code-point lengths -> visible validation; bits 1 vs 4 -> 2; bits 0 vs 0 -> 0; emoji example -> 1.
- Provide examples/cli-output.md with canonical CLI outputs so docs and CI can reference them.

Acceptance Criteria

- src/web/hamming-demo.js exports mount and supports programmatic prefill options for tests.
- examples/cli-output.md exists and contains canonical outputs for karolin vs kathrin, empty vs empty, 1 vs 4, and 0 vs 0.
- README contains a Web Demo section describing how to build and view the demo via npm run build:web and open docs/.
- DOM unit tests pass and demonstrate both correct outputs and visible validation messages.
