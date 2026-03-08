FIZZBUZZ

Table of contents
1. Normalised extract
  1.1 Canonical algorithm and mapping rules
  1.2 Function signature and return contract
  1.3 Input validation rules and exact RangeError messages
  1.4 Deterministic invariants and test assertions
2. Detailed implementation information
  2.1 In-memory array builder (preallocation and indexing)
  2.2 Streaming/generator builder (iterator semantics)
  2.3 Alternative optimization approaches (batching, marking)
  2.4 Numeric and performance considerations
3. Supplementary details (specs and implementation notes)
  3.1 Exact validation order and messages
  3.2 Recommended MAX_N handling and bounds checks
  3.3 Interop and packaging notes (CJS/ESM and exports)
4. Reference details (API signatures, parameter types, return types, exact messages)
5. Troubleshooting and deterministic test cases
6. Detailed digest (sources and retrieval date)
7. Attribution and crawl data size

1. Normalised extract

1.1 Canonical algorithm and mapping rules
- For input n (positive integer) produce an ordered sequence of length n where element at index (i-1) corresponds to integer i for i from 1 to n inclusive.
- For each integer i evaluate in this exact priority order:
  - If i modulo 15 equals 0 then value is the exact string FizzBuzz
  - Else if i modulo 3 equals 0 then value is the exact string Fizz
  - Else if i modulo 5 equals 0 then value is the exact string Buzz
  - Else value is the native numeric value i
- Invariants required for deterministic tooling and tests:
  - Returned sequence length must equal n.
  - Elements must be ordered for integers 1..n.
  - Non-Fizz/Buzz/FizzBuzz entries must be numeric typed values (not strings).

1.2 Function signature and return contract
- Signature: fizzBuzz(n: number) -> Array<string | number>
- Contract:
  - Input: n must be a finite integer within allowed bounds (see 3.2).
  - Output: an array length n with values exactly matching mapping rules; text tokens must be exact uppercase-starting tokens: Fizz, Buzz, FizzBuzz.

1.3 Input validation rules and exact RangeError messages
- Validation order to implement exactly (first matching failure throws):
  1) If typeof n !== 'number' -> throw TypeError with message: n must be a number
  2) If Number.isFinite(n) === false -> throw RangeError with message: n must be finite
  3) If Number.isInteger(n) === false -> throw RangeError with message: n must be an integer
  4) If n < 1 -> throw RangeError with message: n must be >= 1
  5) If n > MAX_N -> throw RangeError with message: n must be <= MAX_N
- Use these exact messages (replace MAX_N with your configured upper bound) so tests can assert equality on error.message.

1.4 Deterministic invariants and test assertions
- Deterministic checks to include in unit tests:
  - fizzBuzz(1) -> [1]
  - fizzBuzz(3) -> [1,2,Fizz]
  - fizzBuzz(5) -> [1,2,Fizz,4,Buzz]
  - fizzBuzz(15)[14] === FizzBuzz (index 14 maps to i=15)
  - For non-Fizz entries ensure type is number. Use typeof element === 'number'.

2. Detailed implementation information

2.1 In-memory array builder (preallocation and indexing)
- Preallocate an array of length n when n is known to reduce amortised allocation cost: create array of length n and assign by index: output[i-1] = value. This avoids per-iteration push overhead in some engines.
- Loop i from 1 to n inclusive and evaluate mapping rule per i. Assign exactly the mapped value into output at index i-1.
- Complexity: time O(n), space O(n).

2.2 Streaming/generator builder (iterator semantics)
- Provide an alternative generator function that yields values one at a time for very large n to reduce peak memory to O(1). Semantics: consumer iterates values in order; to test deterministic outputs, collect first k values and assert as in-memory tests.
- Generator contract: yields values matching same mapping rules and types as the array version.

2.3 Alternative optimization approaches (batching, marking)
- To reduce modulus operations at extreme scale, compute sequences of multiples: iterate i stepping by 1 but maintain counters or pre-mark arrays for multiples of 3 and 5; ensure mapping priority 15 is applied correctly by checking combined markers.
- Vectorized approaches must preserve ordering and token exactness.

