MDN_STRING_NORMALIZE

Table of contents
1. Purpose of normalization
2. Forms (NFC, NFD, NFKC, NFKD)
3. When to normalize for comparisons
4. API signature
5. Implementation guidance for Hamming-distance comparisons
6. Digest and attribution

Normalised extract
Purpose: String.prototype.normalize(form) returns the Unicode Normalization Form of the string. Normalization converts canonically equivalent sequences into a single canonical form so that visually identical characters with different code sequences compare equal.

Forms:
- NFC: Normalization Form C (composed) — combines characters to precomposed forms where possible.
- NFD: Normalization Form D (decomposed) — decomposes characters into base + combining marks.
- NFKC/NFKD: compatibility decomposed/composed forms that also apply compatibility mappings.

When to normalize for comparisons:
- If the application requires canonical equivalence (for example 'é' vs 'e' + combining acute), normalize both strings to the same form (commonly NFC) before comparing code points.
- Note: Normalization changes code point sequences; after normalize(), code-point length and indices may change — apply normalization before measuring lengths.

API signature
- String.prototype.normalize(form?: string) -> string
  - Parameter: form is one of 'NFC', 'NFD', 'NFKC', 'NFKD'; if omitted, default is 'NFC'.

Implementation guidance for Hamming-distance comparisons
- Before converting to code points, call a = a.normalize('NFC'); b = b.normalize('NFC'); then use Array.from(a) / Array.from(b) for code-point arrays and compare lengths and positions.

Digest (retrieved: 2026-03-18)
- Extracted: normalization forms, default NFC, and guidance to normalize before code-point comparison to ensure canonical equivalence.
- Source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/normalize
- Bytes retrieved: 166623
