FIZZBUZZ_CORE

Table of contents
1. Normalised extract
  1.1 Core algorithm and deterministic contract
  1.2 Input validation and canonical error semantics (exact checks and messages)
  1.3 API signature and return types
2. Supplementary details
3. Reference details
4. Detailed digest (SOURCES.md extract and retrieval metadata)
5. Attribution and crawl data size

1. Normalised extract

1.1 Core algorithm and deterministic contract
- For each integer i in the inclusive integer sequence 1..n produce an element at result index (i-1).
- Mapping (apply in this exact priority order):
  - If i modulo 15 equals 0 then element is the exact string FizzBuzz
  - Else if i modulo 3 equals 0 then element is the exact string Fizz
  - Else if i modulo 5 equals 0 then element is the exact string Buzz
  - Else element is the integer i (a JavaScript Number value)
- Contract rules that MUST be satisfied by implementations:
  - Returned array length MUST equal n.
  - Element ordering MUST correspond to integers 1..n.
  - Elements representing non-Fizz/Buzz results MUST be Number typed values (not strings).

1.2 Input validation and canonical error semantics (exact checks and messages)
- Perform checks in this exact order and throw RangeError with the exact message shown when a check fails:
  1. If Number.isFinite(n) === false then throw new RangeError('n must be finite')
  2. If Number.isInteger(n) === false then throw new RangeError('n must be an integer')
  3. If n < 1 then throw new RangeError('n must be >= 1')
  4. If n > MAX_N then throw new RangeError('n must be <= ' + MAX_N)
- Use RangeError exclusively for numeric domain/type violations; do not use TypeError for these numeric range checks.

1.3 API signature and return types
- Primary programmatic export: fizzBuzz
- Signature (declarative): export function fizzBuzz(n: number): Array<string | number>
- Behavior: returns an Array whose length equals n; entries are either the exact strings Fizz, Buzz, FizzBuzz or JavaScript Number values for non-matching integers.

2. Supplementary details
- Constants and knobs:
  - MAX_N: recommended canonical upper bound is 10000000 (10 million). Implementations may expose this as a named constant.
- Complexity: time O(n), space O(n) for the returned array; streaming implementations may reduce peak memory by yielding values instead of returning an array.
- Module patterns: provide both ESM and CommonJS interoperability where consumer constraints require it; prefer ESM exports when package.json type: "module" is used.
- Testing: use vitest for unit tests; include tests asserting exact RangeError messages, array length, element types, and exact string values.

3. Reference details (precise specifications and implementation patterns)
- Exact validation logic (executable pattern):
  - if (!Number.isFinite(n)) throw new RangeError('n must be finite')
  - if (!Number.isInteger(n)) throw new RangeError('n must be an integer')
  - if (n < 1) throw new RangeError('n must be >= 1')
  - const MAX_N = 10000000; if (n > MAX_N) throw new RangeError('n must be <= ' + MAX_N)
- Function signature and parameters:
  - fizzBuzz(n)
    - n: number (JavaScript Number)
    - returns: Array<string | number>
- Implementation pattern (stepwise):
  1. Validate n using the exact checks above in the specified order.
  2. Allocate an Array of length n or push into an initially empty array while iterating i from 1 to n inclusive.
  3. For each i apply the mapping priority: check i % 15, i % 3, i % 5, else push number i.
  4. Return the completed array.
- Configuration and effects:
  - MAX_N value controls upper bound checking; raising MAX_N increases allowable input but may impact memory/time requirements.
- Best practices:
  - Keep error messages exactly as specified to allow deterministic test assertions and upstream consumers to parse errors.
  - Use Number.isFinite and Number.isInteger rather than manual typeof/Math checks to match ECMAScript semantics.
  - Ensure numbers returned are of Number type, not their string representation, except for the three exact strings.
- Troubleshooting steps:
  1. If tests fail asserting exact messages, verify the order of validation checks; messages must match exactly.
  2. If consumers see stringified numbers, inspect code path where non-matching values are converted to strings (avoid toString).
  3. If memory spikes for large n, consider implementing a streaming generator variant: function* fizzBuzzGen(n) that yields values.

4. Detailed digest (SOURCES.md extract and retrieval metadata)
- Retrieval date (UTC): 2026-03-08T19:10:45.568Z
- Extracted SOURCES.md section relevant to this document:
- https://en.wikipedia.org/wiki/Fizz_buzz
- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules
- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isInteger
- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError
- https://www.npmjs.com/package/fizzbuzz
- https://vitest.dev/guide/

5. Attribution and crawl data size
- Source attribution: SOURCES.md (project-maintained list of crawled references). See the URLs above for original sources.
- Data obtained during crawl: 591 bytes (raw SOURCES.md file size)
