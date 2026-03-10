# UNICODE_SAFE

## Summary

Add a focused feature to ensure all exported string utilities handle Unicode input correctly and consistently. The feature requires small, local changes to the library API and unit tests to guarantee correct handling of non-ASCII characters, composed characters, and common Unicode edge cases (e.g., emoji, diacritics, and combining marks).

## Motivation

The mission is a JavaScript library of string utility functions. Real-world strings often include Unicode characters; ensuring Unicode-safe behaviour increases robustness and broadens the library's usefulness. This feature reduces surprising behaviour when processing multilingual text and supports the acceptance criteria that functions handle Unicode gracefully.

## Specification

1. Behavioural goals
   - All functions accept null or undefined and return an empty string except functions where another return type is logically required; behaviour must be documented in README and unit tests.
   - Functions must operate on Unicode code points, not JavaScript code units, where character-level operations are needed (for example in truncate, titleCase, camelCase, kebabCase, wordWrap, and levenshteinDistance when counting characters).
   - Normalise input to Unicode Normalization Form C (NFC) at the library entry point to provide consistent handling of composed and decomposed characters.
   - slugify must preserve Unicode letters where reasonable (configurable), but default behaviour remains to produce ASCII-only slugs by transliteration or removal; document how non-ASCII is handled.

2. API changes and options
   - Export a utility function normalizeUnicode(str) that returns normalized NFC string and gracefully handles null/undefined.
   - Add an optional boolean parameter unicodeNormalize (default true) to library functions that do character-level processing; when set, input is normalised before processing.
   - Optionally expose slugify(str, { preserveUnicode: false }) to allow keeping unicode letters in slugs when true; default remains false for URL safety.

3. Tests
   - Unit tests for normalizeUnicode: input with decomposed characters returns composed form; null/undefined returns empty string.
   - Tests for truncate, titleCase, camelCase, kebabCase, wordWrap using strings that include emoji, surrogate pairs, combining marks, and multi-codepoint grapheme clusters; verify lengths and boundaries behave as expected.
   - levenshteinDistance tests include emoji and accented characters to ensure correct distance calculation at code point or grapheme cluster level as chosen by implementation.

4. Documentation
   - README updates: explain Unicode normalisation, describe new normalizeUnicode export, document unicodeNormalize and preserveUnicode options and example usage with non-ASCII input.

## Acceptance Criteria

- normalizeUnicode exists and returns NFC-normalised strings; normalizeUnicode(null) returns empty string.
- Truncate and other character-level functions operate safely on emoji and combining sequences without breaking surrogate pairs or splitting grapheme clusters; tests assert expected outputs for provided Unicode examples.
- slugify keeps default ASCII-only output but supports preserveUnicode option; slugify("Café Noël") by default returns "cafe-noel" and slugify("Café Noël", { preserveUnicode: true }) returns "café-noël".
- All new and updated unit tests pass.

## Files to change

- src/lib/main.js: add normalizeUnicode export, add normalization calls or optional flags in affected functions, and add optional slugify preserveUnicode option.
- tests/unit/main.test.js or tests/unit/<appropriate>.test.js: add Unicode-specific tests for each affected function.
- README.md: document behaviour and examples.
- examples/: add a short example demonstrating Unicode handling.

## Implementation notes

- Use String.prototype.normalize when available for NFC; fall back to identity if environment lacks support (Node >= 10 has it). Document this expectation in README.
- For grapheme-cluster-aware operations (if implemented), prefer simpler and conservative behaviour: avoid splitting surrogate pairs and combining mark sequences by using code point iteration where necessary (for many tasks this is sufficient). Avoid adding heavy dependencies; prefer small, well-justified code unless tests show a shortcoming that requires a tiny dependency and the change is approved.

## Test cases (illustrative)

- normalizeUnicode('e\u0000\u0000' ): ensure composed form; normalizeUnicode(null) -> ''
- truncate('👍👍👍', 2) -> '👍…' (do not split surrogate pairs)
- camelCase('ça-va') -> 'çaVa' (preserve accent in output)
- slugify('Café Noël') -> 'cafe-noel'
- slugify('Café Noël', { preserveUnicode: true }) -> 'café-noël'
- levenshteinDistance('👩‍👩‍👧', '👩‍👩‍👦') -> small integer reflecting cluster edits
