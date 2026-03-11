STRING_ITERATOR

TABLE OF CONTENTS
1. Normalised Extract
  1.1 Purpose and return shape
  1.2 Iteration unit: code points vs grapheme clusters
  1.3 Iterator protocol shape
2. Supplementary Details
  2.1 Examples of splitting (emoji, ZWJ, combining marks)
  2.2 Implementation notes for consumers
3. Reference Details (spec links, iterator object shape)
4. Detailed Digest and Provenance
5. Attribution and Crawl Data

1. NORMALISED EXTRACT

1.1 Purpose and return shape
- String.prototype[Symbol.iterator]() returns an iterable iterator that yields Unicode code points as strings. Each next() call returns { value: string, done: boolean }.

1.2 Iteration unit: code points vs grapheme clusters
- The iterator yields code points: surrogate pairs are preserved and yielded as a single string (one element), but grapheme clusters (ZWJ sequences, combining marks) are split across multiple yields.

1.3 Iterator protocol shape
- Returns a fresh iterator with next(): { value: string, done: boolean } on each call; no parameters.

2. SUPPLEMENTARY DETAILS

2.1 Examples of splitting
- Spread/Array.from on "👉🏿" yields ['👉','🏿'] (emoji + skin-tone modifier).
- Spread/Array.from on "👨‍👦" yields ['👨','?','👦'] (ZWJ sequence parts) — note: exact intermediate ZWJ code unit represented as its own string element.

2.2 Implementation notes for consumers
- For code-point-aware Hamming distance: ra = Array.from(a); rb = Array.from(b); if ra.length !== rb.length throw length-mismatch; count unequal entries.
- For user-perceived characters use Intl.Segmenter or grapheme library to segment into grapheme clusters before comparing.

3. REFERENCE DETAILS

ECMAScript reference: String.prototype[Symbol.iterator] conforms to iterable/iterator protocol. Iterator contract: next() -> { value: string, done: boolean } and yields strings representing single Unicode code points.

4. DETAILED DIGEST AND PROVENANCE
Source: MDN Web Docs — String.prototype[@@iterator]
URL: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/%40%40iterator
Retrieved: 2026-03-11T21:26:25.652Z
Extracted: iterator semantics, examples showing surrogate-pair preservation and grapheme splitting.

5. ATTRIBUTION AND CRAWL DATA
Source: MDN Web Docs. Crawl returned full page content. Approximate retrieved content: ~3 KB.