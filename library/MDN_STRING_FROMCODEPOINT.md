MDN_STRING_FROMCODEPOINT

Normalised extract

Table of contents
- Signature and purpose
- Parameters and allowed values
- Return value and surrogate pair behavior
- Error conditions
- Usage patterns and performance notes

Signature and purpose
String.fromCodePoint(...codePoints) constructs and returns a JavaScript String from one or more Unicode code points. It accepts a variable list of numeric code point arguments and concatenates the corresponding characters into a single string.

Parameters and allowed values
Each argument is a numeric code point value in the inclusive range 0x000000..0x10FFFF (decimal 0..1114111). Each argument is converted to a numeric value per ECMAScript numeric conversion rules; after conversion each value must represent an integer code point in the allowed range.

Return value and surrogate pair behavior
The return value is a JavaScript String composed of the characters corresponding to each provided code point. For code points in the Basic Multilingual Plane (<= 0xFFFF) the method emits a single 16-bit code unit; for code points > 0xFFFF the method emits a UTF-16 surrogate pair (two 16-bit code units) representing that code point.

Error conditions
If any argument does not convert to a finite integer in the range 0..0x10FFFF, the operation raises a RangeError. Non-numeric values are converted to numbers first and then validated; NaN, Infinity or out-of-range numeric values cause RangeError.

Usage patterns and performance notes
- Use fromCodePoint when constructing strings that include supplementary-plane characters (emoji, historic scripts) to ensure correct surrogate-pair emission.
- To build a string from an array of code points, supply the array as spread arguments: fromCodePoint(...array). For very large arrays, avoid a single giant argument spread that can exceed engine call-argument limits; iterate and append or process in chunks.
- Avoid using fromCharCode for code points above 0xFFFF as it treats arguments as 16-bit code units rather than full Unicode code points.

Supplementary details
- Concept: fromCodePoint maps numeric Unicode scalar values to UTF-16 encoded JavaScript string data; it is the inverse of String.prototype.codePointAt for single code points.
- Range: Unicode scalar value space ends at 0x10FFFF; surrogate code units (0xD800–0xDFFF) are not valid as standalone code points.
- Engine behaviour: The method produces surrogate pairs using the standard UTF-16 surrogate-pair algorithm for code points above 0xFFFF.

Reference details
- Method signature: String.fromCodePoint(...codePoints) -> String
- Parameters: codePoints: zero or more numeric arguments; each must be integer 0..0x10FFFF (inclusive)
- Return: String composed of characters for the supplied code points
- Throws: RangeError when any argument is outside the allowed range or is not a finite integer after numeric conversion

Detailed digest
Source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/fromCodePoint
Retrieved: 2026-03-18
Data size fetched during crawl: approximately 162.9 KB

Attribution
Content extracted and condensed from MDN Web Docs: String.fromCodePoint. Original page provides specifications, compatibility notes and examples. MDN is licensed under terms on their site; this extract includes only technical API details and specifications obtained during crawl.