# FIZZBUZZ_EXAMPLES

Summary

Provide canonical plain-text usage examples and a minimal interactive web demonstration that exercise the library API (fizzBuzz and fizzBuzzSingle) so consumers and behaviour tests can verify correct results for sample inputs such as 15. Preserve the existing demo guidance and include a small localisation extension so the demo and README can show custom Fizz/Buzz labels.

Specification

- Usage examples: add plain-text examples in README.md that illustrate calling fizzBuzz(15) and fizzBuzzSingle(3), fizzBuzzSingle(5), and fizzBuzzSingle(7), showing expected outputs. Examples must be simple function calls and their expected return values written so unit tests can assert against the same examples.

- Web demo: provide a single-page demo under src/web/ (index.html plus a small ES module script) that imports the named exports from src/lib/main.js using a relative path and renders:
  - an input for a positive integer n and a button to render fizzBuzz(n) as a comma-separated list in a results area;
  - an input or control to evaluate fizzBuzzSingle(k) for a single integer k and display the single-result string in a separate area;
  - controls to demonstrate localisation by entering custom words for Fizz and Buzz and re-rendering the sequence with those words applied;
  - clear, user-friendly messages for invalid input (non-integer, negative) reusing the library's thrown errors and messages.
  The demo must not duplicate fizz/fizzbuzz logic; it must call the exported functions and any new helper exports for localisation.

- Examples page path: after running npm run build:web the demo must be present in docs/ at a predictable path so behaviour tests can open it.

Testing guidance

- Unit tests (tests/unit/): add or update tests that import fizzBuzz and fizzBuzzSingle from src/lib/main.js and assert exact outputs for the documented examples including:
  - fizzBuzz(15) returns an array of 15 strings ending with FizzBuzz;
  - fizzBuzzSingle(3) returns Fizz; fizzBuzzSingle(5) returns Buzz; fizzBuzzSingle(15) returns FizzBuzz; fizzBuzzSingle(7) returns "7";
  - fizzBuzz(0) returns [];
  - input validation tests already specified in FIZZBUZZ_VALIDATION must be maintained.

- Behaviour tests (Playwright): ensure npm run build:web copies the demo into docs/; add or update a behaviour test that opens the built demo and verifies:
  - entering 15 into the demo input and triggering the render shows 15 entries and the final entry equals FizzBuzz;
  - evaluating fizzBuzzSingle(3) via the demo UI displays Fizz;
  - using the localisation controls to set Fizz label to a custom word and re-rendering shows the custom word in place of Fizz entries;
  - invalid input shows the documented error message to the user and the page does not crash.

Acceptance criteria

- README.md contains plain-text usage examples showing fizzBuzz(15) and fizzBuzzSingle calls with their expected outputs.
- The demo page is present under docs/ after npm run build:web at a stable path and imports the library from src/lib/main.js.
- Behaviour test(s) confirm the demo renders the 15-element sequence ending with FizzBuzz for n=15, that single evaluations like fizzBuzzSingle(3) display Fizz, and that localisation controls replace Fizz/Buzz strings when provided.
- Unit tests cover the examples and validation behaviour and pass.

Implementation notes

- Keep the demo minimal: a single HTML page and a short ES module script that imports the named exports and updates the DOM; prefer vanilla DOM APIs and no extra bundling.
- Reuse errors/messages from the library rather than inventing new strings so unit tests can assert on error message substrings documented in FIZZBUZZ_VALIDATION.
- The localisation demonstration should use additive, opt-in helpers exported from src/lib/main.js (for example named exports that accept custom fizz and buzz words) so the canonical API is unchanged.
- Update README.md with the plain-text examples and a short note explaining how to pass custom fizz and buzz words to the localisation helpers.

Compatibility and scope

- This feature stays within the repository: it updates README.md examples, src/web demo files that are already referenced by npm run build:web, and unit/behaviour tests as needed.
- Do not modify the canonical fizzBuzz and fizzBuzzSingle behaviour; localisation helpers must be additional named exports that reuse validation and core logic.

FIZZBUZZ_LOCALISATION

Summary

Add a small, opt-in localisation helper allowing callers to supply custom words to use instead of Fizz and Buzz. This enables demos and README examples to show localized outputs without changing the canonical library behaviour.

Specification

- New named exports in src/lib/main.js: fizzBuzzWithWords and fizzBuzzSingleWithWords.
- fizzBuzzWithWords(n, words): returns the fizzBuzz array for 1..n where replacements use words.fizz and words.buzz instead of the default strings. words is an object with optional properties fizz and buzz; missing properties fall back to the canonical words.
- fizzBuzzSingleWithWords(n, words): returns the single replacement string for n using the provided words object with the same fallback behaviour.
- Validation: both helpers must reuse the canonical validation rules for n (zero returns empty array or number string accordingly, negative integers throw RangeError, non-integers throw TypeError). If words is provided but is not an object, throw TypeError with a message containing the word words.
- Behaviour: only the displayed strings change; counts, positions and diagnostics remain identical to the canonical outputs except labels.

Examples

- fizzBuzzWithWords(5, { fizz: "Foo", buzz: "Bar" }) => ["1","2","Foo","4","Bar"]
- fizzBuzzSingleWithWords(3, { fizz: "Foo" }) => "Foo"

Edge cases and errors

- If words is null, undefined or omitted, helpers behave like the canonical functions.
- If words is present but not an object, throw TypeError with message containing the word words.
- If words supplies empty strings they are used as-is (allowing blank labels).

Testing guidance for localisation

- Unit tests should assert that fizzBuzzWithWords and fizzBuzzSingleWithWords return sequences matching fizzBuzz/fizzBuzzSingle except with replaced labels when words object is provided.
- Include tests where words is omitted, where only fizz or only buzz is provided, and where words is an invalid type (string, number, array) asserting TypeError with the substring words.

Acceptance criteria for localisation

- fizzBuzzWithWords(15, { fizz: "Foo", buzz: "Bar" }) returns the same positions for Foo, Bar and FooBar as Fizz, Buzz and FizzBuzz would occupy.
- fizzBuzzSingleWithWords(3, { fizz: "Foo" }) returns Foo.
- Passing words as a non-object throws TypeError and the message contains words.
- Existing canonical acceptance criteria remain true and unchanged.

Notes

- Implement localisation helpers as thin wrappers that call canonical helpers and map resulting strings to replacements where appropriate; do not reimplement the fizz/buzz logic separately. Demonstrate localisation in README and the web demo.

This expanded examples feature now covers demo, README examples and an optional localisation extension to make the library easier to demonstrate and test in multiple locales.