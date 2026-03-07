# DOCS_README

Overview

Add and standardise README documentation for the hamming distance library so that users can quickly understand the API, see usage examples, and run the unit tests. The README content described by this feature will be added to the repository README.md by implementers and should include plain-text examples and API signatures.

Specification

Contents to include in README.md or the repository's primary documentation:

- Short description of the library purpose: computing Hamming distances for Unicode strings and integer bit patterns.
- API reference: list both named exports and their behaviours, inputs, returned values, and error conditions.
- Usage examples in plain text showing typical calls and expected results, for example showing the expected return values for the canonical acceptance cases.
- Testing instructions: how to run unit tests using npm test and what the tests assert.

Acceptance Criteria

- README documents both hammingDistance and hammingDistanceBits with clear usage examples in plain text.
- README shows the commands to run the unit test suite and points to the tests/unit directory.
- Examples in README match the acceptance criteria results: karolin vs kathrin returns 3 and bit example returns 2.

Implementation Notes

- Avoid embedding escaped code blocks in the feature description; describe usage examples as plain lines of text to be inserted in README.md by the implementer.
- Keep the README section concise but sufficient for a developer to use the library and to run tests.
