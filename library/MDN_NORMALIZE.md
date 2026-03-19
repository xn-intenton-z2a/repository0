MDN_NORMALIZE

Table of Contents
- Syntax
- Parameters and accepted forms
- Behaviour and canonicalization rules
- When to use for string comparison
- Supplementary details
- Reference details
- Detailed digest (retrieved: 2026-03-19)
- Attribution and data size

Normalised extract
Syntax
String.prototype.normalize([form]) -> String

Parameters and accepted forms
form: optional string, one of "NFC", "NFD", "NFKC", "NFKD". If omitted, default is "NFC".

Behaviour and canonicalization rules
- "NFD" performs canonical decomposition: characters are decomposed into base characters plus combining marks.
- "NFC" performs canonical decomposition followed by canonical composition: decomposed sequences that have a canonical composite are recomposed.
- "NFKD" and "NFKC" additionally perform compatibility decomposition before (NFKD) or before-and-after composition (NFKC), which can change compatibility characters (for example, superscripts, ligatures) into their compatibility equivalents.
- The operation returns a new JS string where code points are rearranged/combined according to Unicode Normalization Forms.
- Normalization affects the sequence of Unicode code points; it does not change how strings are encoded in UTF-16 in JS, but it produces a canonical code point sequence for stable comparisons.

When to use for string comparison
- For comparing user-visible text where differently encoded but canonically-equivalent sequences should be treated as equal, call normalize on both operands with the same form (commonly "NFC") before comparing code points.
- Normalization is recommended before iterating over code points for Hamming-distance calculations when the source text may contain composed/decomposed variants.

Supplementary details
- Normalization is deterministic for a given Unicode version; different runtimes may implement different Unicode versions, so results can differ across environments if Unicode versions differ.
- Performance: normalization traverses the string and performs decomposition/composition; cost is O(n) in the number of code points plus additional cost for decomposition mapping.
- Use when logical equivalence of characters is required; avoid normalizing for low-level binary operations unless canonical equivalence is desired.

Reference details
- Method signature: String.prototype.normalize([form]) -> String
- Accepted values: "NFC", "NFD", "NFKC", "NFKD" (case-sensitive)
- Default form: "NFC"
- Throws: TypeError only if called on non-string "this" in strict internal usage; in practice call as str.normalize().

Detailed digest
Source: MDN "String.prototype.normalize()"
Retrieved: 2026-03-19
Data obtained: HTML snapshot from MDN (see SOURCES.md)

Attribution
Original source: MDN Web Docs — String.prototype.normalize

