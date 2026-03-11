# NORMALIZATION_OPTION

# Summary

Add an explicit optional normalization option to hammingDistance and extend the CLI to allow callers to request NFC or NFD normalization before comparison. The normalization option is opt-in so existing raw code-point behaviour remains the default.

# Motivation

Unicode text can represent the same visible character with different sequences (precomposed vs combining). Providing an explicit normalization option lets callers compare canonical text forms when desired while still allowing raw code-point comparisons for low-level use-cases.

# Specification

1. API
   - Extend hammingDistance to accept an optional third parameter options where options may be omitted or an object.
   - options.normalize may be false, "NFC", or "NFD". Default is false.

2. Validation
   - If options is provided and is not an object (including null), throw TypeError mentioning "options".
   - If options.normalize is provided and is not one of false, "NFC", or "NFD", throw TypeError mentioning "normalize".
   - After optional normalization, if the code-point sequences differ in length throw RangeError mentioning "length" or "equal".

3. Behaviour
   - When options.normalize is "NFC" or "NFD", call String.prototype.normalize(form) on both inputs before converting to code-point arrays via Array.from.
   - When options.normalize is false or omitted, compare raw code points using Array.from without normalizing.

4. CLI
   - Expose a --normalize flag with values NFC, NFD, or false when running in string mode; pass the value through to hammingDistance options.normalize.

5. Tests and docs
   - Add unit tests that demonstrate that combining sequences and precomposed characters compare unequal by default but compare equal when options.normalize is "NFC".
   - Update README.md with examples showing both raw and normalized comparisons.

# Acceptance Criteria

- hammingDistance("a\u0301", "á") without options returns a non-zero distance
- hammingDistance("a\u0301", "á", { normalize: "NFC" }) returns 0
- options validation throws TypeError for invalid options and invalid normalize values
- CLI --normalize NFC produces the same behaviour as passing options.normalize = "NFC" to the API
