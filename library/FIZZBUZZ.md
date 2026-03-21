FIZZBUZZ

Table of contents
- Purpose
- API: fizzBuzzSingle(n)
- API: fizzBuzz(n)
- Input validation rules
- Behavior: sequence generation
- Edge cases and errors
- Implementation notes
- Supplementary details
- Reference details
- Detailed digest
- Attribution and data size

Purpose
Provide precise implementation and usage details for FizzBuzz functions to satisfy the mission: export named functions fizzBuzz and fizzBuzzSingle from src/lib/main.js with specified behavior and edge-case handling.

API: fizzBuzzSingle(n)
- Input: a single numeric value n
- Behavior:
  - If n is not a number, throw TypeError with message exactly "n must be a number"
  - If n is not an integer (Number.isInteger(n) === false), throw TypeError with message exactly "n must be an integer"
  - If n < 1, throw RangeError with message exactly "n must be a positive integer"
  - Return value:
    - If n divisible by 15, return "FizzBuzz"
    - Else if n divisible by 3, return "Fizz"
    - Else if n divisible by 5, return "Buzz"
    - Else return the decimal string representation of n (e.g., 7 => "7")

API: fizzBuzz(n)
- Input: numeric value n
- Behavior:
  - Same validation rules as fizzBuzzSingle for type, integer, and positive check
  - If n === 0, return an empty array []
  - Generate an array of length n where element at index i (0-based) is fizzBuzzSingle(i+1)
  - Return the array of strings

Input validation rules
- Use typeof n !== 'number' to detect non-number types
- Use Number.isInteger(n) to detect non-integers
- Treat zero specially: if n === 0 return [] (do not throw)
- For negative numbers or zero-like negatives, throw RangeError

Behavior: sequence generation
- Loop from i = 1 to n inclusive
- For each i compute:
  - if i % 15 === 0 => "FizzBuzz"
  - else if i % 3 === 0 => "Fizz"
  - else if i % 5 === 0 => "Buzz"
  - else => String(i)
- Assemble into array and return

Edge cases and errors
- n = 0 => []
- n < 0 => throw RangeError
- n is NaN => treat as non-number => TypeError
- n is Infinity or -Infinity => treat as non-integer => TypeError
- n is numeric string like "5" => TypeError

Implementation notes
- Export both functions as named exports in src/lib/main.js
- Keep functions pure and side-effect free
- Use simple for loop for predictable performance and clarity
- Avoid external dependencies

Supplementary details
- Time complexity: O(n)
- Space complexity: O(n) for the returned array
- Preferred Node version: >=24 (project engines specify >=24.0.0)

Reference details
- No external API signatures required beyond the two functions above. Provide exact throw types and messages as specified in the API sections.

Detailed digest
- Sources used: MDN Array reference (for array creation and methods), Wikipedia Fizz Buzz page (definition and examples), Node.js assert (for test assertions guidance)
- Retrieved: 2026-03-21
- Data size crawled: small (HTTP HEAD checks; full pages not fetched in detail)

Attribution and data size
- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array (fetched headers) - 2026-03-21
- https://en.wikipedia.org/wiki/Fizz_buzz (fetched headers) - 2026-03-21
- https://nodejs.org/api/assert.html (fetched headers) - 2026-03-21

