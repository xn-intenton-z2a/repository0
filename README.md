# FizzBuzz Library Demo

This repository demonstrates a simple FizzBuzz library with unit tests and a web demo.

Library API (src/lib/main.js):

- fizzBuzz(n): returns array of strings from 1..n with Fizz/Buzz/FizzBuzz substitutions.
- fizzBuzzSingle(n): returns string for single integer.

Examples:

- fizzBuzz(5) -> ["1","2","Fizz","4","Buzz"]
- fizzBuzzSingle(15) -> "FizzBuzz"

CLI:

- node src/lib/main.js <number>

Website demo:

- Open src/web/index.html or run npm run start to serve docs/ and visit the demo.

Tests:

- npm test (unit tests)
- npm run test:behaviour (Playwright behaviour tests; requires Playwright setup)
