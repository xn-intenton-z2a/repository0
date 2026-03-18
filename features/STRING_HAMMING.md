# STRING_HAMMING

Purpose
This feature specifies the string Hamming distance API and behaviour for Unicode-aware comparisons.

Specification
Provide a named export called computeStringHamming that accepts two strings and returns a non-negative integer equal to the number of code point positions that differ.

Behavior
- Both inputs must be JavaScript strings. If either is not a string, throw TypeError.
- Normalize both inputs using canonical composed form NFC.
- Convert each normalized string into an array of Unicode code points using Array.from or equivalent.
- If the two code point arrays have different lengths, throw RangeError.
- Iterate corresponding code points and count positions where the code points are not strictly equal.
- Return the count as a Number.

Acceptance criteria
- computeStringHamming applied to karolin and kathrin returns 3.
- computeStringHamming applied to empty and empty returns 0.
- Passing strings whose code point lengths differ results in a RangeError.
- Canonically equivalent sequences that normalize to the same code point sequence compare equal and yield distance 0.

Test cases
- karolin vs kathrin -> 3
- empty vs empty -> 0
- composed vs decomposed e acute -> 0
- unequal lengths -> RangeError

Implementation notes
- Use String.prototype.normalize with NFC and Array.from for code point iteration.
- Document behaviour clearly in README and unit tests.
- Grapheme cluster semantics are out of scope; comparisons operate on Unicode code points.
