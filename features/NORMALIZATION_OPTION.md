# NORMALIZATION_OPTION

## Summary

Add an optional normalization mode to the hammingDistance API so callers may request Unicode canonicalization before computing Hamming distance. This opt-in feature preserves the original two-argument behaviour when not used and enables canonical equivalence comparison (for example NFC) when requested.

## Motivation

Unicode allows multiple code-point sequences to represent the same user-perceived character (for example a precomposed accented character versus a base character plus combining mark). The library currently compares raw code points; an explicit normalization option improves practical correctness for users who expect canonical equivalence while keeping the default behaviour unchanged for low-level use cases.

## Specification

1. API
   - Function signature: hammingDistance(a, b, options)
   - The third parameter options is optional. When provided it must be an object. Supported property:
     - normalize: one of false (default), "NFC", or "NFD"
   - Behaviour when options is omitted or options.normalize is false: exact current behaviour (compare code points without normalization).

2. Behaviour when normalization is requested
   - If options.normalize is "NFC" or "NFD", call String.prototype.normalize(form) on both a and b before performing code-point splitting and comparison.
   - After normalization, apply the same validations as before: both inputs must be strings and resulting code-point sequences must have equal lengths; otherwise throw the same error types (TypeError or RangeError).

3. Validation rules
   - If a or b is not a string, throw TypeError mentioning "string".
   - If options is provided but not an object, throw TypeError.
   - If options.normalize is provided and is not one of false, "NFC", or "NFD", throw TypeError.
   - If normalized code-point sequences differ in length, throw RangeError mentioning "length" or "equal".

4. Design constraints
   - Do not change existing two-argument behaviour or its error messages beyond adding normalization when requested.
   - Keep implementation small and dependency-free; use built-in String.prototype.normalize and Array.from for code-point iteration.

## Tests and documentation

- Add unit tests to tests/unit/main.test.js covering:
  - Comparing precomposed vs combining sequences without normalization (expect non-zero distance)
  - Same comparison with {normalize: "NFC"} (expect distance 0)
  - Passing a non-object as options throws TypeError
  - Passing an invalid normalization value throws TypeError
  - Existing two-argument behaviour still returns expected results for acceptance examples

- Update README.md: add a short API section showing the options parameter and two examples demonstrating the difference (precomposed vs combining sequences) and the acceptance examples.

## Acceptance Criteria

- hammingDistance("a\u0301", "á") without options returns a non-zero distance
- hammingDistance("a\u0301", "á", {normalize: "NFC"}) returns 0
- Passing a non-object as the third argument throws TypeError
- Passing invalid normalization value throws TypeError
- All existing acceptance tests for two-argument calls continue to pass unchanged

## Files to change

- src/lib/main.js: implement optional options argument and normalization behaviour as specified
- tests/unit/main.test.js: add tests exercising normalization and invalid options
- README.md: document the new optional parameter and show short examples

## Implementation notes

- Use String.prototype.normalize(form) and then Array.from(normalizedString) to create code-point arrays.
- Perform validation checks after normalization to ensure errors and messages remain consistent with existing rules.
- Keep the normalization code path small and guarded so the default fast path (no options) is unaffected.

