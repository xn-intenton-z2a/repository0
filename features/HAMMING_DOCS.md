# HAMMING_DOCS

Feature: HAMMING_DOCS

Summary

Provide clear, runnable documentation and examples demonstrating correct usage of hammingDistance and hammingDistanceBits, including explicit notes about Unicode code point semantics, input validation, and expected error types.

Motivation

Unicode and integer semantics are subtle. Concise documentation and runnable examples reduce developer confusion and ensure parity between docs and tests.

Specification

1. README updates

- Add an API section documenting both named exports: hammingDistance and hammingDistanceBits.
- For each function document purpose, return type, accepted parameter types, and errors thrown (TypeError, RangeError) and when they occur.
- Add a Unicode note: strings are compared by Unicode code points, so non-BMP characters count as single positions; normalization is out of scope and must be performed by callers when needed.
- Provide short usage examples that match unit tests; examples should be simple single-line calls and their expected return values.
- Add a Quick Start snippet showing how to import the functions from src/lib/main.js using ES module import and run them in a Node script.

2. Examples

- Include an examples/usage.js script referenced in the README that demonstrates two cases:
  - ASCII example: two equal-length ASCII strings showing returned distance and expected value.
  - Unicode example: two strings containing emoji or other non-BMP characters demonstrating code point handling and expected result.
- The examples script must import using the library's ES module entry src/lib/main.js and print human-readable lines indicating input and result.
- Examples must not perform normalization; they must demonstrate the raw code point behaviour and include comments noting normalization considerations.

3. Tests-to-docs parity

- Ensure README examples and the examples script use the same input values and expected outputs as unit tests so manual verification is straightforward.

Acceptance criteria

- README contains an API section for hammingDistance and hammingDistanceBits with parameter and error documentation
- README includes a Unicode note and Quick Start import example
- An examples script is present in examples/ and runnable with node, demonstrating ASCII and emoji examples
- Examples outputs match unit test expectations

Notes

- Keep README examples concise and side-effect free beyond console logging.
- Do not introduce normalization or preprocessing in examples; mention normalization as an advanced note.
