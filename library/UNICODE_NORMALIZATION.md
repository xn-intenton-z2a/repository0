UNICODE_NORMALIZATION

Normalised extract

Table of contents
- Normalization forms and short definitions
- Decomposition and composition rules
- Canonical combining classes and composition algorithm
- Applicability in JavaScript and exact API usage
- Implementation caveats and comparison recommendations

Normalization forms and short definitions
- NFD: Canonical Decomposition. Replace each character with its canonical decomposed sequence.
- NFC: Canonical Decomposition followed by Canonical Composition. Decompose then recompose by canonical equivalence to preferred composed forms.
- NFKD: Compatibility Decomposition. Decompose with compatibility mappings (may lose presentation semantics).
- NFKC: Compatibility Decomposition followed by Canonical Composition. Use for normalization where compatibility-equivalent strings should be treated equal.

Decomposition and composition rules
Normalization relies on mapping tables: for each code point a canonical decomposition mapping may exist. Decomposition expands single code points into sequences of canonical equivalents; composition recombines sequences into composed forms when allowed by canonical composition rules.

Canonical combining classes and composition algorithm
The composition algorithm inspects decomposed sequences, uses canonical combining class values to reorder combining marks into a normalized order, and then applies canonical composition where compositions are not excluded. The composition process consults a composition-exclusion list and uses canonical combining class to prevent incorrect recomposition across certain boundaries.

Applicability in JavaScript and exact API usage
- JavaScript provides String.prototype.normalize([form]) where form is an optional string with values: 'NFC', 'NFD', 'NFKC', 'NFKD'. If omitted the method uses the default form; engines typically use 'NFC' as the default return form.
- For equality checks of strings that may differ only by canonical composition, perform normalization on both operands to the same form (commonly 'NFC') before strict comparison.

Implementation caveats and comparison recommendations
- Normalization changes string length in code points; do not assume any preserved index correspondence after normalizing.
- Compatibility decompositions (NFKC/NFKD) may alter presentation semantics; use them only when compatibility equivalence is desired (for example, when comparing identifiers or when folding compatibility distinctions is acceptable).
- For user-perceived character equality (grapheme clusters), normalization alone is insufficient; combine normalization with canonical grapheme cluster segmentation where required.

Reference details
- Standard: Unicode Standard Annex #15: Unicode Normalization Forms (UAX #15). See the full algorithm and decomposition/composition tables for implementation-level details.
- JS method: String.prototype.normalize([form]) -> String where form is one of 'NFC'|'NFD'|'NFKC'|'NFKD'.

Detailed digest
Source: https://unicode.org/reports/tr15/
Retrieved: 2026-03-18
Data size fetched during crawl: approximately 144.9 KB

Attribution
Content extracted and condensed from Unicode Consortium UAX #15: Unicode Normalization Forms. This extract contains the actionable normalization form definitions and exact API string values used by JavaScript's normalize method.