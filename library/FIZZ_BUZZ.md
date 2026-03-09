NORMALISED EXTRACT

Table of Contents:
1. Definition and Goal
2. Input constraints
3. Output rules
4. Implementation algorithm
5. Edge cases

1. Definition and Goal
FizzBuzz: For the sequence of integers starting at 1, output a token for each integer:
- If divisible by 3 and 5, output "FizzBuzz"
- If divisible only by 3, output "Fizz"
- If divisible only by 5, output "Buzz"
- Otherwise output the integer as a string

2. Input constraints
- Input: positive integers (n >= 1) as the sequence upper bound
- Implementation must accept integer N and produce N outputs corresponding to integers 1..N inclusive
- Typical runtime constraints: O(N) time, O(1) extra space per item (streamable)

3. Output rules
- Each integer i in 1..N maps to exactly one output token
- Mapping precedence: check divisibility by both 3 and 5 first (i % 15 == 0), then 3, then 5, then fallback to i.toString()
- Output format: plain string tokens, newline-separated or returned as list depending on API contract

4. Implementation algorithm
- Loop i from 1 to N
- If i % 15 == 0 append "FizzBuzz"
- Else if i % 3 == 0 append "Fizz"
- Else if i % 5 == 0 append "Buzz"
- Else append String(i)
- For streaming implementations: compute token per iteration and emit to caller
- For composable implementations: accept divisor->token mappings (e.g., [{divisor:3,token:'Fizz'},{divisor:5,token:'Buzz'}]) then compute combined token by concatenation and fallback to number

5. Edge cases
- N <= 0: throw RangeError or return empty sequence depending on API spec
- Non-integer N: coerce with Number.isInteger check and throw RangeError when false
- Large N: ensure integer arithmetic safe within language bounds; use 64-bit integers where needed

SUPPLEMENTARY DETAILS

Specifications and constraints to implement:
- Use integer divisibility checks; prefer single modulus per divisor where possible
- For combined divisibility detection avoid repeated modulus by checking modulus of LCM when only two divisors: LCM(3,5)=15
- Keep memory usage to O(1) when possible by emitting tokens immediately rather than accumulating a full list
- For configurable implementations accept an ordered list of (divisor, token) pairs and compute token by concatenation in input order

REFERENCE DETAILS

API pattern (suitable for JavaScript/Node.js):
- function fizzBuzzArray(n: number) => string[]
  - Parameters: n (Number, integer >= 1)
  - Returns: Array of strings length n where element at index i-1 corresponds to integer i
  - Errors: throws RangeError when Number.isInteger(n) is false or n < 1

- function fizzBuzzStream(n: number, emit: (token: string)=>void) => void
  - Parameters: n (Number), emit callback to receive each token
  - Returns: void
  - Errors: same as above

- function fizzBuzzConfig(n: number, rules: Array<{divisor:number,token:string}>) => string[]
  - Behavior: build token for each i by concatenating tokens for rules whose divisor divides i in the provided order; when token is empty fallback to i as string

Best practices:
- Validate input with Number.isInteger and explicit lower bound checks
- Prefer modulus on LCM for small fixed rule sets to short-circuit combined rules
- Write unit tests that assert outputs at sample points: 3->Fizz, 5->Buzz, 15->FizzBuzz, 1->"1"

TROUBLESHOOTING

- If outputs contain numbers instead of tokens for known multiples: check order of checks and LCM implementation
- If memory spikes on large N: switch to streaming emit or generator pattern

DETAILED DIGEST

Source: https://en.wikipedia.org/wiki/Fizz_buzz
Retrieved: 2026-03-09
Extracted technical content: definition of mapping rules for divisibility by 3 and 5, use of modulus, typical pedagogical constraints (sequence from 1..N), recommended checks for input validity
Data size obtained: ~3 KB
Attribution: Wikipedia article "Fizz Buzz" (public domain/CC as provided on site)
