WIKIPEDIA_FIZZBUZZ

Table of contents
1. Normalised extract
  1.1 Canonical algorithm and deterministic mapping
  1.2 Pseudocode (call signature and exact steps)
  1.3 Algorithmic complexity and resource bounds
2. Supplementary details
  2.1 Variants, streaming and generator forms
  2.2 Input validation recommendations (domain checks and messages)
3. Reference details
  3.1 Function signature and contract
  3.2 Exact mapping rules and ordering priority
  3.3 Implementation patterns and examples (stepwise prose)
  3.4 Troubleshooting and deterministic test cases
4. Detailed digest (SOURCES.md extract)
5. Attribution and crawl data size

1. Normalised extract

1.1 Canonical algorithm and deterministic mapping
- For a positive integer input n, produce an ordered sequence (array) of length n where the element at index (i-1) corresponds exactly to integer i for i in [1, n].
- Mapping rules (apply in this exact priority order for each integer i):
  - If i modulo 15 equals 0 then output the exact string FizzBuzz
  - Else if i modulo 3 equals 0 then output the exact string Fizz
  - Else if i modulo 5 equals 0 then output the exact string Buzz
  - Else output the integer i as a native numeric value
- Invariant requirements for implementations to be interchangeable in tooling and tests:
  - Returned sequence length MUST equal n.
  - Element ordering MUST correspond to integers 1..n.
  - Non-Fizz/Buzz/FizzBuzz entries MUST be numeric typed values (not strings).

1.2 Pseudocode (call signature and exact steps)
- Call signature (declarative): fizzBuzz(n: number) -> Array<string | number>
- Stepwise pseudocode (no language-specific quoting):
  1. Validate n is finite, integer, and within allowed bounds (see Supplementary details).
  2. Allocate an output array of length n (or use a generator to yield values lazily).
  3. For i from 1 to n inclusive:
     a. If i % 15 == 0 then push 'FizzBuzz'
     b. Else if i % 3 == 0 then push 'Fizz'
     c. Else if i % 5 == 0 then push 'Buzz'
     d. Else push integer i (native numeric value)
  4. Return the output array (or complete the generator sequence)

1.3 Algorithmic complexity and resource bounds
- Time complexity: O(n) single pass over integers 1..n with constant-time arithmetic and branching per iteration.
- Space complexity: O(n) if producing an in-memory array; O(1) additional if using a streaming generator (output amortised as consumed).
- Performance notes: modulus and integer arithmetic dominate per-iteration cost; branching order 15,3,5 preserves correctness while minimizing checks for numbers divisible by both 3 and 5.

2. Supplementary details

2.1 Variants, streaming and generator forms
- Streaming/generator form: expose a generator function that yields one element per integer i; this reduces peak memory to O(1) but shifts consumer semantics to iteration rather than random access.
- Alternative priorities: implementations MUST NOT change the 15/3/5 priority; changing ordering breaks canonical test expectations.
- Localization: textual tokens (Fizz/Buzz/FizzBuzz) are canonical exact-match strings for test suites and must not be localised in library APIs intended for deterministic behaviour.

2.2 Input validation recommendations (domain checks and messages)
- Recommended checks (perform in order) and canonical error messages for use in test harnesses and contract enforcement:
  1. If n is not finite -> throw RangeError with message: "n must be finite"
  2. If n is not an integer -> throw RangeError with message: "n must be an integer"
  3. If n < 1 -> throw RangeError with message: "n must be >= 1"
  4. If n > MAX_N -> throw RangeError with message: "n must be <= " + MAX_N
- Prefer RangeError for numeric domain violations so callers can detect domain vs type errors reliably.

3. Reference details

3.1 Function signature and contract
- Explicit signature: fizzBuzz(n: number) -> Array<string | number>
- Contract bullet points:
  - Input: n must be a finite integer within 1..MAX_N inclusive.
  - Output: array length n; entries are exact string tokens 'Fizz', 'Buzz', 'FizzBuzz' or numeric values corresponding to i.

3.2 Exact mapping rules and ordering priority
- Apply checks in this evaluation sequence for each i (1..n):
  - if i % 15 === 0 => 'FizzBuzz'
  - else if i % 3 === 0 => 'Fizz'
  - else if i % 5 === 0 => 'Buzz'
  - else => i (number)

3.3 Implementation patterns and examples (stepwise prose)
- In-memory array builder:
  - Preallocate array of length n when possible, assign by index to avoid repeated push costs in some environments.
  - For i from 1 to n inclusive compute value and set array[i-1] = value.
- Generator/streaming builder:
  - Implement an iterator that yields the value per iteration; useful for very large n to avoid memory pressure.
- Vectorised/batch computation:
  - Compute multiples of 3 and 5 by stepping sequences (e.g., mark indices divisible by 3 and 5) when optimizing for fewer modulus operations, but preserve correctness and ordering.

3.4 Troubleshooting and deterministic test cases
- Verify exact tokens: assert output[14] === 'FizzBuzz' for n >= 15 (index 14 maps to i=15).
- Edge tests: n == 1 => [1]; n == 3 => [1,2,'Fizz']; n == 5 => [1,2,'Fizz',4,'Buzz'].
- Validation tests: pass Infinity, 3.14, 0, -1, and n > MAX_N to assert correct RangeError messages.

4. Detailed digest (SOURCES.md extract)
- Extracted line: - https://en.wikipedia.org/wiki/Fizz_buzz
- Retrieval date: 2026-03-08T20:11:21.226Z

5. Attribution and crawl data size
- Attribution: content derived from the Fizz Buzz entry on Wikipedia (URL above) as cited in SOURCES.md; adapted into a concise implementation-focused extract for the mission.
- Data size obtained during crawling (SOURCES.md lines processed): approximately 498 bytes

