# HAMMING_DOCS

Feature: HAMMING_DOCS

Summary

Provide clear, runnable documentation and examples demonstrating correct usage of hammingDistance and hammingDistanceBits, including explicit notes about Unicode code point semantics, input validation, and expected error types.

Motivation

Because Unicode and integer semantics are subtle, concise documentation and runnable examples reduce developer confusion and ensure parity between docs and tests.

Specification

1. README updates
- Add an API section documenting both named exports: hammingDistance and hammingDistanceBits.
- For each function document:
  - Purpose and return type
  - Accepted parameter types and errors thrown (TypeError, RangeError) and when they occur
  - Unicode note: strings are compared by Unicode code points (use Array.from or for...of) so non-BMP characters count as single positions; normalization is out of scope and must be done by callers
  - Short usage examples that match unit tests (inline examples, not code-escaped blocks)
- Add a Quick Start snippet showing how to import the functions from src/lib/main.js and call them in a Node script.

2. Examples
- Provide an examples/usage.js file (or examples directory content referenced from README) that demonstrates two cases:
  - ASCII example: two equal-length ASCII strings showing returned distance and expected value
  - Unicode example: two strings with emoji or non-BMP characters demonstrating code point handling and expected result
- Examples must import using the library's ES module entry (src/lib/main.js) and log inputs and results in a human-readable form.

3. Tests-to-docs parity
- Ensure README examples and the examples script use the same input values and expected outputs as the unit tests so they can be manually verified.

Acceptance criteria

- README contains an API section for hammingDistance and hammingDistanceBits with parameter and error documentation
- README includes a Unicode note and Quick Start import example
- An examples script is present and runnable with node, demonstrating ASCII and emoji examples
- Examples' outputs match unit test expectations

Notes

- Keep README examples concise and side-effect free beyond console logging.
- Do not introduce normalization or preprocessing in examples; mention normalization as an advanced note.