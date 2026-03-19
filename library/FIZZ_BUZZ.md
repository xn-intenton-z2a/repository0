NORMALISED EXTRACT

Table of contents
1. Rules
2. API signatures
3. Edge cases and validation
4. Implementation patterns
5. Complexity
6. Tests and acceptance criteria

1. Rules
For each integer i in 1..n produce a string according to these exact rules:
- If i is divisible by both 3 and 5 produce the string 'FizzBuzz'
- Else if i is divisible by 3 produce the string 'Fizz'
- Else if i is divisible by 5 produce the string 'Buzz'
- Otherwise produce the decimal string representation of i (String(i))

Divisibility test: use the JavaScript remainder operator and exact equality to zero: i % k === 0. For combined check prefer i % 15 === 0 for minimal branches.

2. API signatures
fizzBuzz(n) -> Array<string>
- Parameter: n (integer, required, n >= 0)
- Returns: array of strings of length n where index 0 corresponds to 1
- Throws: TypeError if n is not an integer; RangeError if n < 0

fizzBuzzSingle(n) -> string
- Parameter: n (integer, required, n > 0)
- Returns: 'Fizz', 'Buzz', 'FizzBuzz' or the decimal string of n
- Throws: TypeError if n is not an integer; RangeError if n <= 0

3. Edge cases and validation
- n === 0: fizzBuzz(0) returns an empty array [] (no iteration)
- Negative n: throw new RangeError('n must be non-negative')
- Non-integer numeric values and non-number types: throw new TypeError('n must be an integer')
- Extremely large n: consider limiting to Number.MAX_SAFE_INTEGER for practical constraints (optional RangeError if exceeded)

4. Implementation patterns
- Imperative loop (preferred for clarity and minimal allocations):
  Validate inputs; allocate result array; for i from 1 to n: compute remainder checks and push strings; return array.
- Declarative map pattern:
  Use Array.from({ length: n }, (_, idx) => { const i = idx + 1; return i % 15 === 0 ? 'FizzBuzz' : i % 3 === 0 ? 'Fizz' : i % 5 === 0 ? 'Buzz' : String(i) })
- Single-value function: apply the same branch logic for a single integer.

5. Complexity
- Time: O(n) where n is the numeric parameter
- Space: O(n) for fizzBuzz; O(1) for fizzBuzzSingle

6. Tests and acceptance criteria (concrete assertions)
- fizzBuzz(15) returns an array of length 15 whose element at index 14 is 'FizzBuzz'
- fizzBuzzSingle(3) === 'Fizz'
- fizzBuzzSingle(5) === 'Buzz'
- fizzBuzzSingle(15) === 'FizzBuzz'
- fizzBuzzSingle(7) === '7'
- fizzBuzz(0) returns []
- expect(() => fizzBuzz(-1)).toThrow(RangeError)
- expect(() => fizzBuzz(1.5)).toThrow(TypeError)

SUPPLEMENTARY DETAILS

Validation and checks
- Use Number.isInteger(n) to validate integer-ness: it returns true only when Type(value) is Number and value is finite and has no fractional part.
- Use explicit RangeError for out-of-range numeric values; use TypeError for wrong-type or non-integer values.

Exact implementation pattern (plain text, no fenced code)
- Input checks: if (!Number.isInteger(n)) throw new TypeError('n must be an integer'); if (n < 0) throw new RangeError('n must be non-negative'); if (n === 0) return [];
- Loop: const out = []; for (let i = 1; i <= n; i++) { if (i % 15 === 0) out.push('FizzBuzz'); else if (i % 3 === 0) out.push('Fizz'); else if (i % 5 === 0) out.push('Buzz'); else out.push(String(i)); } return out;

REFERENCE DETAILS

Function signatures
- export function fizzBuzz(n)
  - n: integer >= 0
  - returns: Array<string>
  - throws: TypeError, RangeError
- export function fizzBuzzSingle(n)
  - n: integer > 0
  - returns: string
  - throws: TypeError, RangeError

Best practices and patterns
- Use i % 15 === 0 as the first branch to handle numbers divisible by both 3 and 5
- Use Number.isInteger to avoid accepting numeric strings or fractional numbers
- Keep error messages specific (e.g., 'n must be a non-negative integer')

Step-by-step troubleshooting
1. If tests fail for divisibility, verify operator precedence and that modulus is compared with strict equality to 0
2. If tests fail for non-integer inputs, ensure Number.isInteger is used rather than typeof checks for strings
3. If fizzBuzz(0) does not return [], ensure the code returns early for n === 0 before looping

DIGEST
Source: https://en.wikipedia.org/wiki/Fizz_buzz
Retrieved: 2026-03-19
Extract (technical): The FizzBuzz problem: for natural numbers replace multiples of 3 with Fizz, multiples of 5 with Buzz, multiples of both with FizzBuzz; used as a simple programming exercise and interview question that can be implemented with a single pass from 1 to n applying divisibility checks.

ATTRIBUTION
- URL: https://en.wikipedia.org/wiki/Fizz_buzz
- Retrieved: 2026-03-19
- Bytes downloaded: 68436
