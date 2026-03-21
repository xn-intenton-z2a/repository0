WIKIPEDIA_FIZZBUZZ

Normalised extract (algorithmic rules):
- For each integer i from 1 up to n inclusive:
  - If i divisible by 3 and 5 (i % 15 === 0) produce "FizzBuzz"
  - Else if i divisible by 3 produce "Fizz"
  - Else if i divisible by 5 produce "Buzz"
  - Else produce the decimal string representation of i
- Complexity: O(n) time, O(n) output size
- Edge cases relevant to mission: n = 0 -> empty sequence; negative n -> invalid (use RangeError); non-integer n -> TypeError

Table of contents:
1. Algorithm
2. Implementation patterns
3. Edge cases and error handling
4. Complexity and resource usage
5. Integration notes for fizzBuzz / fizzBuzzSingle

Details:
1. Algorithm
   - Deterministic mapping from integers to strings using modulus tests with priorities: test both (15) first or test 3 and 5 in combination.

2. Implementation patterns
   - Loop approach: create empty array, loop i=1..n, push computed string.
   - Functional approach: Array.from({ length: n }, (_, i) => fizzBuzzSingle(i+1)). Note: Array.from avoids sparse-array pitfalls.
   - Single-value helper: fizzBuzzSingle(n) implements per-integer logic and returns string.

3. Edge cases and error handling
   - n === 0 => return []
   - If typeof n !== 'number' || !Number.isInteger(n) => throw TypeError('n must be an integer')
   - If n < 0 => throw RangeError('n must be non-negative')

4. Complexity and resource usage
   - Time O(n) because each integer is inspected once.
   - Memory O(n) for result array; streaming variants possible if only printing is needed.

5. Integration notes
   - Provide both fizzBuzz(n): string[] and fizzBuzzSingle(n): string APIs to allow reuse and testing.

Reference details (API signatures for this project):
- fizzBuzzSingle(n: number) -> string
  - Behavior: validate n as positive integer; return "Fizz" / "Buzz" / "FizzBuzz" / n.toString() per rules
- fizzBuzz(n: number) -> string[]
  - Behavior: validate n; if n === 0 return []; else return array with elements fizzBuzzSingle(1) .. fizzBuzzSingle(n)

Detailed digest:
- Source: Wikipedia "Fizz buzz" (en.wikipedia.org)
- Retrieval date: 2026-03-21
- Bytes fetched during crawl: 63473

Attribution:
- Wikipedia — https://en.wikipedia.org/wiki/Fizz_buzz
