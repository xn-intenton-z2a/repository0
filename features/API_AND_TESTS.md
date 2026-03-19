# API_AND_TESTS

Purpose

Specify the public API surface and the test suite structure required to satisfy the mission and acceptance criteria. This feature ensures library exports, README examples, and unit tests are present and consistent.

Public API

- The module src/lib/main.js must export the following named functions:
  - stringHamming(a, b)  -- computes Unicode-aware string Hamming distance.
  - integerHamming(x, y) -- computes bit-level Hamming distance for non-negative integers.
  - (optional) hamming -- a convenience function that dispatches based on argument types, but only if it does not duplicate behavior or confuse validation rules.

Testing

- Add unit tests in tests/unit/ that cover normal, edge, and error cases described in the mission and in the other feature specs.
- Tests should assert specific numeric outputs (exact values) and verify thrown error types (TypeError, RangeError) where required.

Acceptance criteria

- README includes usage examples showing stringHamming and integerHamming and their outputs for the examples in the mission.
- Unit tests cover: "karolin" vs "kathrin" -> 3; "" vs "" -> 0; unequal-length strings -> RangeError; integer cases 1 vs 4 -> 2; 0 vs 0 -> 0; non-number/non-string inputs throw TypeError; negative integers throw RangeError.
- All public API are exported as named exports from src/lib/main.js.

Notes for implementation

- Keep tests small, deterministic, and focused on the API contract.
- If an optional convenience hamming dispatcher is added, include tests showing it routes to the correct underlying function and enforces the same validation rules.
