STRING_NORMALIZE

Table of contents
- Purpose
- Syntax
- Parameters
- Return value
- Normalization forms and effects
- Behavior and edge cases
- Usage notes for comparisons
- Supplementary details
- Reference details (exact signatures)
- Retrieval
- Attribution and data size

Purpose
Document String.prototype.normalize to ensure proper canonical form handling when comparing Unicode strings for equality or computing Hamming distance by code points.

Syntax
str.normalize([form])

Parameters
form (optional): one of 'NFC', 'NFD', 'NFKC', 'NFKD'. Default: 'NFC'.

Return value
A new string that is the normalization of str according to the specified Unicode Normalization Form.

Normalization forms and effects
- NFC: Canonical Composition. Composes characters where possible (recommended for storage and display).
- NFD: Canonical Decomposition. Decomposes composed characters into base+combining marks.
- NFKC: Compatibility Composition. Like NFC but applies compatibility mappings (may change semantics for formatting marks, ligatures, width variants).
- NFKD: Compatibility Decomposition.

Behavior and edge cases
- If form is provided but not one of the four allowed values, a RangeError is thrown.
- If normalization is a no-op (string already in target form), returns a string that is typically the same sequence of code points but may be a different identity (new string object).
- Use normalize before comparing strings by code points to avoid differences arising from composed vs decomposed sequences.

Usage notes for Hamming distance
- For Hamming distance defined on Unicode code points, decide whether to normalize inputs first (NFC recommended) so canonically equivalent sequences compare equal.
- Normalization changes the sequence of code points; compute length after normalization before validating equal-length requirement.

Supplementary details
- Normalization uses Unicode normalization algorithm; engines implement via ICU or internal unicode tables.
- When comparing code-point sequences, iterate by code points (for...of) after normalization to ensure each code point is compared.

Reference details
- Signature: String.prototype.normalize([form]) -> string
- Throws: RangeError if form is invalid
- Default form: 'NFC'

Retrieval
Content retrieved from MDN String.prototype.normalize on 2026-03-20.

Attribution and data size
Source: MDN Web Docs — String.prototype.normalize (developer.mozilla.org). HTML crawled (approx 168 KB). Retrieved: 2026-03-20.
