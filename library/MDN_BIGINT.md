MDN_BIGINT

Table of contents
- Normalised extract
- Supplementary details
- Reference details (signatures, types)
- Implementation pattern for Hamming bit distance (step-by-step)
- Detailed digest (source snapshot)
- Attribution and crawl metadata

Normalised extract
- BigInt is a JavaScript primitive type that represents integers with arbitrary precision. It is used for integer values outside the safe integer range for Number (beyond 2^53-1) or where integer precision must be exact.
- Creation methods: literal suffix n (for example 0n, 123n) or constructor form BigInt(value). BigInt accepts BigInt, integer Number values, or string representations of integers. Passing a non-integer Number to BigInt throws a RangeError.
- BigInt arithmetic operations exist for integer arithmetic; mixing BigInt and Number in arithmetic operations is not allowed and results in TypeError; explicit conversion is required when combining types.
- Bitwise operators are available for BigInt operands: &, |, ^, ~, <<, >>. When using these operators with BigInt, both operands must be BigInt values.
- Division of BigInt by BigInt yields a truncated integer result (fractional part removed); there is no built-in decimal/fractional BigInt result.

Supplementary details
- Use BigInt when inputs can exceed Number.MAX_SAFE_INTEGER or when exact integer arithmetic is required. For typical 32-bit and 53-bit ranges, Number bitwise techniques may be faster, but BigInt scales to arbitrary size.
- Validation: when accepting a numeric input that may be a Number or BigInt, check types explicitly:
  - If typeof value === 'bigint' accept directly.
  - If typeof value === 'number' ensure Number.isInteger(value) is true before converting to BigInt; otherwise reject with TypeError or RangeError depending on API semantics.
  - Reject negative integers where the API requires non-negative values by checking value < 0 (for numbers) or value < 0n (for BigInt) and raising RangeError.
- Conversion patterns:
  - From number: BigInt(n) where n is an integer Number.
  - From string: BigInt('12345') where the string represents an integer in base 10 (or pass '0x...' for hex). BigInt accepts an optional string radix if parsed first.

Reference details (signatures, types, exact notes)
- BigInt constructor signature (runtime): BigInt(value) -> bigint
  - Parameters: value: number | string | bigint
  - Returns: bigint
  - Throws: RangeError for non-integer numbers; TypeError for unsupported types
- Literal form: <decimal-integer>n -> bigint
  - Examples: 0n, 1n, 12345678901234567890n
- Bitwise operators (operands must be bigint):
  - a & b -> bigint (bitwise AND)
  - a | b -> bigint (bitwise OR)
  - a ^ b -> bigint (bitwise XOR)
  - ~a -> bigint (bitwise NOT)
  - a << b, a >> b -> bigint (shifts; both operands bigint)
- Interoperability notes:
  - Arithmetic mixing: bigint + number throws TypeError. Explicitly convert numbers to bigint with BigInt(number) or convert bigint to number where safe.
  - Comparisons: relational operators (<, >, <=, >=) can compare BigInt and Number but strict equality (===) requires same type.

Implementation pattern for Hamming bit distance (step-by-step, production-ready)
- Purpose: compute number of differing bits between two non-negative integer inputs (a, b) where inputs may be Number (integer) or BigInt.
- Function signature (informal): hammingBits(a: number|bigint, b: number|bigint) -> number
- Validation steps:
  1. If typeof a !== 'number' and typeof a !== 'bigint', throw TypeError.
  2. If typeof b !== 'number' and typeof b !== 'bigint', throw TypeError.
  3. If typeof a === 'number' and !Number.isInteger(a), throw TypeError.
  4. If typeof b === 'number' and !Number.isInteger(b), throw TypeError.
  5. Convert to bigint: A = typeof a === 'bigint' ? a : BigInt(a); B = typeof b === 'bigint' ? b : BigInt(b).
  6. If A < 0n or B < 0n, throw RangeError for negative integers.
- Core algorithm (Brian Kernighan popcount on bigint):
  1. X = A ^ B         (bitwise XOR of the two bigint values)
  2. count = 0
  3. while X != 0n:
       count = count + 1
       X = X & (X - 1n)
  4. return count (as a Number)
- Complexity: O(k) where k is the number of set bits in A ^ B; memory O(1).
- Implementation notes: return type is a Number; for extremely large integers where count may exceed Number.MAX_SAFE_INTEGER, consider returning a BigInt count or throw if count would exceed safe range. Typical Hamming counts fit safely into Number.

Detailed digest (extracted from MDN BigInt page)
- Snapshot date: 2026-03-18
- Key statements used: BigInt is a built-in primitive representing integers of arbitrary precision; literal suffix n and BigInt(value) constructor; mixing Number and BigInt in arithmetic operations throws; BigInt bitwise operators available and require bigint operands; BigInt conversion and construction rules as above.
- Retrieved HTML size: approx 172.7 KB

Attribution
- Source: MDN Web Docs — BigInt - JavaScript | MDN
- URL: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt
- Retrieved: 2026-03-18
- Data size fetched: ~172.7 KB
