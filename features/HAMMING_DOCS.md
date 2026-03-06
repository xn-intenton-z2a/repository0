# HAMMING_DOCS

Feature: HAMMING_DOCS

Summary

Provide clear, runnable documentation and examples that demonstrate correct usage of hammingDistance and hammingDistanceBits, with explicit notes about Unicode code point semantics and input validation.

Motivation

Good documentation reduces developer confusion and incorrect usage. Because Unicode and integer semantics have subtle pitfalls, the README and examples must show representative cases (ASCII, emoji, empty inputs, and numeric examples) and mirror the unit tests.

Specification

1. README updates
- Add an API section with both named exports: hammingDistance and hammingDistanceBits.
- For each function document:
  - Purpose and return type
  - Accepted parameter types and the errors thrown (TypeError, RangeError) and when they occur
  - Unicode note: strings are compared by Unicode code points (use Array.from or for...of) so non-BMP characters count as single positions; normalization is out of scope
  - Short usage examples that match test cases and expected results (inline examples, not code blocks)
- Add a Quick Start snippet showing how to import the functions from src/lib/main.js and call them in a Node script.

2. Examples
- Ensure examples/hamming-usage exists and contains two small runnable scripts (or a single script showing both cases):
  - ASCII example: two equal-length ASCII strings showing returned distance and expected value
  - Unicode example: two strings containing emoji or non-BMP characters demonstrating code point handling and expected value
- Examples must import using the library's ES module entry (src/lib/main.js) and log a short, human-readable message including inputs and result.

3. Tests-to-docs parity
- Examples and README examples must use the same input values and expected outputs as unit tests so they can be manually verified.

Acceptance criteria

- README contains an API section for hammingDistance and hammingDistanceBits with parameter and error documentation
- README includes a Unicode note and Quick Start import example
- examples/hamming-usage is runnable with node and demonstrates ASCII and emoji examples
- Examples' results match unit tests

Notes

- Keep README examples concise. Do not introduce normalization or string preprocessing in examples; mention normalization as an advanced note.
- Examples should be small and side-effect free beyond console logging.