STRING_NORMALIZE

Normalised extract

Table of contents:
1. Overview
2. Syntax & signature
3. Normalization forms
4. Parameters & errors
5. Behavior details and notes
6. When to normalize (use-cases)

Detailed information

Overview
String.prototype.normalize(form) produces a new JavaScript string whose Unicode normalization form matches one of the four standard Unicode normalization forms. Normalization resolves canonical and compatibility equivalence between different Unicode sequences (for example composed vs decomposed representations).

Syntax & signature
String.prototype.normalize([form]) -> string

Normalization forms
- NFC: Canonical Composition. Compose decomposed sequences into composed code points where defined.
- NFD: Canonical Decomposition. Decompose composed characters into base code points plus combining marks.
- NFKC: Compatibility Composition. Apply compatibility mappings (may change or remove compatibility-only semantics) then compose.
- NFKD: Compatibility Decomposition. Apply compatibility mappings then decompose.

Parameters & errors
- form (optional): string; allowed values: "NFC", "NFD", "NFKC", "NFKD". Default: "NFC".
- If form is provided and is not one of the four allowed values, the operation throws a RangeError.
- Return: new normalized string (original string unchanged).

Behavior details and notes
- Implementations follow the Unicode Normalization Algorithm as implemented by the engine’s Unicode version; results depend on the engine's Unicode version.
- Normalization changes code point sequences and may change string length measured in code points.
- Use normalization when comparing user-supplied text for equality, producing stable keys, or normalizing filenames/identifiers.
- Performance: normalization is linear in the input length but has non-trivial per-code-point work; avoid repeated normalization inside tight loops if unnecessary.

When to normalize (use-cases)
- Before equality comparisons: a.normalize() === b.normalize()
- Before indexing or storing user-entered text as map keys
- Before canonicalizing for display or sorting when Unicode canonical equivalence matters

Supplementary details
- Implementation notes: native support exists in modern Node and browsers; polyfills are large and expensive; prefer native normalize().
- Normalization interacts with collation (sorting): normalization removes representation differences but does not apply locale-specific collation rules; use Intl.Collator for locale-sensitive ordering.

Reference details (API specifications)
- Method signature: String.prototype.normalize([form: 'NFC' | 'NFD' | 'NFKC' | 'NFKD']) -> string
- Throws: RangeError for invalid form parameter.
- Side-effects: none; returns a new string.
- Example semantics: 'e\u0301'.normalize('NFC') -> '\u00E9' (composed); 'ê'.normalize('NFD') -> 'e' + U+0302 (decomposed).

Detailed digest
- Source: MDN Web Docs — String.prototype.normalize()
- URL: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/normalize
- Retrieved: 2026-03-15
- Data obtained during crawling: 171328 bytes (HTML fetch size)

Attribution
MDN Web Docs (Mozilla) — String.prototype.normalize()
