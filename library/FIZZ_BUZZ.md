TABLE OF CONTENTS
1. Purpose
2. Behaviour rules
3. Algorithm (step-by-step)
4. Edge cases
5. Examples
6. Supplementary details
7. Reference details
8. Digest and retrieval

1. Purpose
Provide the exact rules and implementation details required to implement FizzBuzz functions: fizzBuzz(n) -> array, fizzBuzzSingle(n) -> string.

2. Behaviour rules
- For positive integer k:
  - if k % 3 === 0 and k % 5 === 0 -> "FizzBuzz"
  - else if k % 3 === 0 -> "Fizz"
  - else if k % 5 === 0 -> "Buzz"
  - else -> string form of k (decimal base 10, no padding)
- fizzBuzz(n): returns array of length n where index i (1-based) corresponds to fizzBuzzSingle(i)
- fizzBuzz(0): returns empty array []
- Input validation: see Supplementary details

3. Algorithm (step-by-step)
- Validate n per Input validation
- If n === 0 return []
- Allocate result array of length n
- For i from 1 to n inclusive:
  - Determine f = ""
  - If i % 3 === 0 append "Fizz" to f
  - If i % 5 === 0 append "Buzz" to f
  - If f === "" push String(i) else push f
- Return result array

4. Edge cases
- n === 0 -> empty array
- n < 0 -> throw RangeError (see reference for constructor signature)
- n not integer -> throw TypeError (use Number.isInteger from JS standard)
- Non-number types -> TypeError

5. Examples
- fizzBuzzSingle(3) -> "Fizz"
- fizzBuzzSingle(5) -> "Buzz"
- fizzBuzzSingle(15) -> "FizzBuzz"
- fizzBuzzSingle(7) -> "7"
- fizzBuzz(15) -> ["1","2","Fizz","4","Buzz","Fizz","7","8","Fizz","Buzz","11","Fizz","13","14","FizzBuzz"]

6. Supplementary details
- Use Number.isInteger(n) to check integerness. If false, throw new TypeError("n must be an integer").
- For negative or zero checks: if n < 0 throw new RangeError("n must be non-negative"). Zero is allowed and should return [].
- Ensure functions are exported as named exports from src/lib/main.js: export function fizzBuzz(...) and export function fizzBuzzSingle(...)
- Keep functions pure and side-effect free; do not mutate inputs.

7. Reference details
- Number.isInteger(value): returns true if value is an integer, false otherwise.
- RangeError: throw new RangeError(message) to signal numeric range violations.
- String conversion: use String(i) to convert integer to string.
- Modulo behavior: use i % 3 === 0 and i % 5 === 0 checks; modulo on integers yields 0 for multiples.

8. Digest and retrieval
Source: https://en.wikipedia.org/wiki/Fizz_buzz
Retrieved: 2026-03-21
Attribution: Wikipedia: Fizz buzz
Data size: small (summary-level extraction)
