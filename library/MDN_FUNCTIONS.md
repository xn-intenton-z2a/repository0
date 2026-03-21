Table of contents
1. Function definitions and forms
2. Parameter handling and validation patterns
3. Best practices for small library exports
4. Digest and retrieval

1. Function definitions and forms
- Function declaration: function name(params) { }
- Function expression / arrow: const name = (params) => { }
- Exported named function (ESM): export function fizzBuzz(n) { }

2. Parameter handling and validation patterns
- Validate input at function start; fail fast with TypeError or RangeError as appropriate.
- Avoid implicit coercion; check Number.isInteger(n) and n >= 0.
- Return types should be stable: fizzBuzz returns array of strings; fizzBuzzSingle returns string.

3. Best practices for small library exports
- Use named exports to keep API explicit: export { fizzBuzz, fizzBuzzSingle }
- Keep pure functions (no side effects), deterministic outputs for given inputs.
- Document throw conditions (TypeError, RangeError) in README and JSDoc.

4. Digest and retrieval
Source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Functions
Retrieved: 2026-03-21
Size: MDN HTML retrieved (truncated) ~40KB
Attribution: MDN Web Docs
