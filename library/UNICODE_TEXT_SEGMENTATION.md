UNICODE TEXT SEGMENTATION (UAX #29) — Grapheme cluster rules

Table of contents
- Purpose and scope
- Key Unicode property categories used
- Grapheme cluster boundary rules (GB1..GB11, GB12/13 summary)
- Implementation notes for code-point iteration vs grapheme clusters
- Examples and implications for Hamming-by-code-point
- Supplementary details and algorithms
- Reference API patterns
- Detailed digest (retrieved)
- Attribution and data size

Purpose and scope
This document extracts the Grapheme Cluster and text segmentation rules from Unicode Standard Annex #29 (UAX #29). For the Hamming mission the library uses code-point-aware comparisons; UAX #29 clarifies differences between code points and user-perceived grapheme clusters and provides the formal boundary rules for segmenting text.

Key Unicode property categories referenced
- CR, LF, Control: general control characters including carriage return and line feed
- Extend: combining marks and other extending code points that attach to a base
- ZWJ: zero width joiner
- SpacingMark: spacing combining marks
- Prepend: characters that precede a base (rare)
- Regional_Indicator (RI): used for emoji flag pairs
- Extended_Pictographic: emoji presentation characters often used with ZWJ sequences

Grapheme cluster boundary rules (condensed, canonical)
- GB1: sot ÷    (start of text is a boundary)
- GB2: ÷ eot    (end of text is a boundary)
- GB3: CR × LF  (no boundary between CR followed by LF)
- GB4: (CR | LF | Control) ÷  (break after control characters)
- GB5: ÷ (CR | LF | Control)  (break before control characters)
- GB6: L × (L | V | LV | LVT)  (Hangul syllable L class continuation)
- GB7: (LV | V) × (V | T)
- GB8: (LVT | T) × T
- GB9: × Extend  (do not break between base and trailing Extend)
- GB9a: × SpacingMark  (do not break between base and SpacingMark)
- GB9b: Prepend ×  (do not break between Prepend and base)
- GB11: 
  Extended_Pictographic Extend* ZWJ × Extended_Pictographic
  (do not break inside emoji ZWJ sequences that join pictographs)
- GB12 / GB13: Regional Indicator pairing rules
  - Treat sequences of Regional_Indicator in pairs so emoji flags composed of two RI form a single grapheme; break rules depend on parity of preceding RI count (pairing rule).

Notes on exact rule syntax
- The rules are ordered: earlier rules take precedence and are tested before later rules; evaluation yields ÷ (break) or × (no-break) between code points.
- Extend, ZWJ, SpacingMark, Prepend are character classes defined in Unicode data tables used by the segmentation algorithm.

Implementation notes for Hamming-by-code-point
- The mission requirement is to compare code points, not grapheme clusters. Therefore UAX #29 is informative rather than required: to obtain grapheme-aware comparisons a separate grapheme segmentation step (applying GB rules) would be required.
- For code-point iteration in JavaScript use String.prototype[@@iterator] or Array.from(string) to obtain a sequence of code points; those code points do not necessarily equal grapheme clusters (for emoji sequences or base+combining sequences).

Examples and implications
- "a" + combining acute accent (U+0301) yields two code points but often displays as a single grapheme; Hamming-by-code-point counts this as differing positions when compared at code-point granularity.
- Emoji ZWJ sequences (woman ZWJ heart ZWJ woman) form a single grapheme per GB11 but are multiple code points; Hamming-by-code-point will treat them positionally unless the library normalizes to grapheme clusters first.

Supplementary details and algorithms
- The segmentation algorithm is deterministic: scan adjacent code points and apply GB rules in order to decide boundaries. Implementations typically precompute property lookups (e.g., property tables mapping code points to Grapheme_Cluster_Break categories) and then evaluate pairwise rules.
- Regional Indicator pairing requires counting contiguous RI runs and applying parity tests to determine allowed breaks.

Reference API patterns
- splitByCodePoints(s: string): string[]  — returns array of code point strings using the String iterator
- splitByGraphemeClusters(s: string, propertyLookup): string[] — applies UAX #29 GB rules with property lookup table to return grapheme clusters (heavy-weight; uses property tables)

Detailed digest (source excerpt and retrieval)
- Source: Unicode Standard Annex #29: Unicode Text Segmentation (https://unicode.org/reports/tr29/)
- Retrieval date: 2026-03-18
- Data obtained: 155905 bytes
- Extracted content used: canonical list and ordering of Grapheme Cluster Boundary rules (GB1..GB13 summary), property categories (Extend, ZWJ, SpacingMark, Prepend, Regional_Indicator, Extended_Pictographic), and implementation guidance that rules are applied in sequence to determine where breaks occur. The document includes full normative rule text and algorithmic notes for implementers.

Attribution
- Unicode Consortium — UAX #29 (Unicode Text Segmentation), retrieved 2026-03-18; raw HTML 155905 bytes
