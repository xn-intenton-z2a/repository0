# FIZZ_OPTIONS

# Summary

Add an optional options object to the FizzBuzz API to support custom divisor-to-label mappings and an inclusive range mode. This feature augments the core library without breaking default behaviour: existing calls without options continue to behave exactly as in FIZZ_CORE.

# Motivation

Consumers sometimes need a configurable FizzBuzz: different divisors, labels, or ranges (for example, testing with divisors 2 and 7 or using labels other than Fizz/Buzz). Providing an options object increases library usefulness while keeping the core API stable.

# Scope

In-scope:
- Extend fizzBuzz and fizzBuzzSingle signatures to accept a second optional argument options.
- options.divisors: an ordered array of objects { divisor: number, label: string } to apply when a number is divisible by divisor; default is [{3, "Fizz"}, {5, "Buzz"}].
- options.range: optional object { start: number, end: number } allowing fizzBuzz to generate values from start..end inclusive instead of 1..n when provided; backward-compatible when absent.
- Input validation: divisors must be positive integers, labels strings; range start/end integers with start <= end.

Out-of-scope:
- Complex rule engines or pattern languages.
- Changing default throw behaviour for invalid types in the core feature.

# API Changes

- fizzBuzz(n, options?)
  - When options.range is present, n may be ignored or used for compatibility; prefer explicit range.
  - If range provided, fizzBuzz returns array representing start..end inclusive.
- fizzBuzzSingle(n, options?)
  - Uses options.divisors to compute label concatenation in the order listed when multiple divisors match.

Behavior specifics:
- When multiple divisors match a number, concatenate labels in the order of options.divisors to form the result. If no divisors match, return the decimal string.
- If options is omitted, behaviour is identical to FIZZ_CORE.

# Tests

New unit tests should cover:
- Custom divisors: divisors [{2, "Foo"}, {3, "Bar"}] produce expected outputs for sample ranges.
- Label concatenation order correctness.
- Range mode: fizzBuzz with range { start: 5, end: 10 } returns array corresponding to those numbers.
- Validation: invalid divisor types produce TypeError; invalid range produce RangeError; negative divisors or zero divisor should produce RangeError.
- Backwards compatibility: calling fizzBuzz(15) without options matches FIZZ_CORE behaviour.

# Documentation

Update README to document the options object, show examples of custom divisors and range usage, and highlight compatibility guarantee.

# Acceptance Criteria

- Default behaviour unchanged: calling without options yields same results as FIZZ_CORE acceptance criteria.
- New options.divisors are applied and produce deterministic concatenated labels in specified order.
- Range option returns the correct subrange of results.
- Validation errors thrown for invalid options as specified.
- Tests covering the above pass.