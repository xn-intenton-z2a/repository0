NORMALISED EXTRACT
- Definition: The Fizz Buzz task enumerates integers from 1 to n and produces a string for each integer: if divisible by 3 output "Fizz", if divisible by 5 output "Buzz", if divisible by both output "FizzBuzz", otherwise the decimal representation of the integer.
- Input domain: Positive integers; conventions: n = 0 -> empty sequence; negative n considered invalid for this mission (RangeError required).
- Core check: divisibility by 3 and 5 using the remainder operator (a % b === 0).
- Output type: array of strings length n (when n > 0), element i corresponds to integer i.

TABLE OF CONTENTS
1. Rules and mapping
2. Algorithm (implementation-ready)
3. Edge cases and error handling
4. Complexity

1. Rules and mapping
- For i in 1..n: compute r3 = (i % 3 === 0), r5 = (i % 5 === 0).
- If r3 and r5: push "FizzBuzz".
- Else if r3: push "Fizz".
- Else if r5: push "Buzz".
- Else push String(i).

2. Algorithm (implementation-ready)
- Validate n (see Edge cases).
- Create results = new Array() or use Array.from({length: n}, (_,i) => ...).
- Loop i = 1 to n inclusive; use integer arithmetic and remainder checks.
- Append strings as per mapping.

3. Edge cases and error handling
- n === 0 -> return [] (empty array). Implementation must short-circuit before looping.
- n < 0 -> throw RangeError("n must be a non-negative integer").
- non-integer n -> throw TypeError("n must be an integer"). Use Number.isInteger(n) for the check.
- Non-number inputs -> throw TypeError.

4. Complexity
- Time: O(n) (single pass from 1..n).
- Space: O(n) (result array of length n).

SUPPLEMENTARY DETAILS
- Use strict equality for remainder checks (i % 3 === 0).
- Avoid converting numbers to strings for divisibility checks; convert only when producing a non-Fizz/Buzz element.
- Prefer Number.isInteger for integer checks to avoid accepting numeric strings.

REFERENCE DETAILS
- Divisibility test: expression: (i % 3 === 0) and (i % 5 === 0).
- Example mapping: 1 -> "1", 2 -> "2", 3 -> "Fizz", 4 -> "4", 5 -> "Buzz", 15 -> "FizzBuzz".

DETAILED DIGEST
Source: https://en.wikipedia.org/wiki/Fizz_buzz
Retrieved: 2026-03-21
Data size (bytes): 63472
Extracted technical lines: "The Fizz Buzz task is to print the numbers from 1 to n, but for multiples of three print 'Fizz' instead of the number and for the multiples of five print 'Buzz'. For numbers which are multiples of both three and five print 'FizzBuzz'."

ATTRIBUTION
Content derived from Wikipedia (Fuzz Buzz) page; retrieved 2026-03-21; data size: 63472 bytes.