# RFC 4648: Base16, Base32, and Base64 Encodings

## Table of Contents

1. Standard Specifications Overview
2. Base64 Encoding Specification
3. Base64URL Encoding Variant
4. Base32 Encoding Specification  
5. Base32 Extended Hex Variant
6. Base16 Encoding Specification
7. Implementation Requirements
8. Security and Canonical Encoding

## Standard Specifications Overview

RFC 4648 establishes the definitive standards for Base16, Base32, and Base64 data encodings. Published as an Internet Standards Track protocol in October 2006, it obsoletes RFC 3548 and provides common alphabet and encoding considerations for interoperability.

### Scope and Purpose

The standard addresses encoding arbitrary binary data for transmission over text-based protocols that may have restrictions on character sets, line lengths, or other formatting constraints. It establishes canonical implementations to reduce ambiguity in protocol specifications.

### Encoding Principles

All Base-N encodings in RFC 4648 follow these principles:
- Convert binary input into restricted ASCII character sets
- Enable reliable transmission through 7-bit clean channels
- Provide deterministic encoding and decoding processes
- Support various alphabet sizes for different requirements

## Base64 Encoding Specification

### Character Alphabet

Base64 uses a 65-character subset of US-ASCII, with 64 characters for encoding plus padding:

| Value | Char | Value | Char | Value | Char | Value | Char |
|-------|------|-------|------|-------|------|-------|------|
| 0     | A    | 17    | R    | 34    | i    | 51    | z    |
| 1     | B    | 18    | S    | 35    | j    | 52    | 0    |
| 2     | C    | 19    | T    | 36    | k    | 53    | 1    |
| 3     | D    | 20    | U    | 37    | l    | 54    | 2    |
| 4     | E    | 21    | V    | 38    | m    | 55    | 3    |
| 5     | F    | 22    | W    | 39    | n    | 56    | 4    |
| 6     | G    | 23    | X    | 40    | o    | 57    | 5    |
| 7     | H    | 24    | Y    | 41    | p    | 58    | 6    |
| 8     | I    | 25    | Z    | 42    | q    | 59    | 7    |
| 9     | J    | 26    | a    | 43    | r    | 60    | 8    |
| 10    | K    | 27    | b    | 44    | s    | 61    | 9    |
| 11    | L    | 28    | c    | 45    | t    | 62    | +    |
| 12    | M    | 29    | d    | 46    | u    | 63    | /    |
| 13    | N    | 30    | e    | 47    | v    | (pad) | =    |
| 14    | O    | 31    | f    | 48    | w    |       |      |
| 15    | P    | 32    | g    | 49    | x    |       |      |
| 16    | Q    | 33    | h    | 50    | y    |       |      |

### Encoding Process

1. **Group Formation**: Process input in 24-bit groups (3 bytes)
2. **Bit Splitting**: Treat 24 bits as four 6-bit groups
3. **Character Mapping**: Map each 6-bit value to alphabet character
4. **Padding**: Add '=' characters for incomplete final groups

### Padding Rules

- **8 bits remaining**: Two characters + two '=' padding
- **16 bits remaining**: Three characters + one '=' padding  
- **24 bits (complete)**: Four characters, no padding

## Base64URL Encoding Variant

### Modified Alphabet

Base64URL replaces URL-problematic characters for safe usage in URLs and filenames:

| Standard Base64 | Base64URL | Position |
|----------------|-----------|----------|
| +              | -         | 62       |
| /              | _         | 63       |
| =              | (omitted) | padding  |

### URL Safety Features

- Hyphen (-) and underscore (_) are URL-safe
- Padding can be omitted when length is known implicitly
- No percent-encoding required for URLs
- File system compatible (avoids problematic characters)

## Base32 Encoding Specification

### Standard Base32 Alphabet

Uses 32 characters: A-Z (uppercase) and 2-7 (digits):

```
ABCDEFGHIJKLMNOPQRSTUVWXYZ234567
```

### Encoding Characteristics

- **Input grouping**: 40 bits (5 bytes) per encoding group
- **Output grouping**: 8 characters per group
- **Bits per character**: 5 bits
- **Efficiency**: 62.5% (5/8)
- **Padding character**: '='

### Case Sensitivity

Base32 standard specifies uppercase letters, but decoders may accept lowercase. For consistent interpretation:
- Encoders should output uppercase
- Decoders may accept both cases
- '0' (zero) and '1' (one) are not present to avoid confusion

