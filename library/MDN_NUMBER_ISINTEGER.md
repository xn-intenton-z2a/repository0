MDN_NUMBER_ISINTEGER

Table of contents
- Normalised extract
- Supplementary details
- Reference details (signature and behavior)
- Usage notes for validation in Hamming integer API
- Detailed digest (source snapshot)
- Attribution and crawl metadata

Normalised extract
- Number.isInteger(value) is a standard built-in function that returns true if and only if the supplied value is of the type Number and is an integer (no fractional component).
- It returns false for non-number types, including BigInt, and for special Number values NaN and Infinity.

Supplementary details
- Implementation semantics: returns true when typeof value === 'number' and isFinite(value) and Math.floor(value) === value.
- Useful for validating inputs that are expected to be JavaScript Numbers representing integers before converting to BigInt or performing integer-only operations.
- Do not use Number.isInteger on BigInt values; use typeof checks for 'bigint' instead.

Reference details (signature and behavior)
- Signature: Number.isInteger(value) -> boolean
  - Parameter: value: any
  - Returns: boolean — true for finite numbers without fractional parts, false otherwise
  - Examples of results: Number.isInteger(3) -> true; Number.isInteger(3.0) -> true; Number.isInteger(3.1) -> false; Number.isInteger(NaN) -> false; Number.isInteger(Infinity) -> false; Number.isInteger('3') -> false

Usage notes for validation in Hamming integer API
- To accept either Number or BigInt for hammingBits inputs:
  1. If typeof value === 'bigint', accept.
  2. Else if typeof value === 'number', require Number.isInteger(value) to be true before converting to BigInt.
  3. Else throw TypeError.
- To enforce non-negative integers, check value < 0n (for bigint) or value < 0 (for number) and throw RangeError.

Detailed digest (extracted from MDN Number.isInteger page)
- Snapshot date: 2026-03-18
- Key statements used: Number.isInteger returns true only for numbers without a fractional component and excludes NaN and Infinity; it does not coerce types.
- Retrieved HTML size: approx 155.2 KB

Attribution
- Source: MDN Web Docs — Number.isInteger() - JavaScript | MDN
- URL: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isInteger
- Retrieved: 2026-03-18
- Data size fetched: ~155.2 KB
