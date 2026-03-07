NORMALISED EXTRACT

TABLE OF CONTENTS
1. Rules
2. Input validation
3. Output formats
4. Implementation patterns (imperative, functional, generator)
5. Edge cases and behaviours
6. Testing checklist

1. Rules
- For each integer i in the sequence 1..N inclusive:
  - If i % 3 === 0 and i % 5 === 0 produce the string FizzBuzz
  - Else if i % 3 === 0 produce the string Fizz
  - Else if i % 5 === 0 produce the string Buzz
  - Else produce the decimal representation of i (as a string)
- Divisibility tests must use the JavaScript remainder operator (%) and strict equality to 0 (i % k === 0).

2. Input validation
- Accept a single integer N >= 1. Use Number.isInteger(N) to validate integer-ness.
- Reject non-number types without coercion. If argument is not a finite number, throw TypeError.
- If N is outside caller policy bounds (for example N < 1 or N > MAX_SEQ), throw RangeError with a descriptive message.
- For range functions allowing start and end: validate start and end are integers and start <= end; otherwise throw TypeError or RangeError accordingly.

3. Output formats
- Preferred canonical return type: Array<string> of length N (index 0 maps to value for 1).
- Alternative outputs: newline-delimited string for CLI use, or an iterator/generator yielding strings for streaming large N.
- For CLI printing, join array with '\n' and write to stdout.

4. Implementation patterns
- Minimal imperative implementation (pseudo-signature): function fizzBuzz(N: number): string[]
  - Validate N
  - Allocate result = new Array(N)
  - For i from 1 to N:
      div3 = (i % 3) === 0
      div5 = (i % 5) === 0
      if (div3 && div5) result[i-1] = 'FizzBuzz'
      else if (div3) result[i-1] = 'Fizz'
      else if (div5) result[i-1] = 'Buzz'
      else result[i-1] = String(i)
  - return result
- Functional mapping pattern: return Array.from({length:N}, (_,k)=> { i=k+1; compute same div checks; return string })
- Streaming/generator pattern: function* fizzBuzzGen(start=1, end=N) { for i=start..end yield same string }

5. Edge cases and behaviours
- Zero: treat 0 as divisible by any non-zero integer so fizzBuzz(0) if allowed should produce FizzBuzz for 0.
- Negative N: reject by RangeError unless explicitly supporting ranges that include negatives; if supporting ranges, apply same divisibility logic.
- Non-integer inputs: reject via TypeError; use Number.isInteger to avoid coercion.
- Very large N: use generator/streaming to avoid memory blowup; add a configurable MAX_SEQ and reject larger inputs with RangeError.
- Floating point numbers: always rejected; if callers pass floats intentionally, define clear rounding policy (prefer rejecting).

6. Testing checklist
- Unit tests: N=1, N=2, N=3 (expect Fizz), N=5 (expect Buzz), N=15 (expect FizzBuzz at 3,5,15 positions), random property tests for pattern correctness.
- Boundary tests: N=0, N=1, N=MAX_SEQ, N=MAX_SEQ+1 (should throw)
- Type tests: string input, null, undefined, NaN, Infinity -> expect TypeError or RangeError as per validation rules.
- Performance test: large N using generator vs array allocation.

SUPPLEMENTARY DETAILS

Technical specifications and implementation details
- Function signatures (canonical):
  - fizzBuzz(N: number): string[]
  - fizzBuzzRange(start: number, end: number): string[]
  - fizzBuzzGen(start: number, end: number): IterableIterator<string>
- Validation rules (exact checks):
  - if (typeof N !== 'number' || !Number.isFinite(N)) throw TypeError('N must be a finite number')
  - if (!Number.isInteger(N)) throw TypeError('N must be an integer')
  - if (N < 1) throw RangeError('N must be >= 1')
  - For range: if (start > end) throw RangeError('start must be <= end')
- Divisibility checks (exact expressions):
  - const div3 = (i % 3) === 0
  - const div5 = (i % 5) === 0
- Memory/time: O(N) time, O(N) memory for array variant; O(1) additional memory for generator variant.
- Concurrency: Functions are pure and reentrant; avoid shared mutable state in implementations intended for parallel use.

REFERENCE DETAILS

API and signatures with parameters and returns
- fizzBuzz(N: number): string[]
  - Parameters: N: integer >= 1
  - Returns: array of strings with length N; index k contains representation for value k+1
- fizzBuzzRange(start: number, end: number): string[]
  - Parameters: start: integer, end: integer, start <= end
  - Returns: array of strings for values start..end inclusive
- fizzBuzzGen(start: number, end: number): IterableIterator<string>
  - Parameters: start, end as above
  - Returns: generator yielding strings for each integer in sequence

Exact implementation pattern (reference)
- Use a single pass loop computing booleans div3 and div5 to avoid repeated modulo operations where performance matters.
- Avoid string concatenation in hot paths; reuse literals 'Fizz', 'Buzz', 'FizzBuzz' and String(i) only for the fallback.
- For modular arithmetic correctness across negatives use the JavaScript % operator semantics: i % k === 0 is valid for integer divisibility tests.

Troubleshooting steps
1. If tests fail for expected Fizz/Buzz positions, verify that modulo checks use strict equality to 0 and that loop indexing aligns (1..N versus 0..N-1).
2. If memory spikes on large N, switch to generator/fallback to streaming output.
3. If non-integer inputs slip through, ensure Number.isInteger is used rather than loose checks like n % 1 === 0 which fail for NaN/Infinity.

DIGEST
- Source list entry: https://en.wikipedia.org/wiki/Fizz_buzz
- Retrieval date: 2026-03-07
- Synthesis: canonical rules and implementation patterns for FizzBuzz extracted and condensed for direct use in JS/Node implementations.

ATTRIBUTION AND SIZE
- Sources: wikipedia Fizz Buzz (listed in SOURCES.md)
- Retrieval: 2026-03-07
- Crawl data size: 0 bytes fetched during this run; document synthesized from source list and local knowledge.