# WEB_DEMO

# Summary

Add an interactive web demo that lives in src/web/ and demonstrates the library's hammingDistance and hammingDistanceBits functions. The demo is intended for users and QA: it visualises Unicode code points, shows normalization effects (NFC/NFD), and demonstrates integer/BigInt bit comparisons.

# Motivation

A live demo helps users and maintainers quickly understand the library's Unicode-aware behaviour and integer bit-difference semantics without reading tests or source. It also provides stable selectors for behaviour tests and an example integration that mirrors real-world usage in browser contexts.

# Specification

1. Scope and integration
   - The demo will be implemented under src/web/ as a small HTML+JS app that imports the browser-friendly module produced by the existing build:web step (docs/lib-browser.js).
   - Build step: npm run build:web should copy the demo into docs/ so the demo is available at docs/demo.html.

2. UI and features
   - Mode selector: string or bits.
   - String mode UI: two textareas for inputA and inputB, a normalization dropdown with options None, NFC, NFD, a Compare button, and a results pane.
   - String results pane: shows Array.from(code points) for each input, highlights differing positions, and displays the numeric Hamming distance.
   - Bits mode UI: two text inputs accepting decimal or BigInt literal with trailing n, a Compare button, and a results pane that shows parsed values, XOR display, and bit difference count.
   - Inline error area: shows concise validation messages matching the library's TypeError and RangeError rules.

3. Behaviour and validation
   - Use the library functions (hammingDistance and hammingDistanceBits) for computation; do not duplicate validation logic in the demo beyond input parsing and displaying caught errors.
   - For string mode, when a normalization option other than None is selected, pass options.normalize to hammingDistance as "NFC" or "NFD".
   - For bits mode accept numeric literals: if input ends with n treat as BigInt; otherwise parse as Number and validate integer-ness and non-negativity before calling the library.

4. Testability and automation hooks
   - Add data-test attributes to key elements: mode selector, inputs, normalization dropdown, Compare buttons, results panes, and inline error elements to support Playwright behaviour tests.
   - The demo must be deterministic: prefill sample values for quick manual checks (e.g., karolin and kathrin for strings, 1 and 4 for bits).

# Acceptance Criteria

- After npm run build:web, the demo is reachable at docs/demo.html and loads without errors in a modern browser.
- String demo shows the distance 3 for inputs karolin and kathrin and highlights the three differing code points.
- Normalization demo shows a non-zero distance for a\u0301 vs á with None selected and zero when NFC is selected.
- Bits demo shows hammingDistanceBits(1, 4) equals 2 and accepts BigInt literals like 1n and 4n.
- All interactive elements expose stable data-test attributes suitable for automated behaviour tests.
