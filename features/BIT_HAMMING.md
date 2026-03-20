# Bit Hamming Distance

Goal
----
Provide a feature to compute Hamming distance between two binary values by counting differing bits. Keep API minimal, predictable, and testable per MISSION.md.

Behavior & API
--------------
- Function: `bitHamming(a: number | bigint | Uint8Array, b: number | bigint | Uint8Array): number`
- Inputs: two numbers, bigints, or byte arrays of equal effective bit-length.
- Output: non-negative integer equal to the number of differing bits.
- Precondition: for byte arrays, lengths must be equal; for numeric types, values are compared in their minimal common bit-width; the function throws `Error('unequal-length')` for mismatched byte-array lengths.

Acceptance Criteria (Testable)
------------------------------
1. Same value: bitHamming(0b1010, 0b1010) === 0
2. Single bit diff: bitHamming(0b1010, 0b1000) === 1
3. BigInt support: bitHamming(0n, 1n) === 1
4. Byte array support: bitHamming(Uint8Array.of(0xFF), Uint8Array.of(0x0F)) === 4
5. Unequal byte-array lengths: bitHamming(Uint8Array.of(1,2), Uint8Array.of(1)) throws Error('unequal-length')

Tests to include
----------------
- Unit tests for small integers
- Tests for BigInt operands
- Tests for Uint8Array operands including multi-byte arrays
- Edge case: comparing zero with larger-width numbers (documented behavior)

Implementation Notes
--------------------
- For numeric types (number, bigint): XOR the values and count set bits (use Kernighan's algorithm or built-in popcount if available).
- For Uint8Array: XOR each corresponding byte and sum popcounts; if lengths differ, throw `Error('unequal-length')`.
- For mixing types, coerce number -> BigInt or require caller to pass same type; keep function small by supporting two overloads only (both numeric or both byte arrays).
- Behavior with signed numbers: treat inputs as unsigned bit patterns of their value ranges; prefer callers to pass unsigned values.
- Keep function pure and side-effect free; include benchmarks for large inputs if needed later.

Alignment with MISSION.md
-------------------------
- Small, focused API surfaces
- Clear acceptance tests and unit tests
- Implementation notes intended for test-driven implementation
