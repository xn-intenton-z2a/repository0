# Custom Encoding Creation

## Purpose

Enable users to define custom encodings using arbitrary character sets, expanding beyond the built-in encodings to explore novel encoding possibilities.

## Specification

The createEncoding function allows users to define new encodings by providing a name and character set string. Custom encodings integrate seamlessly with the core encode/decode functions.

Users can experiment with different character sets to optimize for specific use cases, Unicode ranges, or platform constraints while maintaining the round-trip property.

The system must validate character sets for uniqueness, printability, and compatibility with the encoding algorithms.

## Requirements

The createEncoding(name, charset) function must accept a unique encoding name and a string containing the character set for the encoding.

Character set validation must ensure all characters are unique, printable, and suitable for text encoding. The function should reject character sets containing control characters, whitespace, or duplicate characters.

Created encodings must be immediately available to the core encode/decode functions and included in listEncodings output with calculated metadata.

The system must support character sets of various sizes, automatically determining the appropriate encoding algorithm based on the character set size.

## Acceptance Criteria

- createEncoding function accepts name and character set parameters
- Character set validation rejects duplicates and control characters
- Custom encodings immediately available to encode/decode functions
- Custom encodings included in listEncodings output
- Automatic algorithm selection based on character set size
- Round-trip property maintained for all custom encodings
- Clear error messages for invalid character sets
- Support for character sets from size 2 to practical ASCII limits
- Function exported as named export from src/lib/main.js