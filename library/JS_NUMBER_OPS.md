NORMALISED EXTRACT

TABLE OF CONTENTS
1. Number.isInteger
2. Remainder operator (%) semantics
3. RangeError usage patterns
4. Interaction patterns (validation + arithmetic)

1. Number.isInteger
- Signature: Number.isInteger(value) -> boolean
- Definition: returns true only if typeof value === 'number', isFinite(value) is true, and Math.floor(value) === value. In other words, it returns true for all IEEE-754 numeric values that are mathematical integers, including -0 and negative integers, but false for NaN, Infinity, non-number types, and BigInt values.
- Usage: Use to validate user input before integer-only operations; avoid coercion (do not call Number.isInteger('3')).
- Polyfill: function isInteger(v){ return typeof v === 'number' && isFinite(v) && Math.floor(v) === v }

2. Remainder operator (%) semantics
- Operator: a % b
- Result: returns remainder r where a === (b * q + r) for some integer q; JavaScript's % returns a remainder with the sign of the dividend (a). Examples: 5 % 3 === 2; -5 % 3 === -2.
- Division by zero: x % 0 === NaN for finite x; 0 % 0 === NaN.
- Floats: % works on floating point numbers following IEEE-754 semantics for remainder; (5.5 % 1.2) yields the floating remainder.
- BigInt: % is supported for BigInt operands only; mixing Number and BigInt throws TypeError.
- Correct positive-modulo normalization: To obtain a non-negative modulo result use ((a % b) + b) % b when b > 0.

3. RangeError usage patterns
- Construction: new RangeError([message]) creates a RangeError object with name 'RangeError' and the provided message.
- Typical throw cases in JS runtime: numeric formatting methods (e.g., Number.prototype.toFixed when digits argument out of accepted range), invalid array lengths, or any API where a numeric parameter is outside allowed bounds.
- Recommended usage: when validating numeric parameter ranges, throw RangeError rather than generic Error; include the invalid value in the message.
- Example check (exact): if (value < min || value > max) throw new RangeError(`value ${value} out of range [${min},${max}]`)

4. Interaction patterns (validation + arithmetic)
- Validate numeric inputs before applying % or other arithmetic operations: if (typeof v !== 'number' || !Number.isFinite(v)) throw TypeError('...')
- Use Number.isInteger to protect operations that assume integers (array indices, sequence lengths) and RangeError for out-of-bounds numeric values.
- When implementing divisibility: const divisible = (n % k) === 0; combine positive-normalization when consumers expect non-negative residues.

SUPPLEMENTARY DETAILS

Exact method signatures and returns
- Number.isInteger(value): boolean
  - Parameters: value: any
  - Returns: true if value is a number and a mathematical integer; false otherwise.
- Remainder operator: a % b
  - Operands: both Number or both BigInt (not mixed)
  - Return: Number or BigInt respectively; returns NaN for division by zero with Number operands.

Best practices and examples (no escaping of code blocks)
- Validate with Number.isInteger before using value as an array length or loop count.
- Normalize negative modulo results where caller expects non-negative representative: const mod = ((a % b) + b) % b
- Prefer throwing RangeError on out-of-bounds numeric parameters: throw new RangeError(`...`)

REFERENCE DETAILS

Exact API semantics and effects
- Number.isInteger: no coercion; false for string digits; returns true for -0 and integer values within Number range.
- % operator: remainder retains sign of left operand; mixing types between Number and BigInt causes TypeError; dividing by zero returns NaN for Numbers.

Troubleshooting
- If modulo yields negative results but positive residues expected, apply normalization formula.
- If BigInt arithmetic fails, ensure both operands are BigInt, not Number.
- If Number.isInteger returns false for values that appear integral, verify the value is finite and not a string.

DIGEST
- Source list entries: MDN pages for Number.isInteger and Arithmetic operators (remainder), MDN RangeError
- Retrieval date: 2026-03-07
- Crawl size: 0 bytes downloaded; content synthesized from local source list and knowledge.