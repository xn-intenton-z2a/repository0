WIKIPEDIA_HAMMING_DISTANCE

Table of contents
1. Definition
2. String Hamming distance (algorithm)
3. Integer/bit Hamming distance (XOR + popcount)
4. Properties and complexity
5. Implementation notes for JavaScript
6. Digest and attribution

Normalised extract
Definition: The Hamming distance between two strings of equal length is the number of positions at which the corresponding symbols are different.

String Hamming distance (algorithm):
- Preconditions: two sequences of equal length (string length measured in Unicode code points for correctness with Unicode).
- Algorithm (direct):
  1. Normalize both strings if canonical equivalence is desired (use String.prototype.normalize with NFC by default).
  2. Convert each string to its sequence of code points (use Array.from(string) or iterate with for...of which yields code points). Let A and B be those sequences.
  3. If A.length !== B.length then throw RangeError (unequal length requirement).
  4. Count positions i where A[i] !== B[i]; return that count.
- Complexity: O(n) time, O(n) additional memory if you materialize arrays; O(1) additional memory if you iterate in streaming fashion while checking equal-length via two iterators.

Integer/bit Hamming distance (XOR + popcount):
- Definition: For two non-negative integers x and y, compute xor = x XOR y; the Hamming distance is the number of 1 bits in xor (the population count, popcount).
- Formula: H(x,y) = popcount(x XOR y).
- Example: 1 (001) vs 4 (100) -> xor = 101 -> popcount = 2.

Properties and complexity:
- Counting differing bits is proportional to the number of set bits in xor using Kernighan's algorithm: O(k) where k is popcount; worst-case O(w) where w is word width.
- For fixed-width words, table or parallel bit-count algorithms provide O(1) time with small constant factors.

Implementation notes for JavaScript (direct, actionable):
- Validate types: throw TypeError if inputs are not strings (for string variant) or not numbers/bigints (for integer variant); throw RangeError for negative integers or unequal-length strings.
- Use Unicode code points for string length/comparison: Array.from(s) or for (const ch of s) to iterate code points.
- For integers prefer BigInt-based implementation to preserve arbitrary bit width: convert numeric inputs to BigInt before XOR to avoid 32-bit truncation.

Reference details (API signatures and patterns):
- Function: hammingDistanceStrings(a: string, b: string) -> number
  - Parameters: a (string), b (string)
  - Throws: TypeError if typeof a !== 'string' or typeof b !== 'string'. RangeError if code point lengths differ.
  - Implementation pattern: let A = Array.from(a.normalize('NFC')); let B = Array.from(b.normalize('NFC')); if (A.length !== B.length) throw new RangeError('Unequal length'); let count=0; for (let i=0;i<A.length;i++){ if (A[i] !== B[i]) count++; } return count;

- Function: hammingDistanceIntegers(x: number|bigint, y: number|bigint) -> number
  - Parameters: x, y (non-negative integers; accepts Number or BigInt)
  - Throws: TypeError if typeof is not 'number' or 'bigint' or if number is not an integer. RangeError if negative.
  - Implementation pattern (robust):
    1. If typeof x === 'number' and Number.isInteger(x) and typeof y === 'number' and Number.isInteger(y), but either exceeds 2**31-1, convert to BigInt for correctness: X = BigInt(x); Y = BigInt(y).
    2. Else convert both to BigInt: X = BigInt(x); Y = BigInt(y).
    3. let diff = X ^ Y; // BigInt XOR
    4. let count = 0; while (diff !== 0n) { diff &= diff - 1n; count++; } return Number(count);
  - Notes: Use BigInt to avoid 32-bit truncation caused by JS numeric bitwise operators.

Supplementary details
- For strings: Normalization matters for canonical equivalence. Use normalize('NFC') or the form required by the application before comparing code points.
- For integers: JavaScript Number bitwise operators operate on 32-bit signed integers (ToInt32 conversion). To preserve full integer bit patterns for values beyond 32 bits or beyond Number.MAX_SAFE_INTEGER, use BigInt.

Digest (retrieved: 2026-03-18)
- Extracted: precise definition of Hamming distance for strings and integers; algorithmic pattern H(x,y)=popcount(x^y); example values (karolin vs kathrin -> 3; 1 vs 4 -> 2); implementation guidance for JS including Unicode code point iteration and BigInt-based popcount.
- Source: https://en.wikipedia.org/wiki/Hamming_distance
- Bytes retrieved: 156785
