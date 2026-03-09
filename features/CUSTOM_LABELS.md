# CUSTOM_LABELS

## Summary

Add optional label customization to the FizzBuzz library so callers can override the words used for multiples of 3, 5, and both. Maintain full backward compatibility with existing functions and their behaviour when no options are provided.

## Motivation

The project's mission is to provide a minimal, fully tested JavaScript FizzBuzz library. Allowing clients to use custom labels increases reusability in internationalised examples, teaching contexts, and branded demos while keeping the core behaviour unchanged.

## Specification

- Extend the public API so that both fizzBuzz and fizzBuzzSingle accept an optional options object as a second argument.
- Options shape:
  - fizz: string (default "Fizz")
  - buzz: string (default "Buzz")
  - both: string (optional; if omitted, library should concatenate fizz+buzz)
- Behaviour:
  - If options are omitted or null, current behaviour is unchanged.
  - If fizz or buzz are provided they replace the default words.
  - If both is provided it should be used for numbers divisible by both 3 and 5; otherwise the library uses fizz + buzz concatenation.
  - Error handling rules from the mission remain unchanged: non-integer inputs throw TypeError, negative numbers throw RangeError, n = 0 returns [].

## API

- Named exports (no breaking changes):
  - fizzBuzz(n, options?) -> string[]
  - fizzBuzzSingle(n, options?) -> string

Options is an optional object as described above and must not change return types.

## Acceptance Criteria

1. Existing behaviour is preserved: fizzBuzz(15) returns the same 15-element array ending with "FizzBuzz" when no options are passed.
2. fizzBuzzSingle(3) returns "Fizz" with default options; passing {fizz: "Foo"} returns "Foo".
3. fizzBuzzSingle(5) returns "Buzz" with default options; passing {buzz: "Bar"} returns "Bar".
4. fizzBuzzSingle(15) returns "FizzBuzz" by default; passing {both: "Baz"} returns "Baz".
5. If both is omitted but fizz and buzz are provided, e.g., {fizz: "X", buzz: "Y"}, fizzBuzzSingle(15) returns "XY".
6. Edge cases: fizzBuzz(0) returns []; negative inputs still throw RangeError; non-integers throw TypeError.
7. Unit tests added to tests/unit/ that cover the default behaviour plus all combinations above.
8. README examples updated to show usage with the new options parameter and a small example for the web demo in src/web/.

## Tests

- Add unit tests mirroring existing test structure that assert both default and custom-label cases for fizzBuzz and fizzBuzzSingle.
- Ensure tests assert error handling unchanged.

## Implementation Notes

- Implement changes in src/lib/main.js only; keep the module's default exports unchanged and simply accept an optional options object.
- Prefer small, well-tested changes: implement options merging with defaults internally without changing function names or signatures for single-argument calls.
- Update README.md usage examples and add a short example in src/web/ to demonstrate custom labels (e.g., localized words).

## Documentation

- Update README.md to document the options parameter and show concise examples for default and custom labels.
- Ensure examples in docs or src/web/ reflect the new options use-case.

## Testable checklist (for PR)

- [ ] Add implementation to src/lib/main.js
- [ ] Add unit tests under tests/unit/ to cover acceptance criteria
- [ ] Update README.md usage examples
- [ ] Run npm test and confirm all tests pass