## Base32 Extended Hex Variant

### Extended Hex Alphabet

Alternative Base32 using hexadecimal-style characters:

```
0123456789ABCDEFGHIJKLMNOPQRSTUV
```

### Usage Context

- Maintains hexadecimal familiarity
- Useful for applications transitioning from hex
- Same encoding rules as standard Base32
- Different character set only

## Base16 Encoding Specification

### Hexadecimal Alphabet

Standard hexadecimal representation using 16 characters:

```
0123456789ABCDEF (uppercase)
0123456789abcdef (lowercase)
```

### Encoding Properties

- **Input grouping**: 4 bits per character
- **Efficiency**: 50% (4/8 bits)
- **No padding**: Each byte maps to exactly 2 characters
- **Case variants**: Uppercase or lowercase acceptable

## Implementation Requirements

### Mandatory Behaviors

**Line Feeds**: Implementations MUST NOT add line feeds unless explicitly directed by referring specification.

**Padding**: Implementations MUST include appropriate padding unless specification states otherwise.

**Non-Alphabet Characters**: Implementations MUST reject encoded data containing characters outside the base alphabet, unless specification explicitly permits ignoring such characters.

**Canonical Encoding**: Pad bits MUST be set to zero by conforming encoders.

### Character Handling Requirements

**Whitespace**: May be ignored during decoding if specification permits
**Case Sensitivity**: Depends on specific encoding variant
**Error Handling**: Must reject invalid character sequences
**Buffer Overflow**: Must validate against implementation limits

## Security and Canonical Encoding

### Canonical Encoding Requirements

To ensure unique representation of data:
- Pad bits must be zero in canonical encoding
- Consistent character case usage
- Proper padding application
- No extraneous characters in output

### Security Considerations

**Covert Channels**: Non-alphabet characters could carry hidden information
**Buffer Attacks**: Invalid sequences might exploit implementation errors  
**Padding Validation**: Improper padding could indicate corruption or attack
**Character Interpretation**: Ambiguous characters may cause security issues

### Validation Requirements

Decoders should:
- Verify character validity before processing
- Validate padding correctness
- Check canonical encoding properties
- Reject malformed input appropriately

## Reference Details

### Standard Information

- **Document**: RFC 4648
- **Status**: Standards Track
- **Date**: October 2006
- **Obsoletes**: RFC 3548
- **Category**: Internet Standards

### Implementation Guidance

- Character set size must not exceed available alphabet
- Alphabet selection affects usage context suitability
- Line length limits may require specification-specific handling
- Cross-platform compatibility requires consistent implementation

## Digest

Complete technical specifications for Base16, Base32, and Base64 encodings from RFC 4648. Content includes character alphabets, encoding algorithms, padding rules, security requirements, and implementation mandates. Establishes definitive standards for Internet protocol usage with emphasis on canonical encoding and interoperability.

Retrieved: 2026-03-14
Sources: https://tools.ietf.org/rfc/rfc4648.txt

Data size: Approximately 15KB of RFC specifications condensed into implementation-focused guidance.

## Table of Contents

1. Base64 Standard Encoding
2. Base64URL Encoding Variant  
3. Base32 Standard Encoding
4. Base32 Extended Hex Encoding
5. Base16 Hex Encoding
6. Padding and Canonical Encoding
7. Implementation Requirements

## Base64 Standard Encoding

### Character Alphabet

The Base64 alphabet uses 65 ASCII characters (64 + padding):

| Value | Char | Value | Char | Value | Char | Value | Char |
|-------|------|-------|------|-------|------|-------|------|
| 0     | A    | 17    | R    | 34    | i    | 51    | z    |
| 1     | B    | 18    | S    | 35    | j    | 52    | 0    |
| 2     | C    | 19    | T    | 36    | k    | 53    | 1    |
| 3     | D    | 20    | U    | 37    | l    | 54    | 2    |
| 4     | E    | 21    | V    | 38    | m    | 55    | 3    |
| 5     | F    | 22    | W    | 39    | n    | 56    | 4    |
| 6     | G    | 23    | X    | 40    | o    | 57    | 5    |
| 7     | H    | 24    | Y    | 41    | p    | 58    | 6    |
| 8     | I    | 25    | Z    | 42    | q    | 59    | 7    |
| 9     | J    | 26    | a    | 43    | r    | 60    | 8    |
| 10    | K    | 27    | b    | 44    | s    | 61    | 9    |
| 11    | L    | 28    | c    | 45    | t    | 62    | +    |
| 12    | M    | 29    | d    | 46    | u    | 63    | /    |
| 13    | N    | 30    | e    | 47    | v    |       |      |
| 14    | O    | 31    | f    | 48    | w    | (pad) | =    |
| 15    | P    | 32    | g    | 49    | x    |       |      |
| 16    | Q    | 33    | h    | 50    | y    |       |      |

