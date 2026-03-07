# Custom Encoding Creation

Enable users to define their own encodings from custom character sets while maintaining the same encode/decode interface.

## Overview

This feature allows users to create custom encodings optimized for their specific use cases, character set constraints, or density requirements. Users can experiment with different character combinations to achieve optimal encoding density for their context.

## Core Function

The main.js module must export this function:

- createEncoding(name, charset) — Register a new encoding based on a character set string

## Custom Encoding Behavior

The createEncoding function must:
- Accept a unique name for the encoding
- Accept a charset string containing all characters to use for encoding
- Validate that the charset contains only printable characters
- Check for duplicate characters in the charset
- Calculate and store the theoretical bit density
- Register the encoding for use with encode() and decode() functions
- Return encoding metadata including bit density

## Character Set Validation

Custom character sets must be validated to ensure:
- All characters are printable (no control characters)
- No duplicate characters in the set
- Minimum practical size (at least 2 characters)
- Maximum reasonable size for performance
- Warning about problematic characters that may cause issues in specific contexts

## Integration with Core Functions

Once created, custom encodings must work seamlessly with:
- encode(buffer, customEncodingName) 
- decode(str, customEncodingName)
- listEncodings() — must include custom encodings in results

## Advanced Character Set Support

Support for exploring higher-density encodings using carefully selected printable Unicode characters beyond ASCII, while maintaining broad compatibility.

Provide helper functions or guidance for selecting optimal character sets that avoid problematic characters in common contexts (JSON, URLs, terminals, etc.).

## Persistence

Custom encodings persist only for the current session/module instance. This feature focuses on experimentation and runtime customization rather than permanent storage.

## Error Handling

Clear error messages for:
- Invalid character sets (control characters, duplicates)
- Attempts to override built-in encoding names
- Invalid encoding names in subsequent encode/decode calls

## Acceptance Criteria

- createEncoding() successfully registers new encodings with custom character sets
- Custom encodings work with encode() and decode() functions
- Character set validation prevents problematic configurations
- listEncodings() includes custom encodings with accurate metadata
- Round-trip property maintained for all custom encodings
- Support for character sets from size 2 to reasonable upper limits
- Clear documentation and examples of creating high-density custom encodings
- Function exported as named export from src/lib/main.js