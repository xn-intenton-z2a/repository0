# NORMALIZATION_OPTION

## Summary

Add an optional normalization mode to the string comparison function so callers may request Unicode canonicalization before computing Hamming distance. This is an opt-in extension that preserves the original two-argument behaviour and validation when the third parameter is omitted. The option enables users who want canonical equivalence (for example NFC) to compare visually equivalent strings consistently.

## Motivation

Unicode provides multiple representations for the same grapheme, for example a precomposed accented character and a base character plus combining accent. The core library intentionally compares raw code points, but many users expect canonical equivalence. Providing an optional normalization mode increases usability without breaking existing behaviour or tests.

## Specification

1. API extension
   - Extend hammingDistance to accept an optional third argument options which may be an object with a property normalize.
   - The options.normalize property may be one of: false (default), "NFC", or "NFD". When false or omitted, existing behaviour is unchanged.

2. Behaviour
   - When options.normalize is set to "NFC" or "NFD", apply String.prototype.normalize with the requested form to both input strings before splitting into code points and performing the Hamming comparison.
   - After normalization apply the same validation rules: throw RangeError if resulting code-point sequences differ in length, and TypeError if inputs are not strings.

3. Validation and backward compatibility
   - Preserve the existing two-argument function signature and behaviour when the third argument is not passed or options.normalize is false.
   - Validate that options is either undefined or an object; if it is provided but not an object, throw TypeError with a clear message.
   - Validate that normalize, if provided, is one of the allowed strings and throw TypeError otherwise.

4. Tests and documentation
   - Add unit tests that demonstrate behaviour with combining sequences versus precomposed characters and show how normalization changes results.
   - Update README to include an example that demonstrates the difference: comparing a precomposed accented character with a combining sequence without normalization differs, with normalization they match and distance is 0 when canonical equivalents are used.

## Acceptance Criteria

- hammingDistance("a\u0301", "á") without options returns a non-zero distance
- hammingDistance("a\u0301", "á", {normalize: "NFC"}) returns 0
- Passing a non-object as the third argument throws TypeError
- Passing invalid normalization value throws TypeError
- Existing two-argument calls continue to behave exactly as before

## Files to change

- src/lib/main.js: accept optional third argument options for hammingDistance and implement normalization when requested
- tests/unit/main.test.js: add tests covering normalization behaviour and argument validation
- README.md: document the new optional parameter and show examples

## Implementation notes

- Use String.prototype.normalize which is available in Node runtime targeted by this repository
- Normalization occurs before code-point splitting; do not perform additional canonical composition or decomposition beyond the normalize call
- Keep changes minimal: implement optional behaviour only when options.normalize is truthy and a valid string

