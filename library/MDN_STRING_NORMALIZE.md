MDN_STRING_NORMALIZE

Source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/normalize
Retrieved: 2026-03-18
Bytes fetched (approx): 171989

Table of contents:
1. API signature
2. Normalization forms and semantics
3. When and why to normalize
4. Implementation notes for Hamming-distance comparisons
5. Edge cases and pitfalls
6. Reference details
7. Detailed digest and attribution

1. API signature
- Method: String.prototype.normalize([form])
- Parameters:
  - form (optional): one of the strings 'NFC', 'NFD', 'NFKC', 'NFKD'. If omitted, the default normalization form is 'NFC'.
- Returns: a new String representing the normalized Unicode normal form.

2. Normalization forms and semantics
- NFC: Canonical Decomposition followed by Canonical Composition (composed form). Prefer when storing/displaying text.
- NFD: Canonical Decomposition (decomposed form). Useful when operating on combining marks explicitly.
- NFKC: Compatibility Decomposition followed by Canonical Composition. Applies compatibility mappings (may change semantics, e.g., superscripts, ligatures).
- NFKD: Compatibility Decomposition.

3. When and why to normalize
- Unicode canonical equivalence means multiple code point sequences can represent the same user-perceived characters (e.g., "é" as U+00E9 vs 'e' + U+0301).
- To ensure deterministic, code-point-level comparisons (such as Hamming distance over code points), normalize both input strings to the same form (commonly 'NFC') before segmentation into code points.

4. Implementation notes for Hamming-distance comparisons
- Always apply the same normalization to both inputs if canonical equivalence must be treated as equality.
- Recommended pattern: a = a.normalize('NFC'); b = b.normalize('NFC'); then segment using Array.from(a) and Array.from(b) for code-point-aware iteration.
- Normalization may change string length (in code points) and therefore affects Hamming distance preconditions; validate lengths after normalization.

5. Edge cases and pitfalls
- Normalizing very large strings has CPU cost; when not necessary (inputs already normalized by upstream systems), avoid redundant normalization.
- Compatibility forms (NFKC/NFKD) can change semantics and should be used only when appropriate (e.g., search normalization vs. exact user-visible data preservation).

6. Reference details
- Exact signature: String.prototype.normalize([form]) -> String
- Allowed form values: 'NFC', 'NFD', 'NFKC', 'NFKD'
- Default: 'NFC' when form is omitted or undefined.

7. Detailed digest and attribution
- Extracted from MDN String.prototype.normalize documentation, retrieved 2026-03-18. Data fetched ~171,989 bytes (HTML).
- URL: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/normalize
