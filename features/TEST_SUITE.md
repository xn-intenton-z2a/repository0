# TEST_SUITE

Summary

Specify the unit test coverage, structure, and exact test cases required to validate the Hamming library. Tests must be executable with the repository's existing test script.

Structure

- Unit tests live in tests/unit/main.test.js and use Vitest.
- Tests must cover: normal examples, edge cases, and error conditions described in the mission and in the feature specs.

Required test cases

- Strings: karolin vs kathrin => 3
- Strings: empty vs empty => 0
- Strings: unequal length => throws RangeError
- Strings: code point comparisons for emoji and surrogate pairs (examples from UNICODE_SUPPORT)
- Bits: 1 vs 4 => 2, 0 vs 0 => 0
- Validation: wrong types throw TypeError, negative integers throw RangeError
- Large integers: at least one test with a large but safe integer (e.g., Number.MAX_SAFE_INTEGER bit compare) to verify behaviour

Acceptance criteria

- Tests in tests/unit/main.test.js express the above cases with assertive expectations.
- Tests run via npm test and all pass.
- Tests serve as the canonical specification consumers can rely on when changing implementation.