2.4 Numeric and performance considerations
- Use integer arithmetic and modulo operation. Ensure using integer i values derived from loop counters to avoid fractional cases.
- Beware of non-finite or very large n (use validation above). When requiring exact integer arithmetic beyond Number precision, prefer BigInt APIs and adapt validation logic accordingly.

3. Supplementary details (specs and implementation notes)

3.1 Exact validation order and messages
- Implement validation in specified sequence to make error messages deterministic and suitable for unit assertion. Use Number.isFinite and Number.isInteger rather than global isFinite to avoid coerced behavior.

3.2 Recommended MAX_N handling and bounds checks
- Choose a MAX_N based on environment memory constraints; example patterns:
  - For typical Node environments default MAX_N to 10_000_000 only if streaming or chunked writing is used; otherwise choose a conservative default like 1_000_000.
  - When MAX_N exceeded, throw RangeError with message: n must be <= MAX_N
- Document chosen MAX_N in the API surface.

3.3 Interop and packaging notes (CJS/ESM and exports)
- Export shape recommendations:
  - For ESM package: export default function fizzBuzz(n) or export function fizzBuzz(n) and document named export. Include explicit file extensions in entry points for browser ESM consumption.
  - For dual-published packages, provide CJS entry via main and ESM via exports or module fields; consumers should detect runtime shape by checking module.default or named export presence.
- If publishing a CLI, map bin in package.json and prefer npx invocation for ephemeral runs.

4. Reference details (API signatures, parameter types, return types, exact messages)
- API signatures and exact types:
  - fizzBuzz(n: number) -> Array<string | number>
  - generator fizzBuzzGenerator(n: number) -> Iterator<string | number>
- Exact RangeError/TypeError messages to use verbatim:
  - TypeError: n must be a number
  - RangeError: n must be finite
  - RangeError: n must be an integer
  - RangeError: n must be >= 1
  - RangeError: n must be <= MAX_N
- Implementation pattern for exports (text only): provide both named export fizzBuzz and default export to maximize compatibility; if publishing CJS, ensure module.exports mapping mirrors ESM named exports or provide default property.

5. Troubleshooting and deterministic test cases
- Reproduceable test cases to include in CI:
  - Input edge cases: Infinity, NaN, 3.14, 0, -1, MAX_N+1 -> assert thrown RangeError with exact message.
  - Behavior tests: assert output length, content equality for sample n values, type checks for numeric entries.
- Debugging steps when unexpected values appear:
  1) Confirm input type using typeof and Number.isFinite.
  2) Inspect loop variable generation to ensure it is integer and starts at 1.
  3) Verify mapping priority 15 before 3 and 5.

6. Detailed digest (sources and retrieval date)
- Source lines processed from SOURCES.md:
  - https://en.wikipedia.org/wiki/Fizz_buzz  (Wikipedia Fizz Buzz entry)
  - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules  (MDN modules guide)
  - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isInteger  (MDN Number.isInteger)
  - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError  (MDN RangeError)
  - https://www.npmjs.com/package/fizzbuzz  (npm package metadata)
  - https://vitest.dev/guide/  (Vitest testing guide)
- Retrieval date: 2026-03-08T20:11:21.226Z

7. Attribution and crawl data size
- Attribution: condensed from Wikipedia Fizz Buzz, MDN Web Docs (Modules, Number.isInteger, RangeError), npm package page for fizzbuzz, and Vitest guide as listed in project SOURCES.md.
- Approximate extracted data sizes per source as noted during local extraction: Wikipedia ~0.5 KB, MDN Modules ~12 KB, MDN Number.isInteger ~2.5 KB, MDN RangeError metadata small, npm package line ~0.6 KB, Vitest ~13.2 KB. Total extracted approx 29 KB.

End of FIZZBUZZ
