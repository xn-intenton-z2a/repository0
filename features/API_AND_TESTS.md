# API_AND_TESTS

Purpose

Ensure the public API surface and test suite align with the mission and the implementation in src/lib/main.js. This feature specifies the named exports, README examples, and the exact unit tests required to satisfy acceptance criteria.

Public API

- The module src/lib/main.js must export the following named functions and values:
  - stringHamming(a, b)  -- computes Unicode-aware string Hamming distance (code point based).
  - intHamming(x, y)     -- computes bit-level Hamming distance for non-negative integers (Number or BigInt).
  - name, version, description, getIdentity() -- package identity exports used by the CLI and tests.

Notes on naming

- The exported function name for integer Hamming is intHamming in source; feature files and tests must reference intHamming to match implementation.

Testing

- Unit tests must live in tests/unit/ and assert exact numeric outputs and thrown error types for all acceptance cases.
- Tests should cover normal cases, edge cases (empty strings, zero, very large integers via BigInt), Unicode code-point handling, and input validation errors.

Acceptance criteria

- README includes usage examples showing stringHamming and intHamming and their outputs for mission examples.
- Unit tests assert: stringHamming("karolin", "kathrin") === 3; stringHamming("", "") === 0; unequal-length strings throw RangeError; intHamming(1, 4) === 2; intHamming(0, 0) === 0; negative integers throw RangeError; non-string/non-integer inputs throw TypeError.
- All public API listed above are exported as named exports from src/lib/main.js.

Implementation notes

- Keep tests deterministic and focused on the API contract. Do not add optional convenience wrappers unless clearly documented and tested.
