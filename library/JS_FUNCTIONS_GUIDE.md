TABLE OF CONTENTS
1. Purpose
2. Function signatures required
3. Implementation constraints
4. Export pattern
5. Examples and testing notes
6. Supplementary details
7. Digest and retrieval

1. Purpose
Provide exact function signatures and export patterns for implementing fizzBuzz functions in src/lib/main.js.

2. Function signatures required
- export function fizzBuzz(n)
  - Parameter: n (number)
  - Returns: Array<string>
- export function fizzBuzzSingle(n)
  - Parameter: n (number)
  - Returns: string

3. Implementation constraints
- Must validate inputs: TypeError for non-integers, RangeError for negative numbers
- Must be pure: no console output or mutation of external state
- Performance: for typical n up to a few thousand, straightforward loop is acceptable; avoid unnecessary allocations inside loop

4. Export pattern
- Use named exports in ES module file src/lib/main.js
  - Example: export function fizzBuzz(n) { ... }
  - Example: export function fizzBuzzSingle(n) { ... }

5. Examples and testing notes
- Unit tests should assert thrown errors for invalid inputs using vitest's toThrow
- Confirm fizzBuzz(0) returns [] and fizzBuzz(15)[14] === 'FizzBuzz'

6. Supplementary details
- Use String(i) for conversion
- Avoid Number.prototype extensions

7. Digest and retrieval
Source: MDN Functions guide and project mission
Retrieved: 2026-03-21
Attribution: MDN Web Docs
Data size: small (implementation guidance)
