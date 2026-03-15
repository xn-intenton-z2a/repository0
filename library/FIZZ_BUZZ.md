FIZZ_BUZZ

Table of contents
- Problem statement
- Correct algorithm (imperative)
- Correct algorithm (functional using Array.map)
- Input validation rules
- Edge cases and error handling
- Performance and complexity

Problem statement
For each integer i in the sequence 1..N produce one output per i: "Fizz" if i divisible by 3, "Buzz" if i divisible by 5, "FizzBuzz" if divisible by both 3 and 5, otherwise the integer i. The output can be returned as an array of strings, printed to stdout, or emitted via a callback.

Correct algorithm (imperative)
1. Validate N is an integer >= 1. If not integer throw TypeError or RangeError as appropriate. 2. Allocate result array of length N. 3. For i from 1 to N: compute r3 = (i % 3) and r5 = (i % 5). If r3 === 0 and r5 === 0 push "FizzBuzz"; else if r3 === 0 push "Fizz"; else if r5 === 0 push "Buzz"; else push String(i).

Correct algorithm (functional using Array.map)
1. Create an array of length N: Array.from({length: N}, (_, k) => k + 1). 2. Use .map((i) => { let out = ((i % 3) === 0 ? 'Fizz' : '') + ((i % 5) === 0 ? 'Buzz' : ''); return out || String(i); }). This preserves iteration order and returns a new array.

Input validation rules
- Accept only numbers where Number.isInteger(value) returns true.
- If value is not a number type, throw TypeError with message indicating expected integer.
- If integer < 1 throw RangeError("N must be >= 1").

Edge cases and error handling
- N = 0 -> return [] or throw RangeError depending on API contract (recommend throw RangeError).  - Negative N -> throw RangeError.  - Non-integer numeric N -> throw TypeError.  - Very large N -> consider memory limits; prefer streaming generator to produce outputs without building the whole array.

Performance and complexity
- Time complexity O(N) with single pass. - Space complexity O(N) if returning an array; O(1) extra if streaming. - Use arithmetic remainder operator (%) which in JS computes remainder as a - trunc(a/b)*b; for integers standard % 3 and % 5 checks apply.

Supplementary details
- Use Number.isInteger to test integer inputs. - Use strict equality checks r === 0 after remainder. - When implementing in typed contexts, accept only integer-typed parameters.

Reference details
- Algorithmic signature suggestions:
  - function fizzBuzzArray(N: number): string[]  // throws TypeError/RangeError
  - function* fizzBuzzGenerator(N: number): Generator<string>  // yields values lazily
- Remainder semantics: For integer operands a and b in JavaScript, a % b === 0 is reliable for divisibility checks when b non-zero.

Detailed digest
Sources processed: https://en.wikipedia.org/wiki/Fizz_buzz  (retrieved 2026-03-15). Use the standard definition: replace multiples of three with "Fizz", multiples of five with "Buzz", multiples of both with "FizzBuzz"; common kata for loop and mapping implementations.

Attribution and crawl data
- Source: Wikipedia — Fizz buzz. Retrieved: 2026-03-15. Raw HTML size: 68116 bytes.
