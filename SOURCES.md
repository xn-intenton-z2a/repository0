# Sources

Reference material and documentation sources for this project.

Add URLs, papers, API docs, or other reference material here.
The maintain-library workflow will process these into `library/` documents.

- https://en.wikipedia.org/wiki/Fizz_buzz
  - Wikipedia article describing the FizzBuzz problem, common variants, and typical interview/teaching uses.

- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/export
  - MDN reference for ES module export syntax; explains named exports, default exports, and examples relevant for exporting fizzBuzz and fizzBuzzSingle from src/lib/main.js.

- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isInteger
  - MDN documentation for Number.isInteger, recommended for input validation to enforce integer inputs for fizzBuzz and fizzBuzzSingle.

- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError
  - MDN documentation for RangeError, used for throwing on negative inputs per mission requirements.

- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/from
  - MDN documentation for Array.from and alternatives for generating numeric ranges and mapping to fizz/buzz outputs.

- https://www.npmjs.com/package/fizzbuzz
  - npm package page for existing fizzbuzz implementations; useful for reference and edge-case behavior comparisons.

- https://vitest.dev/guide/
  - Vitest testing framework guide for writing unit tests, assertions, and running tests in this repository (package.json uses vitest).
