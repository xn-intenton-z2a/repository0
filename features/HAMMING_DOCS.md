# HAMMING_DOCS

Summary

Describe documentation and example updates required so the README and examples demonstrate correct usage of the Hamming distance API, including Unicode handling and bit-distance behavior.

Motivation

Users must understand how to use the library correctly and how inputs are validated. Clear README examples reduce misuse and clarify expectations about Unicode code points and integer handling.

Specification

1. README updates
- Add an API section documenting the two named exports: hammingDistance and hammingDistanceBits. For each function include:
  - Purpose
  - Parameter types and validation behaviors (TypeError, RangeError)
  - Return value
  - A short example showing typical usage
- Add a short note on Unicode: strings are compared by Unicode code points, so characters that are represented by surrogate pairs (such as emoji) count as a single position.

2. Examples directory
- Add or update an examples entry (examples/hamming-usage) showing two minimal examples:
  - Example 1: comparing two ASCII strings and showing the returned distance
  - Example 2: comparing two strings containing emoji or non-BMP characters to demonstrate code point handling
- Examples should be simple scripts that import the named exports from src/lib/main.js and log results.

3. Tests-to-docs parity
- Ensure README examples reflect values asserted by unit tests so readers can reproduce test cases manually.

Acceptance criteria

- README contains an API section for hammingDistance and hammingDistanceBits with usage examples
- README notes Unicode code point behavior
- Examples demonstrate both ASCII and emoji/non-BMP string comparisons
- Examples are runnable with node and import the library's named exports
- Documentation changes align with tests so examples match test expectations
