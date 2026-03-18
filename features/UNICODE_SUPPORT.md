# UNICODE_SUPPORT

Summary
Specify Unicode handling rules for string comparisons and expose an optional normalization parameter so callers can choose whether composed and decomposed sequences count as equal.

Specification
- Default behavior: hammingString compares sequences of Unicode code points without applying normalization.
- Optional normalization: hammingString accepts a third optional options object with an optional normalize property. Valid values are the strings NFC or NFD. When normalization is requested, both inputs must be normalized using String.prototype.normalize with the requested form before code point comparison.
- The normalization option allows callers to decide whether composed and decomposed forms are considered identical.

API contract (optionally supported)
- hammingString(a, b, options)
- options.normalize is 'NFC' | 'NFD' | undefined

Acceptance criteria
- By default, composed and decomposed forms may differ when compared without normalization
- When options.normalize is 'NFC', comparing a composed character and its decomposed sequence returns 0
- The function continues to throw TypeError for non-string inputs and RangeError for unequal code point length regardless of normalization

Notes
Normalization is optional but recommended when the caller needs canonical equivalence across user input sources.