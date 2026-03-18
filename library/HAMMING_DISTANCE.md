TABLE OF CONTENTS

- Definition & formula
- String Hamming (Unicode-aware)
- Integer Hamming (bit-level)
- Implementation (pseudocode)
- API specification (signatures, parameters, exceptions, returns)
- Complexity & performance
- Edge cases and acceptance tests
- References and crawl digest


DEFINITION & FORMULA

Hamming distance between two equal-length sequences x and y is the count of positions i where x_i != y_i.
Mathematical formula: d(x, y) = Σ_{i=1..n} 1_{x_i ≠ y_i}
For non-negative integers a and b interpreted as bit vectors of equal (implicit) length, the bit-level Hamming distance is the Hamming weight of their bitwise XOR: d(a, b) = popcount(a XOR b).


STRING HAMMING (UNICODE-AWARE)

Key requirements:
- Compare Unicode code points, not UTF-16 code units.
- Use canonical normalization when desired to treat canonically-equivalent sequences as equal (recommended: NFC).
- Length equality and position indexing must operate over code points (grapheme clusters are out-of-scope unless explicitly required).

Practical JavaScript approach:
- Normalize both strings: s1 = s1.normalize('NFC'); s2 = s2.normalize('NFC')
- Obtain code-point arrays: a1 = Array.from(s1)  // iterates code points; each element is a string representing one code point
                      a2 = Array.from(s2)
- If a1.length !== a2.length, throw RangeError
- Count differing positions: count = sum(i: a1[i] !== a2[i])

Notes:
- String.length counts UTF-16 code units; do not use it for length checks when Unicode correctness is required.
- Array.from(s) and for..of iterate over code points and correctly handle surrogate pairs and astral symbols.
- Normalization handles combined-mark vs composed forms: e.g., 'e\u0301' vs 'é'.


INTEGER HAMMING (BIT-LEVEL)

Algorithmic summary:
- Work in arbitrary precision using BigInt to avoid 32-bit truncation and to support large integers.
- Convert inputs to BigInt: X = BigInt(a); Y = BigInt(b)
- Validate non-negativity: if X < 0n or Y < 0n throw RangeError
- Compute XOR: V = X ^ Y
- Compute popcount(V) to count set bits in V; result is Hamming distance.

Recommended popcount (Brian Kernighan) using BigInt:
- count = 0
- while V != 0n:
    V = V & (V - 1n)
    count += 1
- return count

This algorithm runs in O(k) where k is the number of set bits; worst-case O(B) where B is bit-width.


IMPLEMENTATION (PSEUDOCODE)

computeStringHamming(s1, s2):
- if typeof s1 !== 'string' or typeof s2 !== 'string' throw TypeError
- s1n = s1.normalize('NFC')
- s2n = s2.normalize('NFC')
- a1 = Array.from(s1n)
- a2 = Array.from(s2n)
- if a1.length !== a2.length throw RangeError
- count = 0
- for i from 0 to a1.length-1:
    if a1[i] !== a2[i]: count += 1
- return count

computeIntegerHamming(a, b):
- if (typeof a !== 'number' && typeof a !== 'bigint') or (typeof b !== 'number' && typeof b !== 'bigint') throw TypeError
- X = BigInt(a)
- Y = BigInt(b)
- if X < 0n or Y < 0n throw RangeError
- V = X ^ Y
- count = 0
- while V != 0n:
    V = V & (V - 1n)
    count += 1
- return count


API SPECIFICATION

computeStringHamming(s1: string, s2: string) -> number
- Parameters: s1, s2: UTF-16 strings
- Precondition: both are strings
- Behaviour: normalize both strings to NFC, compare code points, count differing positions
- Exceptions: throws TypeError if either argument is not a string; throws RangeError if code-point lengths differ
- Return: non-negative integer (0..n)

computeIntegerHamming(a: number|bigint, b: number|bigint) -> number
- Parameters: a, b: non-negative integers (Number or BigInt). When Number provided, values are coerced to BigInt; using BigInt is recommended for large values.
- Precondition: inputs represent non-negative integers (no fractional numbers)
- Behaviour: compute BigInt(a) ^ BigInt(b), count set bits using Kernighan loop
- Exceptions: throws TypeError if inputs are not integer-typed (reject floats); throws RangeError if negative
- Return: non-negative integer equal to the number of differing bits

Validation notes:
- To test integer-ness for Number inputs, ensure Number.isInteger(x) is true before coercion; otherwise throw TypeError.


COMPLEXITY & PERFORMANCE

- String Hamming: O(n) where n is number of code points (Array.from iteration + single pass). Normalization adds additional O(n) work.
- Integer Hamming (Kernighan): O(k) where k is the number of set bits in XOR result; worst-case O(B) where B is bit-width of integers.
- Use BigInt for arbitrary-size integers; for small 32-bit values builtin number bitwise operators may be faster but subject to 32-bit truncation.


EDGE CASES & ACCEPTANCE TESTS

- "karolin" vs "kathrin" => 3
- "" vs "" -> 0
- unequal-length strings (by code points) -> throw RangeError
- computeIntegerHamming(1, 4) -> 2 (binary 001 vs 100)
- computeIntegerHamming(0, 0) -> 0


REFERENCES AND CRAWL DIGEST

Sources used (retrieved 2026-03-18):
- https://en.wikipedia.org/wiki/Hamming_distance  (retrieved 2026-03-18; bytes downloaded: 165661)
- https://en.wikipedia.org/wiki/Hamming_weight   (retrieved 2026-03-18; bytes downloaded: 164722)

Attribution: definitions and algorithms based on the Wikipedia articles above; JS-specific patterns (Array.from, normalize) cross-referenced with MDN Unicode guidance.
