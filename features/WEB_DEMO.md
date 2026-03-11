# WEB_DEMO

# Summary

Provide a small interactive web demonstration that showcases the hammingDistance and hammingDistanceBits functions in an immediately runnable example under the examples/ directory. The demo is a single static HTML file that imports the library (or calls into its exported functions) and presents a tiny UI for entering two strings or two integers, computing results, displaying errors, and showing the canonical acceptance examples.

# Motivation

A visual, interactive example lowers the barrier for new users to understand the library, verifies runtime behaviour in a browser-like environment, and supplies a reproducible example that can be copied into documentation or used by behaviour tests later. Implementing the demo as a single static file in examples/ keeps the change scope minimal and fits the repository constraints.

# Specification

1. Demo file
   - Add examples/hamming-demo.html: a single static HTML file with minimal CSS and JavaScript.
   - The demo must be implementable without build tooling by importing src/lib/main.js (for example via a small bundler-free wrapper or by copying a tiny usage snippet) or by referencing the built docs bundle when appropriate.

2. UI
   - Two modes: String mode and Bits mode selectable via radio buttons or a select element.
   - Two input fields for the operands; in string mode they accept arbitrary text (including emoji), in bits mode they accept non-negative integers or BigInt-literal suffixes.
   - A Compute button that calls the appropriate exported function and displays either the integer result or a single-line error message.
   - Display an examples panel that lists the core acceptance examples and their expected outputs.

3. Behaviour and validation
   - The demo must reuse the exported functions and their validation semantics: TypeError for wrong types, RangeError for unequal string lengths or negative integers.
   - Show errors to the user as a single-line message in a distinct error area.
   - For successful runs show just the numeric result.

4. Documentation link
   - README.md should be updated to include a brief Web demo section linking to examples/hamming-demo.html and describing how to open it locally (open file:// or run npm run start to serve docs if desired).

# Acceptance Criteria

- examples/hamming-demo.html exists and is a single static file under examples/.
- Running the demo and entering karolin and kathrin in string mode displays 3.
- Entering empty and empty in string mode displays 0.
- Entering a and bb in string mode displays a RangeError message.
- Entering 1 and 4 in bits mode displays 2.
- Entering 0 and 0 in bits mode displays 0.
- README.md contains a Web demo section explaining where the demo lives and how to run it locally.

# Files to change

- examples/hamming-demo.html: new file (single static demo).
- README.md: add Web demo section and a short usage note pointing to examples/hamming-demo.html.
- src/lib/main.js: no behaviour changes required; demo must call the existing named exports.
- tests/unit/: optional unit test that verifies the demo's example outputs programmatically is allowed but not required for initial acceptance.

# Implementation notes

- Keep the demo dependency-free and small so it can be reviewed easily; use plain DOM API and no external libraries.
- The demo should treat strings using the library's exported hammingDistance function so that Unicode code points are handled consistently.
- For bits mode, parse BigInt when the input ends with n or when numeric values exceed Number.MAX_SAFE_INTEGER; display parse errors clearly.
- The demo is intentionally pedagogical: it must show exactly the acceptance examples and their results so reviewers can verify correctness quickly.

# Tests

- Manual verification: open examples/hamming-demo.html and exercise the acceptance examples.
- Optional automated test: a small unit test that loads the demo's JS in jsdom and ensures the Compute button produces the same numeric results for the core examples.

# Notes

This feature is designed to be implemented with a single static file in examples/ plus a small README change and does not require changes to the core API. It provides a low-risk, high-value way to demonstrate library behaviour to users and reviewers.