### Encoding Process

**Input Grouping**: Process 3 input bytes (24 bits) at a time
**Output Generation**: Produce 4 output characters (24 bits encoded as 4×6-bit groups)

#### Algorithm Steps

1. **Group Formation**: Concatenate 3 8-bit input bytes into 24-bit group
2. **Bit Subdivision**: Treat as 4 concatenated 6-bit groups  
3. **Character Mapping**: Use each 6-bit value as index into alphabet
4. **Padding Application**: Add '=' characters for incomplete final groups

#### Padding Rules

**Case 1**: Input length multiple of 3 bytes
- No padding required
- Output length multiple of 4 characters

**Case 2**: Final group has 1 byte (8 bits)
- Pad with 2 zero bytes for encoding
- Output 2 characters + 2 '=' padding characters

**Case 3**: Final group has 2 bytes (16 bits)  
- Pad with 1 zero byte for encoding
- Output 3 characters + 1 '=' padding character

### Implementation Requirements

**Canonical Encoding**:
- Pad bits MUST be set to zero
- Consistent character case (upper/lowercase as specified)
- No line feeds unless explicitly required

**Error Handling**:
- Reject characters outside base alphabet
- Validate padding character placement
- Handle truncated input appropriately

## Base64URL Encoding Variant

### Character Differences

Base64URL modifies the standard Base64 alphabet for URL and filename safety:

**Character Substitutions**:
- Position 62: '+' → '-' (minus)
- Position 63: '/' → '_' (underscore)
- Padding: '=' (same, but often omitted)

### URL Safety Features

**Safe Characters**:
- No percent-encoding required in URLs
- Filesystem safe on most platforms
- No shell escaping needed
- JSON string compatible

**Padding Considerations**:
- Padding typically omitted when data length known implicitly
- '=' character percent-encoded in URIs when present
- Decoder must handle both padded and unpadded input

### Complete Alphabet

```
ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_
```

## Base32 Standard Encoding

### Character Alphabet

Base32 uses 33 ASCII characters (32 + padding):

| Value | Char | Value | Char | Value | Char | Value | Char |
|-------|------|-------|------|-------|------|-------|------|
| 0     | A    | 9     | J    | 18    | S    | 27    | 3    |
| 1     | B    | 10    | K    | 19    | T    | 28    | 4    |
| 2     | C    | 11    | L    | 20    | U    | 29    | 5    |
| 3     | D    | 12    | M    | 21    | V    | 30    | 6    |
| 4     | E    | 13    | N    | 22    | W    | 31    | 7    |
| 5     | F    | 14    | O    | 23    | X    |       |      |
| 6     | G    | 15    | P    | 24    | Y    | (pad) | =    |
| 7     | H    | 16    | Q    | 25    | Z    |       |      |
| 8     | I    | 17    | R    | 26    | 2    |       |      |

### Encoding Specifications

**Input Grouping**: Process 5 input bytes (40 bits) at a time
**Output Generation**: Produce 8 output characters (40 bits as 8×5-bit groups)
**Bit Order**: Most significant bit first in stream

#### Padding Scenarios

**Case 1**: Input multiple of 5 bytes
- Output multiple of 8 characters, no padding

**Case 2**: Final group has 1 byte (8 bits)  
- Output 2 characters + 6 '=' padding

**Case 3**: Final group has 2 bytes (16 bits)
- Output 4 characters + 4 '=' padding  

**Case 4**: Final group has 3 bytes (24 bits)
- Output 5 characters + 3 '=' padding

**Case 5**: Final group has 4 bytes (32 bits)
- Output 7 characters + 1 '=' padding

### Case Insensitive Design

Base32 designed for case-insensitive environments:
- Uses only uppercase letters and digits
- No ambiguous character pairs within alphabet
- Suitable for voice communication
- Compatible with case-insensitive filesystems

## Base32 Extended Hex Encoding

### Hexadecimal-Based Alphabet

