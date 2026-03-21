Title: JS_TYPES

Table of contents:
- Number checks and integer validation
- String conversion and output formatting
- Handling NaN and Infinity in input validation
- Digest and retrieval metadata
- Attribution and data size

Number checks and integer validation:
- Use Number.isInteger(value) to confirm an integer.
- Use Number.isFinite(value) to check finite numeric inputs; reject Infinity and -Infinity.
- To convert user input: const num = Number(value); if (!Number.isFinite(num) || !Number.isInteger(num)) throw appropriate error.

String conversion and output formatting:
- Convert non-Fizz/Buzz values using String(i) or i.toString() for deterministic decimal representation.

Handling NaN and Infinity in input validation:
- Test inputs with Number.isNaN and Number.isFinite; throw TypeError for NaN, RangeError for negative or non-positive ranges.

Digest and retrieval metadata:
- Retrieved: 2026-03-21
- Source: https://javascript.info/types
- Extract size (first chunk fetched): approx 80 KB (partial)

Attribution:
- Source: javascript.info
- URL: https://javascript.info/types
- Retrieved on 2026-03-21
