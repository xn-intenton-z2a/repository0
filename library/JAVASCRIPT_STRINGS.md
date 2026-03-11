# JAVASCRIPT_STRINGS

## Table of Contents

1. String Character Access Methods
2. Unicode Code Point Handling  
3. UTF-16 Encoding and Surrogate Pairs
4. Code Unit vs Code Point Distinctions
5. String Iteration Best Practices

## Normalised Extract

### String Character Access Methods

JavaScript provides multiple methods for accessing character information from strings:

charAt(index): Returns the character at the specified index as a single-character string. If index is out of range, returns empty string.

charCodeAt(index): Returns an integer between 0 and 65535 representing the UTF-16 code unit value at the specified index. Returns NaN if index is out of range.

codePointAt(index): Returns a non-negative integer representing the Unicode code point value starting at the specified index. Returns undefined if index is out of range. Handles surrogate pairs correctly.

### Unicode Code Point Handling

Unicode code points range from 0 to 1114111 (0x10FFFF). JavaScript strings use UTF-16 encoding internally, where each string index corresponds to a 16-bit code unit with values 0-65535.

Higher code points (above 65535) are represented by surrogate pairs - two 16-bit pseudo-characters that together encode a single Unicode code point. The codePointAt() method correctly handles these surrogate pairs, while charCodeAt() only returns individual code units.

### UTF-16 Encoding and Surrogate Pairs

When a Unicode code point exceeds the 16-bit range, it is encoded as a surrogate pair:
- Leading surrogate: High 16-bit value (0xD800-0xDBFF range)  
- Trailing surrogate: Low 16-bit value (0xDC00-0xDFFF range)

If codePointAt() encounters a leading surrogate at the given index, it returns the full code point value of the surrogate pair. If it encounters a trailing surrogate, it returns only the trailing surrogate code unit value.

charCodeAt() may return lone surrogates which are not valid Unicode characters. To get the full Unicode code point at a given index, use codePointAt() instead of attempting to reconstruct from charCodeAt() values.

### Code Unit vs Code Point Distinctions

Code Unit: A 16-bit value in JavaScript's UTF-16 string representation. Each string index corresponds to one code unit.

Code Point: A Unicode character value that may span one or two code units. Basic Multilingual Plane characters (0-65535) use one code unit, while supplementary characters use two code units.

charCodeAt() always returns a single code unit value, potentially splitting surrogate pairs. codePointAt() returns the complete Unicode code point value, properly handling multi-unit encodings.

### String Iteration Best Practices

Avoid index-based iteration when working with Unicode text containing surrogate pairs, as this causes the same code point to be visited twice (once for leading surrogate, once for trailing surrogate).

Recommended iteration methods:
- for...of loops which iterate by code points
- Spread operator [...string] which creates an array of code points  
- String Symbol.iterator which iterates by code points

When using these methods, apply codePointAt(0) to get the numeric code point value of each element.

## Supplementary Details

JavaScript string indices work from left to right starting at 0. The last character index in a string is string.length - 1. String methods are intentionally generic and can be transferred to other object types for use as methods through call() or apply().

The ECMAScript specification defines precise behavior for string character access, including edge cases like invalid indices and surrogate pair handling. Methods like codePointAt provide forward compatibility with full Unicode support.

## Reference Details

### Method Signatures and Return Types

String.prototype.charAt(pos)
- Parameters: pos (number) - zero-based index, undefined converts to 0
- Returns: String - single character or empty string
- Range validation: Returns empty string for out-of-range indices

String.prototype.charCodeAt(pos)  
- Parameters: pos (number) - zero-based index, undefined converts to 0
- Returns: Number - integer 0-65535 or NaN for out-of-range
- Encoding: Returns UTF-16 code unit value

String.prototype.codePointAt(pos)
- Parameters: pos (number) - zero-based index, undefined converts to 0
- Returns: Number - non-negative integer 0-0x10FFFF or undefined
- Encoding: Returns full Unicode code point, handles surrogate pairs

### ECMAScript Specification Implementation

ECMAScript 2026 String.prototype.codePointAt performs these steps:
1. Let O be the this value
2. Perform ? RequireObjectCoercible(O)
3. Let S be ? ToString(O)
4. Let position be ? ToIntegerOrInfinity(pos)
5. Let size be the length of S
6. If position < 0 or position >= size, return undefined
7. Let cp be CodePointAt(S, position)
8. Return F(cp.[[CodePoint]])

Returns non-negative integral Number less than or equal to 0x10FFFF that is the numeric value of the UTF-16 encoded code point starting at index pos. If no valid UTF-16 surrogate pair begins at pos, returns the code unit at pos.

### String.prototype.charCodeAt Specification

ECMAScript 2026 String.prototype.charCodeAt performs these steps:
1. Let O be the this value
2. Perform ? RequireObjectCoercible(O)
3. Let S be ? ToString(O)  
4. Let position be ? ToIntegerOrInfinity(pos)
5. Let size be the length of S
6. If position < 0 or position >= size, return NaN
7. Return the Number value for the numeric value of the code unit at index position within String S

Returns integer between 0 and 65535 representing UTF-16 code unit value at specified index. Returns NaN if index is out of range.

### Surrogate Pair Conversion Algorithms

UTF-16 to Unicode conversion constants:
LEAD_OFFSET = 0xD800 - (0x10000 >> 10)
SURROGATE_OFFSET = 0x10000 - (0xD800 << 10) - 0xDC00

Conversion function logic:
utf16ToUnicode(lead, trail) = (lead << 10) + trail + SURROGATE_OFFSET
unicodeToUTF16(codePoint) = [LEAD_OFFSET + (codePoint >> 10), 0xDC00 + (codePoint & 0x3FF)]

### Safe Iteration Patterns

Index-based iteration (problematic with surrogate pairs):
for (let i = 0; i < str.length; i++) {
  // May split surrogate pairs
}

Code-point based iteration (recommended):
for (const codePoint of str) {
  let value = codePoint.codePointAt(0);
}

[...str].map(cp => cp.codePointAt(0));

### Browser Compatibility and Polyfills

String.prototype.codePointAt has universal browser support in modern JavaScript environments. For older environments, polyfills are available through core-js and es-shims packages.

Methods are intentionally generic and do not require this value to be a String object, allowing transfer to other object types.

## Detailed Digest

Technical documentation extracted from MDN JavaScript String reference and ECMAScript specification covering character access methods, Unicode handling, and UTF-16 encoding specifics. Retrieved 2026-03-11.

Content provides comprehensive guidance for string character manipulation in JavaScript, emphasizing proper Unicode support and surrogate pair handling for international text processing applications.

## Attribution Information

Sources: 
- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/codePointAt
- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/charCodeAt  
- https://tc39.es/ecma262/multipage/text-processing.html#sec-string.prototype.codepointat

Data size: 40000 characters extracted
Retrieved: 2026-03-11