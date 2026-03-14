# LIBRARY_API

Purpose

Document the public API surface exported from src/lib/main.js and the README requirements so consumers and tests know how to use the library.

API Surface

- Named exports (must exist):
  - hammingString(a, b): compute Hamming distance between two strings (see HAMMING_STRINGS).
  - hammingBits(a, b): compute Hamming distance between two non-negative integers (see HAMMING_BITS).
  - name, version, description, getIdentity(), main(args) may also be exported but are secondary.

Documentation and examples

- README.md must include copy-paste usage examples that demonstrate the acceptance examples:
  - Example: hammingString("karolin", "kathrin") -> 3
  - Example: hammingBits(1, 4) -> 2
- Provide a short CLI note showing that start:cli calls main and how to print version or identity.

Testing obligations

- Unit tests must import the named exports and assert the exact functional acceptance criteria from HAMMING_BITS and HAMMING_STRINGS.

Acceptance criteria (testable)

- The library exports hammingString and hammingBits as named exports from src/lib/main.js.
- README contains the two usage examples above and they match unit-test expectations.
