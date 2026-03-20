# BIT_HAMMING

## Goal
Provide a compact, well-documented feature specification for computing Hamming distance between non-negative integers or equal-length byte arrays by counting differing bits. Ensure strict input validation and clear, testable acceptance criteria aligned with MISSION.md.

## Behavior and API
- Exported function: named export bitHamming(a: number | bigint | Uint8Array, b: number | bigint | Uint8Array): number
- Supported operand pairs:
  - Two non-negative integers of the same numeric kind (both number or both bigint)
  - Two Uint8Array instances of equal length
- Operation:
  - For numeric operands: XOR the values and count set bits in the result (popcount)
  - For BigInt operands: use BigInt XOR and a popcount algorithm that supports arbitrary size
  - For Uint8Array operands: XOR each corresponding byte and sum per-byte popcounts

## Validation
- Throw TypeError when arguments are not both numbers, both bigints, or both Uint8Array
- Throw RangeError for negative integer inputs
- Throw RangeError for Uint8Array inputs of mismatched length
- The function must be pure and side-effect free

## Acceptance Criteria (Testable)
1. bitHamming(0b1010, 0b1010) === 0
2. bitHamming(0b1010, 0b1000) === 1
3. bitHamming(0n, 1n) === 1
4. bitHamming(Uint8Array.of(0xFF), Uint8Array.of(0x0F)) === 4
5. bitHamming(Uint8Array.of(1,2), Uint8Array.of(1)) throws RangeError
6. bitHamming(-1, 1) throws RangeError
7. bitHamming('a' as any, 'b' as any) throws TypeError
8. bitHamming(1,4) === 2 (binary: 001 vs 100)
9. bitHamming(0,0) === 0

## Tests to include
- Unit tests for number and bigint inputs (small and large values)
- Unit tests for Uint8Array inputs including multi-byte arrays
- Error tests for negative integers, unequal byte-array lengths, mixed types, and invalid types

## Implementation notes
- For number inputs ensure Number.isInteger and non-negative before processing
- Use an efficient popcount (e.g., Kernighan's algorithm) for numbers and an appropriate loop for BigInt
- For Uint8Array, validate lengths first and sum per-byte popcounts

## Related changes when implementing
- Export bitHamming from src/lib/main.js as a named export
- Add unit tests in tests/unit/ to assert the acceptance criteria above
- Update README.md with usage examples for numeric and byte-array forms
