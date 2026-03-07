BIGINT

TABLE OF CONTENTS
1. NORMALISED EXTRACT
  1.1 Creation and literal syntax
  1.2 Operators supported and mixing rules with Number
  1.3 BigInt coercion rules and conversions
  1.4 Special behaviors (division, JSON, timing)
2. SUPPLEMENTARY DETAILS
  2.1 Constructor and static methods
  2.2 Instance methods and toString/toLocaleString
  2.3 Interop and safe patterns
3. REFERENCE DETAILS (API SIGNATURES, PARAMETERS, RETURN TYPES, EFFECTS)
  3.1 BigInt(value) -> bigint
  3.2 BigInt.asIntN(width, bigint) -> bigint
  3.3 BigInt.asUintN(width, bigint) -> bigint
  3.4 Operator table and exact semantics
4. TROUBLESHOOTING AND PROCEDURES
  4.1 JSON serialization strategies
  4.2 Performance and cryptographic cautions
5. SOURCE DIGEST AND RETRIEVAL METADATA
6. ATTRIBUTION

1. NORMALISED EXTRACT

1.1 Creation and literal syntax
- BigInt literal: append n to integer literal (e.g., 9007199254740991n).
- BigInt() constructor: BigInt(9007199254740991) or BigInt("0x1fffffffffffff"). Calling with new throws.

1.2 Operators supported and mixing rules with Number
- Supported arithmetic and bitwise operators: + - * / % ** & | ^ ~ << >> (operands must both be BigInt or both Number; mixing throws TypeError for arithmetic/bitwise).
- Relational and equality operators can mix Number and BigInt where they are conceptually comparable; strict equality differs (0n === 0 is false, 0n == 0 is true).
- Unary plus (+) and unsigned right shift >>> are not supported on BigInt.

1.3 BigInt coercion rules and conversions
- BigInt(x) coerces: BigInt returns same BigInt; undefined/null throw; boolean true->1n false->0n; strings parsed as integer literals; numbers throw TypeError unless via BigInt() which accepts integer Numbers.
- Built-ins expecting BigInt coerce arguments via ToBigInt abstract operation; Numbers throw unless converted explicitly.

1.4 Special behaviors (division, JSON, timing)
- Division truncates fractional component toward zero: 5n / 2n === 2n.
- JSON.stringify throws on encountering a BigInt unless replacer or BigInt.prototype.toJSON is provided.
- BigInt operations are not constant-time and can leak timing information; do not use for cryptographic secrets without mitigations.

2. SUPPLEMENTARY DETAILS

2.1 Constructor and static methods
- BigInt.asIntN(width, bigint): clamps to signed width bits.
- BigInt.asUintN(width, bigint): clamps to unsigned width bits.

2.2 Instance methods
- toString(radix?): string representation; toLocaleString provides locale-aware format; valueOf returns primitive bigint.

2.3 Interop and safe patterns
- When mixing data types across network/JSON boundaries, serialize BigInt explicitly as string with a reviver to parse back to BigInt.
- Avoid implicit coercion; explicitly call Number(big) or BigInt(num) depending on intent, and check for precision loss when converting BigInt -> Number.

3. REFERENCE DETAILS (API SIGNATURES, PARAMETERS, RETURN TYPES, EFFECTS)

3.1 BigInt(value) -> bigint
- Parameter: value can be string, number (when using BigInt() call), boolean, or object coercible to primitive; returns a bigint or throws on invalid input.

3.2 BigInt.asIntN(width: number, bigint: bigint) -> bigint
- Clamps bigint to signed integer of width bits, returns bigint.

3.3 BigInt.asUintN(width: number, bigint: bigint) -> bigint
- Clamps bigint to unsigned integer of width bits, returns bigint.

3.4 Operator table and exact semantics
- +, -, *, **, /, %, &, |, ^, <<, >> operate on BigInt operands and return BigInt. Mixing with Number for these operators throws TypeError. Relational operators compare values across types.

4. TROUBLESHOOTING AND PROCEDURES

4.1 JSON serialization strategies
- Option A: add BigInt.prototype.toJSON = function() { return this.toString(); } and use a reviver to parse.
- Option B: use replacer to detect typeof value === 'bigint' and replace with { $bigint: value.toString() }.

4.2 Performance and cryptographic cautions
- BigInt not constant-time; avoid for secret-dependent arithmetic. Use constant-time libraries or WebCrypto primitives for crypto workloads.

5. SOURCE DIGEST AND RETRIEVAL METADATA
- Source: MDN BigInt reference; retrieved 2026-03-07T20:27:36.378Z. Page content partially used and paraphrased.

6. ATTRIBUTION
- Derived from MDN: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt
