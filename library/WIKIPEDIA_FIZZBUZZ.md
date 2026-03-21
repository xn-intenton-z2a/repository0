NORMALISED EXTRACT

Table of contents:
- RULES
- ALGORITHM (step-by-step)
- VARIANTS AND COMMON IMPLEMENTATION PATTERNS
- COMPLEXITY
- EDGE CASES AND TEST EXPECTATIONS

RULES
For each integer i from 1 to n inclusive:
- If i is divisible by 3 and 5 (i % 15 === 0) the output is the string "FizzBuzz".
- Else if i is divisible by 3 (i % 3 === 0) the output is the string "Fizz".
- Else if i is divisible by 5 (i % 5 === 0) the output is the string "Buzz".
- Else the output is the decimal string representation of i.

ALGORITHM (step-by-step)
1. Validate n according to mission rules (n must be a non-negative integer; see validation patterns in MDN_ISINTEGER and MDN_RANGEERROR documents). If n == 0 return an empty array.
2. Iterate i = 1..n.
3. For each i evaluate divisibility by 3 and 5 as above and push the appropriate string into the result array.
4. Return the result array of length n.

VARIANTS AND COMMON IMPLEMENTATION PATTERNS
- Loop-based: for loop with modulo checks in order (15, 3, 5) or (3 then 5 then else) is common and yields O(n) time, O(n) space when returning array.
- Map-based: generate range 1..n then map each value to the FizzBuzz string; Array.from({length:n}, (_,i)=>compute(i+1)) is idiomatic in modern JS.
- Concise conditional: compute an accumulator string: s = (i%3?"":"Fizz") + (i%5?"":"Buzz"); return s.length? s : String(i).

COMPLEXITY
- Time complexity: O(n) — each integer 1..n is processed once.
- Space complexity: O(n) when returning the whole array; O(1) additional if streaming output.

EDGE CASES AND TEST EXPECTATIONS
- n = 0 -> []
- Non-integer n -> production code should validate and throw TypeError (see MDN_ISINTEGER)
- Negative n -> production code should throw RangeError (see MDN_RANGEERROR)
- Large n -> consider memory if returning full array

SUPPLEMENTARY DETAILS
- Use Number.isInteger to validate inputs to satisfy non-integer requirement.
- Prefer Array.from({length:n}, (_,i)=> f(i+1)) for concise implementations when n is known and small-to-moderate.

REFERENCE DETAILS (extracted)
- Definition: FizzBuzz replaces numbers divisible by 3 with "Fizz", divisible by 5 with "Buzz", and divisible by both with "FizzBuzz" for each integer starting at 1.
- Typical pseudocode: for i = 1 to n: if i % 15 == 0 print "FizzBuzz"; else if i % 3 == 0 print "Fizz"; else if i % 5 == 0 print "Buzz"; else print i.

DETAILED DIGEST
Source section: Wikipedia — Fizz_buzz (core description and canonical pseudocode for the problem) retrieved 2026-03-21.
Data size fetched during crawl: approximately 66.8 KB.
Source URL: https://en.wikipedia.org/wiki/Fizz_buzz

ATTRIBUTION
Content adapted from Wikipedia: Fizz_buzz (public domain / CC BY-SA as per page) — see original for history and variations. Retrieved 2026-03-21.
