# HAMMING_NORMALIZATION

Status: PROPOSED

Purpose
Clarify Unicode normalization behaviour for string comparisons and propose an optional normalization parameter for hammingDistanceString so callers can choose whether to compare raw code points or normalized forms.

Background
Unicode contains multiple equivalent ways to represent the same grapheme (for example, the single code point é versus the sequence e followed by combining acute). The library currently compares code points. Normalization may be desirable for some use cases.

Proposal
- Add an optional boolean parameter normalize to hammingDistanceString(a, b, options) or hammingDistanceString(a, b, { normalize: true }) with default false to preserve the current behaviour.
- When normalize is true, both inputs are normalised to NFC before comparing code points so visually equivalent strings composed differently compare as equal.

Behavior and validation
- Default behaviour: compare code points without normalisation (current behaviour preserved).
- When normalize is true: normalise both inputs to NFC using String.prototype.normalize and then compare code points; unequal code-point lengths after normalisation still raise RangeError.

Example expectations (testable)
- Comparing the composed character é (U+00E9) to the decomposed sequence e plus combining acute (e U+0301):
  - hammingDistanceString(composed, decomposed) with normalize false returns 1 (they are different code points).
  - hammingDistanceString(composed, decomposed, { normalize: true }) returns 0 (both normalise to the same code point sequence in NFC).

Acceptance Criteria
- A well-scoped test file tests unicode-normalization cases demonstrating the two behaviours described above.
- The public API documents the new optional parameter and its default value.
- Implementation preserves the current default behaviour unless callers explicitly opt in via normalize: true.

Notes
- This feature is optional but recommended for consumers who need canonical equivalence; keep the default conservative to avoid surprising existing callers.
