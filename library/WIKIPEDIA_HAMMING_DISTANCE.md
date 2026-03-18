WIKIPEDIA_HAMMING_DISTANCE

Source: https://en.wikipedia.org/wiki/Hamming_distance
Retrieved: 2026-03-18
Bytes fetched (approx): 161.8 KB

Table of contents:
1. Definition
2. Formal formula
3. Metric properties
4. Relation to XOR / popcount
5. Implementation notes (JavaScript strings)
6. Implementation notes (binary/integer)
7. Examples
8. Supplementary details
9. Reference API signatures
10. Detailed digest and attribution

1. Definition
The Hamming distance between two equal-length strings or vectors is the number of positions at which the corresponding symbols are different. This applies to symbol alphabets (characters) and to binary vectors.

2. Formal formula
Given two sequences x and y of length n:
 d(x, y) = sum_{i=0..n-1} [ x_i != y_i ]
Here [cond] is 1 if cond is true, 0 otherwise.

3. Metric properties
- Non-negativity: d(x,y) >= 0
- Identity: d(x,y) = 0 iff x == y
- Symmetry: d(x,y) = d(y,x)
- Triangle inequality: d(x,z) <= d(x,y) + d(y,z)
Thus Hamming distance is a metric on fixed-length sequences.

4. Relation to XOR / popcount
For binary vectors or non-negative integers represented in binary, Hamming distance equals the number of 1-bits in the bitwise XOR of the two values:
 d(a,b) = popcount(a XOR b)
This gives an O(k) method based on counting set bits, where k = number of set bits in the XOR.

5. Implementation notes (JavaScript strings)
- Compare code points, not UTF-16 code units. Use Array.from(string), spread [...string], or for-of iteration to obtain code points.
- Validation: both inputs must be strings, otherwise throw TypeError.
- Length validation: if Array.from(a).length !== Array.from(b).length then throw RangeError.
- Complexity: O(n) time, O(n) auxiliary if arrays are created, otherwise O(1) extra if iterating in lockstep.

Example implementation pattern (plain text pseudocode):
 function hammingDistanceStrings(a: string, b: string): number
   if typeof a !== 'string' or typeof b !== 'string' -> throw TypeError
   let A = Array.from(a)
   let B = Array.from(b)
   if A.length !== B.length -> throw RangeError
   let count = 0
   for i from 0 to A.length-1
     if A[i] !== B[i] then count++
   return count

6. Implementation notes (binary/integer)
- Validation: inputs must be integers and non-negative; otherwise throw TypeError or RangeError as appropriate.
- For values that fit in 32 bits: coerce to unsigned with >>> 0, compute XOR, then use a popcount on a 32-bit integer.
- For values > 32-bit, prefer BigInt and perform BigInt XOR then count bits by iterating using x &= x - 1 (if supported) or shifting.

Example pattern (plain text pseudocode):
 function hammingDistanceBits(a: number, b: number): number
   if not Number.isInteger(a) or a < 0 or not Number.isInteger(b) or b < 0 -> throw TypeError/RangeError
   let x = (a >>> 0) ^ (b >>> 0)   // 32-bit unsigned XOR
   return popcount32(x)

Where popcount32(x) can be implemented with Kernighan's algorithm:
 let count = 0
 while x != 0
   x = x & (x - 1)
   count++
 return count

For BigInt: let x = BigInt(a) ^ BigInt(b); while (x) { count += Number(x & 1n); x >>= 1n }

7. Examples (concrete)
- hammingDistanceStrings('karolin', 'kathrin') => 3
- hammingDistanceStrings('', '') => 0
- hammingDistanceBits(1, 4) => 2   (binary 001 vs 100)
- hammingDistanceBits(0, 0) => 0

8. Supplementary details
- Empty strings: valid and return 0.
- Negative integers: should throw RangeError per mission constraints.
- Non-string inputs for string function: throw TypeError.
- Use normalization (String.prototype.normalize) when canonical equivalence matters (e.g., composed vs decomposed accents).

9. Reference API signatures (exact forms to adopt)
 export function hammingDistanceStrings(a: string, b: string): number
   Throws: TypeError if inputs are not strings
           RangeError if lengths differ after Unicode code-point segmentation
 export function hammingDistanceBits(a: number, b: number): number
   Throws: TypeError if inputs are not integers
           RangeError if inputs are negative

10. Detailed digest (key technical content extracted)
- Definition: Hamming distance counts differing positions in equal-length sequences.
- For binary data, compute XOR then use popcount to count differing bits.
- For textual data, iterate code points (Array.from or for-of) so that surrogate pairs are treated as single code points.
- Implementation patterns: length checks, type checks, XOR+popcount for integers, Array.from + indexwise compare for strings.

Attribution
Content derived and condensed from the Wikipedia article "Hamming distance" (https://en.wikipedia.org/wiki/Hamming_distance), retrieved 2026-03-18. Data fetched ~161.8 KB (HTML).