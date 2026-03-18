ECMASCRIPT_BITWISE_OPERATORS

Table of contents
- Operators covered
- Numeric coercion and ToInt32/ToUint32
- Exact ToInt32 algorithm
- Operator semantics (examples: ^, &, |, ~, <<, >>, >>>)
- BigInt behaviour and mixing rules
- Implementation patterns for Hamming distance (Number vs BigInt)
- Detailed digest (retrieval date and size)
- Attribution

Normalised extract
Operators covered
- Bitwise AND (&), OR (|), XOR (^), NOT (~), left shift (<<), signed right shift (>>), unsigned right shift (>>>).

Numeric coercion and ToInt32/ToUint32
- Bitwise operators operate on 32-bit integer representations obtained by coercing operand values using ECMAScript numeric abstract operations. For most bitwise operations the operands are converted with ToInt32; unsigned right shift (>>>) uses ToUint32 for the left operand.
- High-level steps for a binary bitwise operator (e.g. ^):
  1. Let lnum = ? ToNumber(lref).
  2. Let rnum = ? ToNumber(rref).
  3. Let l32 = ToInt32(lnum).
  4. Let r32 = ToInt32(rnum).
  5. Let result32 be the 32-bit bitwise operation applied to l32 and r32.
  6. Return Number(result32).

Exact ToInt32 algorithm (precise)
1. Let number be ? ToNumber(argument).
2. If number is NaN, +0, -0, +Infinity, or -Infinity, return +0.
3. Let int = sign(number) * floor(abs(number)).
4. Let int32bit be int modulo 2^32 (i.e., int & 0xFFFFFFFF as an arithmetic modulus).
5. If int32bit >= 2^31, return int32bit - 2^32; otherwise return int32bit.

Implication: bitwise operators yield 32-bit two's-complement semantics; numbers outside 32-bit range are truncated modulo 2^32, which affects bit-level comparisons.

Operator semantics (notes)
- ^ (XOR): bitwise exclusive-or performed on 32-bit two's-complement operands; result is converted to Number representing signed 32-bit integer.
- >>> (unsigned right shift): uses ToUint32 on its left operand and returns a Number in the 0..2^32-1 range (non-negative).
- << and >> use ToInt32 on left operand and ToUint32 on shift count then perform shift.

BigInt behaviour
- BigInt supports bitwise operators (&, |, ^, ~, <<, >>) for BigInt operands. These operate on arbitrary-length signed two's-complement representations for BigInt values.
- Mixing BigInt and Number with bitwise operators throws a TypeError.
- The unsigned right-shift operator >>> does not have a BigInt variant.

Implementation patterns for Hamming distance
- For non-negative integers that fit in 32 bits (0 <= n < 2^32), compute x = a ^ b (Numbers); then count set bits in x using Kernighan's method: while (x !== 0) { x = x & (x - 1); count++; } This is safe and fast when inputs are Numbers within 32-bit range.
- For integers potentially larger than 32 bits or exact large-integer semantics, convert to BigInt and use BigInt bitwise XOR: x = BigInt(a) ^ BigInt(b); then count set bits using the BigInt variant of Kernighan's method: while (x !== 0n) { x &= x - 1n; count++; } Use n literal suffix for constants when manipulating BigInts.
- Do not mix Number and BigInt in bitwise expressions; ensure both operands are BigInt when using BigInt approach.

Reference details (practical)
- ToInt32(n): described above; use this to reason about how Number bitwise ops truncate.
- For Hamming distance between Numbers known to be non-negative and within 32-bit range, perform XOR then popcount.
- For full-range integers use BigInt XOR and BigInt popcount.

Detailed digest
Source: ECMAScript Language Specification (ECMA-262)
Retrieved: 2026-03-18
Bytes retrieved during crawl: 1092632
Key technical content used: operator semantics, exact ToInt32/ToUint32 coercions, BigInt operator notes, and interaction between Number and BigInt types.

Attribution
Source URL: https://262.ecma-international.org/13.0/
Data retrieved: 2026-03-18; 1092632 bytes
License / attribution: ECMA International specification; consult original page for full licensing and normative text.
