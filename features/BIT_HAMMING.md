BIT_HAMMING

Goal
----
Provide a compact, well-documented feature spec for computing Hamming distance between non-negative integers or equal-length byte arrays by counting differing bits. Ensure strict input validation and clear, testable acceptance criteria aligned with MISSION.md.

Behavior and API
----------------
- Exported function: bitHamming(a: number | bigint | Uint8Array, b: number | bigint | Uint8Array): number
- Inputs:
  - Two non-negative integers (number or bigint), or
  - Two Uint8Array instances of equal length
- Operation:
  - For numeric operands: XOR the values and count set bits in the result
  - For BigInt operands: operate using BigInt XOR and popcount logic suitable for arbitrarily large integers
  - For Uint8Array operands: XOR each corresponding byte and sum per-byte popcounts
- Validation:
  - Throw TypeError when arguments are not numbers, bigints, or Uint8Array as appropriate
  - Throw RangeError for negative integers
  - Throw RangeError for mismatched Uint8Array lengths
- Purity: function must be pure and side-effect free

Acceptance Criteria (Testable)
------------------------------
1. bitHamming(0b1010, 0b1010) === 0
2. bitHamming(0b1010, 0b1000) === 1
3. bitHamming(0n, 1n) === 1
4. bitHamming(Uint8Array.of(0xFF), Uint8Array.of(0x0F)) === 4
5. bitHamming(Uint8Array.of(1,2), Uint8Array.of(1)) throws RangeError
6. bitHamming(-1, 1) throws RangeError
7. bitHamming('a' as any, 'b' as any) throws TypeError
8. bitHamming(1,4) === 2 (binary: 001 vs 100)
9. bitHamming(0,0) === 0

Tests to include
----------------
- Unit tests for small numbers, large numbers and BigInt values
- Tests for Uint8Array operands including multi-byte arrays
- Error tests: negative integers, unequal byte-array lengths, and invalid argument types

Implementation Notes
--------------------
- For number inputs, ensure they are integers (Number.isInteger) and non-negative; if mixing number and bigint, require both be same numeric kind or explicitly document coercion rules
- Use efficient popcount (e.g., Kernighan's algorithm) for counting set bits
- For Uint8Array, iterate bytes and sum per-byte popcounts; validate length equality first

Related files to update when implementing
-----------------------------------------
- src/lib/main.js: export named function bitHamming
- tests/unit/: add tests that assert the acceptance criteria above
- README.md: add usage examples for both numeric and byte-array forms
