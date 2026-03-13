# Custom Encoding Registry

## Overview

Provide an API for users to define their own encodings using custom character sets, enabling experimentation with domain-specific character choices.

## Custom Encoding API

Export this function for creating new encodings:

createEncoding(name, charset) - Register a new encoding with given name and character set

## Character Set Validation

Validate custom character sets:
- Must contain at least 2 unique characters
- No duplicate characters within the set
- All characters must be printable (no control characters)
- Recommend avoiding whitespace and common escape characters

## Registration System

- Store custom encodings in internal registry
- Prevent overwriting built-in encodings (base62, base85, base91)
- Allow overwriting previously registered custom encodings
- Case-sensitive encoding names

## Dynamic Integration

Custom encodings work with core API:
- encode(buffer, customEncodingName) uses the custom encoding
- decode(str, customEncodingName) decodes using custom encoding
- listEncodings() includes custom encodings in results

## Character Set Recommendations

Provide guidance for choosing good character sets:
- Avoid visually similar characters (0/O, 1/l/I) for human readability
- Consider target environment (URL-safe, JSON-safe, shell-safe)
- Larger character sets provide better density but may have compatibility issues
- Document character set choices for maintainability

## Bit Density Calculation

Calculate and report bit density for custom encodings:
- log2(charset.length) bits per character
- Include in listEncodings() output
- Help users understand efficiency trade-offs

## Error Handling

Robust validation and error reporting:
- Descriptive errors for invalid character sets
- Clear messages for duplicate character detection
- Prevent registration of problematic encodings

## Use Cases

Enable specialized encodings for:
- Domain-specific alphabets or symbols
- Maximum density using extended Unicode ranges
- Restricted character sets for specific systems
- Experimental encoding research

## Acceptance Criteria

- createEncoding function exported from main.js
- Custom encodings integrate seamlessly with encode/decode
- Character set validation prevents invalid encodings
- listEncodings() includes custom encodings with metadata
- Cannot overwrite built-in encodings
- Unit tests verify custom encoding functionality and validation