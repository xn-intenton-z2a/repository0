Title: MDN_CONTROL_FLOW

Table of contents:
- Control statements relevant to FizzBuzz
- Error handling and exception types
- Type checks and conversions (strict vs coercive)
- Digest and retrieval metadata
- Attribution and data size

Control statements relevant to FizzBuzz:
- if / else if / else: use to branch on divisibility checks. Evaluate divisibility in order: 15, 3, 5 to ensure correct precedence.
- for loop: standard for (let i = 1; i <= n; i++) is suitable to produce an array of length n.
- switch: not required; branching with if/else is more straightforward for small set of conditions.

Error handling and exception types:
- Throw TypeError when input types are incorrect (e.g., non-number or NaN), and RangeError for out-of-range numeric inputs (e.g., negative n).
- Use Number.isInteger() to enforce integer inputs and Number.isNaN to detect NaN.

Type checks and conversions (strict vs coercive):
- Prefer explicit type checks: if (typeof n !== 'number') throw new TypeError('n must be a number')
- For numeric string inputs, explicitly convert using Number(n) and validate the result; avoid implicit coercion.

Digest and retrieval metadata:
- Retrieved: 2026-03-21
- Source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Control_flow_and_error_handling
- Extract size (first chunk fetched): approx 6 KB

Attribution:
- Source: MDN Web Docs
- URL: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Control_flow_and_error_handling
- Retrieved on 2026-03-21
