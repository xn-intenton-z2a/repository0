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
String.prototype[Symbol.iterator]() returns an iterable iterator object that yields Unicode code points as strings. Each iteration result is an object matching the iterator protocol: { value: string, done: boolean }.

1.2 Iteration unit: code points vs grapheme clusters
- Iteration yields code points as strings; surrogate pairs are preserved and yielded as a single string element representing the full code point (length 2 in UTF-16), but grapheme clusters (sequences joined by ZWJ or combining marks) are split into multiple yielded elements.
- Example behaviours to account for in implementations: skin-tone modifiers (separate code points), sequences joined by ZWJ produce multiple yields, combining marks yield separate yields after base character.

1.3 Iterator protocol shape
- The iterator object exposes a next() method: next() -> { value: string, done: boolean }.
- The string[Symbol.iterator]() has no parameters and returns a fresh iterator on each call.

2. SUPPLEMENTARY DETAILS

2.1 Examples of splitting (implementation consequences)
- Spread or Array.from on a string produces an array of code-point strings (usable for code-point-aware Hamming distance).
- For user-perceived character processing, use Intl.Segmenter or a grapheme segmentation library to create grapheme-cluster arrays before comparing.

2.2 Implementation notes for consumers
- To compute code-point Hamming distance, do: ra = Array.from(a); rb = Array.from(b); if (ra.length !== rb.length) throw length-mismatch; then count differing entries.
- Do not assume String.length equals number of visual characters; String.length counts UTF-16 code units.

3. REFERENCE DETAILS (spec links, iterator object shape)

ECMAScript reference: String.prototype[Symbol.iterator] — returns an iterator per the iterable/iterator protocol in ECMAScript.
Iterator contract:
- next(): { value: string, done: boolean }
- The iterator yields elements of type string representing single Unicode code points (possibly 1 or 2 UTF-16 code units).

4. DETAILED DIGEST AND PROVENANCE
Source: MDN Web Docs — String.prototype[@@iterator]
URL: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/%40%40iterator
Retrieved: 2026-03-11
Extracted: syntax, return value, description emphasising code-point iteration and examples that demonstrate splitting behaviour on emoji sequences and ZWJ.

5. ATTRIBUTION AND CRAWL DATA
Source: MDN Web Docs, last modified Jul 10, 2025. Crawl retrieved ~3KB; content returned by fetch contained iterator examples and spec links.
