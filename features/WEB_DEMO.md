# WEB_DEMO

# Summary

Provide a small interactive web demonstration under examples/hamming-demo.html that showcases the hammingDistance and hammingDistanceBits functions. The demo must be a single static HTML file that uses the exported library API to compute results and display errors.

# Motivation

A runnable web demo helps users quickly understand and validate the library behaviour in a browser environment and serves as an interactive example for documentation and behaviour tests.

# Specification

1. Demo file
   - Add examples/hamming-demo.html: a single static HTML file with minimal CSS and JavaScript.
   - The demo must call the exported functions from the library (via docs/lib-browser.js or direct import) so the same library logic and validation are used.

2. UI
   - Provide mode selector (String / Bits), two operand inputs, an optional normalization selector (NFC/NFD/false) visible in String mode, a Compute button, and a results area.
   - Display the core acceptance examples and their expected outputs.

3. Behaviour and validation
   - The demo must reuse the exported functions and their validation semantics: TypeError for wrong types, RangeError for unequal string lengths or negative integers.
   - Show errors as a single-line message in a distinct error area; on success show only the numeric result.

4. Documentation
   - Update README.md to add a Web demo section linking to examples/hamming-demo.html and instructions to open it locally.

# Acceptance Criteria

- examples/hamming-demo.html exists under examples/ and uses the library functions for computation
- Entering karolin and kathrin in string mode displays 3
- Entering empty and empty in string mode displays 0
- Entering a and bb in string mode displays a RangeError message
- Entering 1 and 4 in bits mode displays 2
- Entering 0 and 0 in bits mode displays 0
- README contains a Web demo section explaining where the demo lives and how to run it locally
