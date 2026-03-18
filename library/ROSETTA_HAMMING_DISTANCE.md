ROSETTA HAMMING DISTANCE

Table of contents
- Definition
- String Hamming (code-point aware)
- Integer/Bit Hamming (popcount)
- Validation and error conditions
- Complexity and implementation notes
- Supplementary details
- Reference API signatures
- Detailed digest (retrieved)
- Attribution and data size

Definition
The Hamming distance between two equal-length sequences is the number of positions at which the corresponding symbols are different. For integer values, the Hamming distance is the number of differing bits between two non-negative integers (equivalently, the Hamming weight of their bitwise exclusive-or).

String Hamming (code-point aware)
- Precondition: both inputs are strings and must have identical counts of Unicode code points.
- Code-point iteration: use the String iterator (for...of) or Array.from(string) or [...string] to obtain one element per Unicode code point (not UTF-16 code units). Each yielded element represents a single Unicode code point (which may be a single BMP code unit or a surrogate pair).
- Algorithm (streaming, O(n) time, O(1) extra space): create iterators for both strings and advance them in lock-step; for each pair of yielded code points, increment a counter if the code point values are not strictly equal. After iteration, ensure both iterators are exhausted; if one still yields a code point the input lengths differ in code points and a RangeError must be raised.
- Example: "karolin" vs "kathrin" -> compare code points at each position; mismatches count = 3.

Integer/Bit Hamming (popcount)
- Precondition: inputs are non-negative integers expressed as Number (integer) or BigInt. If either input is BigInt, convert both to BigInt before bit operations. For Numbers, validate with Number.isInteger and non-negativity; for BigInt validate type and non-negativity.
- Core operation: compute xor = a ^ b (BigInt or Number). The Hamming distance is the number of one-bits in xor.
- Popcount (Kernighan): use repeated clearing of the lowest set bit: while (xor !== 0) { xor &= xor - 1; count++; } Implement with BigInt arithmetic when operands are BigInt (use 0n, 1n, etc.). This method runs in O(k) where k is the number of set bits in xor and uses O(1) extra memory.
- Alternative: use table lookup or built-in CPU popcount via WebAssembly or native bindings for performance-critical code; for JS BigInt there is no native popcount function so Kernighan is simple, correct and portable.
- Example: 1 (001) vs 4 (100) -> xor=101 -> popcount=2.

Validation and error conditions
- TypeError must be thrown when inputs are of unsupported types (e.g., non-string for string hamming; non-integer or not Number/BigInt for integer hamming).
- RangeError must be thrown for unequal-length strings (measured in Unicode code points) and for negative integer inputs.
- For mixed numeric types, convert Number to BigInt when either operand is BigInt to avoid precision loss.

Complexity and implementation notes
- String algorithm: O(n) time where n is number of code points, O(1) streaming memory if using iterators, O(n) if converting to arrays of code points.
- Integer algorithm: time proportional to the number of set bits in xor using Kernighan; worst-case O(w) where w is word size/bit-length; using BigInt increases bit-length but algorithm remains linear in number of set bits.
- Unicode considerations: comparing user-perceived grapheme clusters is different from code-point comparison. The library intentionally compares code points; document explicitly that this is by-code-point Hamming distance.

Supplementary details
- Use String.prototype[@@iterator] semantics to obtain code points: the iterator yields UTF-16 sequence segments combined into a single JavaScript string element per Unicode code point. Avoid using string indexing or split('') which operate on UTF-16 code units and will split surrogate pairs.
- When converting Number to BigInt for bit operations, use BigInt(number) only for safe integers; if number may exceed Number.MAX_SAFE_INTEGER, prefer using BigInt inputs.
- Edge cases: empty strings are valid inputs and return 0; 0 vs 0 returns 0 bits difference.

Reference API signatures (recommended public surface)
- hammingString(a: string, b: string): number
  - a, b: strings (compared by Unicode code points)
  - returns: non-negative integer count
  - throws: TypeError if a or b not strings; RangeError if code-point lengths differ
- hammingBits(a: number | bigint, b: number | bigint): number
  - a, b: non-negative integers (Number integers or BigInt). If either is BigInt, both are treated as BigInt.
  - returns: non-negative integer count of differing bits
  - throws: TypeError if operands not integer types; RangeError if negative

Detailed digest (source excerpt and retrieval)
- Source: Rosetta Code — Hamming distance (https://rosettacode.org/wiki/Hamming_distance)
- Retrieval date: 2026-03-18
- Data obtained: 42192 bytes
- Extracted content used: page defines Hamming distance as the number of differing symbol positions in equal-length strings and notes integer/bit interpretations via XOR and bit counting; example problems and language-specific implementations are provided illustrating both string-position comparisons and bit-level popcount approaches. The page organizes implementations by language and demonstrates the canonical approach: string iteration for equal-length sequences and XOR + popcount for integers.

Attribution
- Rosetta Code (rosettacode.org) — page retrieved 2026-03-18; raw HTML 42192 bytes

