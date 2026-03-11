# JAVASCRIPT_STRINGS

## Table of Contents
- String Character Access Methods
- Unicode and Code Point Handling
- String Length and Indexing
- Performance Considerations
- Common Patterns and Edge Cases

## String Character Access Methods

JavaScript provides multiple ways to access characters in strings:

charAt(index):
- Returns character at specified index as string
- Returns empty string for out-of-bounds index
- Converts index to integer (undefined becomes 0)
- Always returns single UTF-16 code unit
- May return invalid surrogate characters for Unicode

Bracket notation [index]:
- Returns character at index or undefined for out-of-bounds
- Does not convert index to integer
- Direct property access on string object
- Same UTF-16 limitations as charAt

Both methods use zero-based indexing where first character is at index 0.

## Unicode and Code Point Handling

JavaScript strings use UTF-16 encoding where characters are stored as 16-bit code units. Higher Unicode code points (above 65535) require surrogate pairs.

codePointAt(index):
- Returns Unicode code point value at index
- Handles surrogate pairs correctly
- Returns only trailing surrogate code for trailing surrogate
- Returns undefined for out-of-range index
- Range: 0 to 1114111 (0x10FFFF)

For proper Unicode iteration:
- Use for...of loops which iterate by code points
- Use spread operator [...str] to get code point array
- Avoid index-based loops which may split surrogate pairs

## String Length and Indexing

String length property counts UTF-16 code units, not Unicode code points or visible characters.

Index boundaries:
- Valid range: 0 to str.length - 1
- Out-of-bounds behavior differs between access methods
- Last character index: str.length - 1
- Empty string length: 0

For Unicode-aware length calculation, iterate by code points rather than code units.

## Performance Considerations

Character access performance:
- charAt() and bracket notation have similar performance
- Sequential access is cache-friendly
- Random access patterns may cause cache misses
- String methods generally optimized for UTF-16 operations

Memory characteristics:
- Strings are immutable in JavaScript
- Character access creates no additional allocations
- Repeated access to same positions is efficient
- Large strings consume proportional memory

## Common Patterns and Edge Cases

Bounds checking patterns:
- Always validate index before access
- Handle negative indices appropriately
- Consider string.length for iteration bounds

Unicode considerations:
- Surrogate pairs require special handling
- charAt may return invalid Unicode sequences
- Use codePointAt for proper Unicode support
- Grapheme clusters may span multiple code points

Error handling:
- charAt returns empty string for invalid index
- Bracket notation returns undefined
- codePointAt returns undefined for out-of-range
- No exceptions thrown for normal out-of-bounds access

## Supplementary Details

String indexing in JavaScript follows zero-based conventions consistent with arrays and most programming languages. The distinction between code units and code points becomes critical when processing international text containing characters outside the Basic Multilingual Plane.

UTF-16 surrogate pairs represent code points from U+10000 to U+10FFFF using two 16-bit code units. The first (high surrogate) ranges from 0xD800-0xDBFF, the second (low surrogate) from 0xDC00-0xDFFF.

String iteration approaches:
- Index-based loops: fast but may split surrogates
- for...of loops: Unicode-aware but slightly slower
- Regular expressions: flexible but performance varies
- Manual surrogate detection: complex but complete control

## Reference Details

Method signatures and behavior:

String.prototype.charAt(index):
- Parameter: index (Number, converted to integer)
- Return: String (single character or empty)
- Bounds: Returns "" for out-of-range
- Unicode: May return lone surrogates

String.prototype.codePointAt(index):
- Parameter: index (Number, converted to integer) 
- Return: Number (code point) or undefined
- Range: 0-1114111 for valid code points
- Unicode: Handles surrogate pairs correctly

Bracket notation str[index]:
- Parameter: index (any property key)
- Return: String character or undefined
- Type: Property access, not method call
- Conversion: No automatic index conversion

Index conversion rules:
- undefined becomes 0
- null becomes 0
- Boolean true becomes 1, false becomes 0
- Strings parsed as numbers when possible
- Objects converted via valueOf/toString

## Detailed Digest

Technical content extracted from MDN documentation on JavaScript string methods on 2026-03-11.

String character access in JavaScript involves understanding UTF-16 encoding, surrogate pairs, and the differences between code units and code points. The charAt method provides safe empty string returns for invalid indices while bracket notation follows property access semantics.

Unicode support requires careful consideration of surrogate pairs and code point boundaries. The codePointAt method enables proper Unicode handling for code points up to 1114111 (0x10FFFF) but requires understanding of when surrogate pairs may split across indices.

For proper Unicode iteration, use for...of loops or spread syntax which iterate by code points rather than code units. Performance characteristics favor sequential access patterns and consistent method usage.

The charAt method always returns single UTF-16 code units and may return invalid surrogate characters for Unicode. The codePointAt method handles surrogate pairs correctly and returns undefined for out-of-range indices. Both methods use zero-based indexing with different behavior for bounds checking.

## Attribution Information

Sources crawled:
- MDN String.prototype.charAt: Complete document
- MDN String.prototype.codePointAt: Complete document

Total data size: 12300+ characters
Retrieved: 2026-03-11T22:32:38Z