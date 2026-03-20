# Bit Hamming Distance

Goal
----
Provide a feature to compute Hamming distance between two non-negative integer values or equal-length byte arrays by counting differing bits. Keep API minimal, predictable, and testable per MISSION.md.

Behavior & API
--------------
- Function: `bitHamming(a: number | bigint | Uint8Array, b: number | bigint | Uint8Array): number`
- Inputs: two non-negative integers (number or bigint) or two Uint8Array instances of equal length.
- Output: non-negative integer equal to the number of differing bits.
- Validation: throw TypeError when arguments are not numbers, bigints, or Uint8Array as appropriate; throw RangeError for negative integers or for mismatched byte-array lengths.

Acceptance Criteria (Testable)
------------------------------
1. Same value: bitHamming(0b1010, 0b1010) === 0
2. Single bit diff: bitHamming(0b1010, 0b1000) === 1
3. BigInt support: bitHamming(0n, 1n) === 1
4. Byte array support: bitHamming(Uint8Array.of(0xFF), Uint8Array.of(0x0F)) === 4
5. Unequal byte-array lengths: bitHamming(Uint8Array.of(1,2), Uint8Array.of(1)) throws RangeError
6. Negative integers: bitHamming(-1, 1) throws RangeError
7. Type validation: bitHamming('a', 'b') throws TypeError

Tests to include
----------------
- Unit tests for small integers and large integers
- Tests for BigInt operands
- Tests for Uint8Array operands including multi-byte arrays
- Error tests: negative integers, unequal byte-array lengths, and invalid argument types

Implementation Notes
--------------------
- For numeric types (number, bigint): require non-negative values, XOR the values and count set bits (use Kernighan's algorithm or built-in popcount when available).
- For Uint8Array: require equal lengths; XOR each corresponding byte and sum popcounts; if lengths differ, throw RangeError.
- For mixing numeric types: prefer callers to pass matching numeric types; implementation may coerce number to bigint when both are numeric but document behavior.
- Keep function pure and side-effect free; document edge cases and recommend normalisation/coercion rules in README.

Alignment with MISSION.md
-------------------------
- Matches required capabilities for integer/bit-level Hamming distance
- Explicit validation and errors per mission (TypeError and RangeError)
- Clear acceptance criteria for unit tests and documentation
