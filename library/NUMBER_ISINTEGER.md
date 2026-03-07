DOCUMENT: NUMBER_ISINTEGER

Table of Contents
1. Purpose and definition
2. Behavioural rules and edge cases
3. Syntax and signature
4. Implementation details and polyfill
5. Performance and usage patterns
6. Compatibility and alternatives
7. Supplementary details (specs, types, return values)
8. Reference details (method signature, parameters, return types, examples)
9. Troubleshooting and best practices
10. Digest and retrieval metadata

1. Purpose and definition
Number.isInteger determines whether the provided value is an integer. It returns true only for values of the Number type that are finite and have no fractional component.

2. Behavioural rules and edge cases
- Only values of the JavaScript Number primitive type are considered. Non-number values (including BigInt) return false.
- NaN and Infinity (both +Infinity and -Infinity) return false because they are not finite integers.
- Numeric strings (e.g., "42") return false; no coercion is performed.
- Positive and negative zero are integers: Number.isInteger(+0) and Number.isInteger(-0) both return true.
- Very large numbers exceeding the safe integer range are still tested for fractional parts; however, precision may make the integer check unreliable for integers outside Number.MAX_SAFE_INTEGER and below Number.MIN_SAFE_INTEGER.

3. Syntax and signature
Number.isInteger(value)
- Parameter: value (any) — the value to be tested.
- Returns: boolean — true if value is of type Number and is an integer, otherwise false.

4. Implementation details and polyfill
Native behaviour (specification algorithm):
- If Type(value) is not Number, return false.
- If value is NaN or value is +Infinity or -Infinity, return false.
- If floor(abs(value)) === abs(value) return true, else return false.

Polyfill (semantic description, not code):
- To approximate: return typeof value === 'number' && isFinite(value) && Math.floor(value) === value
- Be cautious: Math.floor for negative numbers: Math.floor(-1.0) === -1, so equality check holds. Using Math.trunc(value) === value is equivalent for this purpose when available.

5. Performance and usage patterns
- In hot loops prefer an inline check combining typeof and isFinite to avoid property lookup overhead: typeof v === 'number' && isFinite(v) && Math.trunc(v) === v
- For large arrays where only integer indices are relevant, use Number.isInteger when validating index-like values before using them to access arrays or typed arrays.
- Avoid using Number.isInteger to validate numeric strings or BigInt; instead parse or use typeof checks for BigInt.

6. Compatibility and alternatives
- Supported in all modern browsers and Node.js versions aligned with ES2015+; for older environments include the polyfill.
- Alternative checks:
  - For integer-like strings: Number.isInteger(Number(value)) is insufficient because Number('1.0') yields 1, but original string types should likely be rejected first.
  - For BigInt: use typeof value === 'bigint' to accept big integers explicitly.

7. Supplementary details (specs, types, return values)
- ECMAScript specification: Number.isInteger is part of the ECMAScript 2015 (ES6) number utilities.
- Parameter types: any JavaScript value.
- Return type: boolean.
- Side effects: none.
- Exceptions: none; the method never throws for ordinary inputs.

8. Reference details (method signature, parameters, return types, examples)
- Signature: Number.isInteger(value) -> boolean
- Parameters:
  - value: any — value to test.
- Return:
  - true if value is a Number and an integer; false otherwise.
- Implementation pattern examples (descriptions):
  - Index validation: if (!Number.isInteger(i) || i < 0 || i >= arr.length) throw new RangeError('Invalid index')
  - Input validation for APIs: require Number.isInteger(limit) and limit > 0 to accept integer limits
  - Integer enforcement after arithmetic: if (!Number.isInteger(Math.round(result))) handle rounding logic explicitly

9. Troubleshooting and best practices
- Unexpected false for large integers: check if values exceed Number.MAX_SAFE_INTEGER (9007199254740991); beyond this, integer representation is imprecise and equality tests may fail.
- Use BigInt for exact integers beyond safe integer range and check with typeof value === 'bigint'.
- Avoid using Number.isInteger to accept numeric-like strings; explicitly validate type or parse then validate.
- When accepting user input, parse and then validate: const n = Number(input); if (!Number.isFinite(n) || !Number.isInteger(n)) reject.

10. Digest and retrieval metadata
- Source references: MDN Number.isInteger page, ECMAScript specification (ES6)
- Retrieval date: 2026-03-07
- Attribution: content synthesized from MDN and ECMAScript specification, adapted for actionable implementation guidance.
- Crawl size: approximately 3 KB of distilled technical content.