Alternative Base32 using hexadecimal-style characters:

**Character Set**: 0123456789ABCDEFGHIJKLMNOPQRSTUV

**Advantages**:
- Lexicographical ordering matches numerical ordering
- Familiar hexadecimal prefix
- Consistent with existing hex tools
- Simplified implementation using hex libraries

**Usage Context**:
- Applications requiring sorted encoding
- Integration with hexadecimal tooling
- Mathematical applications
- Database indexing systems

## Base16 Hex Encoding

### Standard Hexadecimal Encoding

**Character Set**: 0123456789ABCDEF (16 characters)
**Encoding Ratio**: 1 input byte → 2 output characters
**Efficiency**: 50% (100% overhead)

#### Encoding Process

**Direct Mapping**:
- High nibble (4 bits) → first hex character
- Low nibble (4 bits) → second hex character
- No padding required (even number of hex digits)

**Implementation**:
```
input_byte = 0xA7  (167 decimal)
high_nibble = (input_byte >> 4) & 0x0F = 0xA = 'A'
low_nibble = input_byte & 0x0F = 0x7 = '7'  
output = "A7"
```

### Case Variants

**Uppercase**: 0123456789ABCDEF (standard)
**Lowercase**: 0123456789abcdef (alternative)
**Mixed Case**: Application dependent

RFC 4648 specifies uppercase as canonical form but allows lowercase implementations with appropriate documentation.

## Padding and Canonical Encoding

### Padding Requirements

**Mandatory Padding**:
- Base64: Required unless specification states otherwise
- Base32: Required unless specification states otherwise  
- Base16: No padding needed (always even character count)

**Pad Bit Validation**:
- Unused bits in final encoded character MUST be zero
- Non-zero pad bits indicate non-canonical encoding
- Decoders MAY reject non-zero pad bits for security

### Line Feed Restrictions

**Prohibition**: Encoders MUST NOT add line feeds unless specification explicitly permits
**Historical Context**: MIME enforces 76-character line limit, PEM uses 64 characters
**Implementation**: Line length limits only when required by referring specification

### Non-Alphabet Character Handling

**Standard Behavior**: MUST reject encoded data containing non-alphabet characters
**Alternative Behavior**: Some specifications allow ignoring non-alphabet characters
**Whitespace**: Carriage return/line feed considered non-alphabet, typically ignored
**Pad Character Placement**: '=' only valid at end of encoded data

## Implementation Requirements

### Character Set Selection

**Alphabet Considerations**:
- Human readability requirements (avoid 0/O, 1/I/l confusion)
- Encoded structure constraints (filesystem, URL safety)
- Word-break behavior in legacy tools
- Case sensitivity requirements

### Canonical Encoding Properties

**Deterministic Output**:
- Identical input produces identical output
- Pad bits set to zero
- Consistent character case
- Standardized padding application

**Security Implications**:
- Multiple encodings of same data enable covert channels
- Non-canonical forms may bypass validation
- Consistent implementation prevents security issues

### Error Detection

**Validation Points**:
- Character alphabet membership
- Padding character placement and count
- Pad bit verification
- Input length validation

**Error Responses**:
- Invalid character: Reject with error
- Malformed padding: Reject with error  
- Overflow conditions: Handle gracefully
- Truncated input: Context dependent handling

## Reference Details

### Standards Compliance

**RFC 4648 Scope**:
- Obsoletes RFC 3548
- Defines canonical Base64, Base32, Base16
- Establishes implementation guidelines
- Specifies error handling requirements

**Implementation Notes**:
- 128-bit integer arithmetic not required
- Streaming implementation possible
- Memory efficient algorithms available
- Cross-platform compatibility considerations

### Security Considerations

**Covert Channel Prevention**:
- Reject non-canonical encodings when security critical
- Validate pad bit values
- Consistent whitespace handling
- Standardized error responses

**Performance Impact**:
- Character validation overhead
- Memory allocation patterns
- Streaming vs. batch processing
- Platform-specific optimizations

## Digest

Complete RFC 4648 specification for Base64, Base64URL, Base32, Base32 Extended Hex, and Base16 encodings. Includes character alphabets, padding rules, canonical encoding requirements, and implementation guidelines for standards-compliant binary-to-text encoding systems.

Retrieved: 2026-03-13
Sources: https://tools.ietf.org/rfc/rfc4648.txt

Data size: Approximately 20KB of official RFC specification consolidated into implementation reference format.