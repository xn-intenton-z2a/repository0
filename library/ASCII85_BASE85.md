# Ascii85 and Base85 Encoding

## Table of Contents

1. Character Set and Special Cases
2. Encoding Algorithm Specifications
3. Padding and Truncation Rules
4. Adobe vs btoa Implementations
5. Decoding Process and Error Handling
6. Performance and Compatibility

## Character Set and Special Cases

### Primary Alphabet

Ascii85 uses 85 printable ASCII characters from ! (33) to u (117):
```
!"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\]^_`abcdefghijklmnopqrstu
```

Character range: ASCII codes 33-117 (85 characters total)

### Special Case Characters

**Zero Compression (z)**:
- All-zero 32-bit group (0x00000000) encodes as single 'z'
- Provides significant compression for zero-padded data
- Only valid as complete group replacement, not mid-group

**Space Compression (y)** (btoa v4.2 only):
- All-space 32-bit group (0x20202020) encodes as single 'y'
- Adobe specification does not support this extension
- Limited to specific btoa implementations

## Encoding Algorithm Specifications

### Input Grouping

- Process input in 4-byte (32-bit) groups
- Use big-endian byte order (most significant byte first)
- Incomplete final groups require padding for encoding

### Mathematical Conversion

#### Step-by-Step Process

1. **Group Formation**: Take 4 input bytes as 32-bit integer
2. **Base Conversion**: Repeatedly divide by 85, collecting remainders
3. **Character Mapping**: Add 33 to each remainder for ASCII character
4. **Output Ordering**: Most significant digit first

#### Calculation Formula

For 32-bit value V:
```
digit[0] = (V / 85^4) % 85 + 33
digit[1] = (V / 85^3) % 85 + 33
digit[2] = (V / 85^2) % 85 + 33
digit[3] = (V / 85^1) % 85 + 33
digit[4] = (V / 85^0) % 85 + 33
```

### Maximum Value Constraint

Groups decoding to values ≥ 2^32 (encoded as s8W-! or higher) cause decoding errors.

## Padding and Truncation Rules

### Adobe Ascii85 Padding

#### Encoding Padding Process

1. **Incomplete Groups**: Pad with null bytes (0x00) to reach 4 bytes
2. **Encode Full Group**: Process padded group normally
3. **Truncate Output**: Remove padding characters from end

Padding removal count equals bytes added during padding.

#### Decoding Padding Process

1. **Incomplete Groups**: Pad with 'u' characters to reach 5 characters
2. **Decode Full Group**: Process padded group normally
3. **Truncate Output**: Remove padding bytes from end

### Padding Example

**Input**: "." (0x2E, 1 byte)
**Padded**: 0x2E000000 (4 bytes)
**Encoded**: /cYkO (5 characters)
**Truncated**: /c (2 characters, 3 removed)

**Decoding**: /cuuu → 0x2E031964 → truncate 3 bytes → 0x2E

## Adobe vs btoa Implementations

### Adobe Ascii85 Specification

**Delimiters**:
- Prefix: <~ (optional)
- Suffix: ~> (required terminator)

**Features**:
- Zero compression with 'z' character
- Whitespace ignored anywhere in stream
- No 'y' space compression support

**Error Handling**:
- Invalid characters rejected
- Overflow values cause errors
- Whitespace silently ignored

### Original btoa Program

**Format Structure**:
- Prefix line: "xbtoa Begin"
- Suffix line: "xbtoa End"
- Metadata: Original length in decimal and hexadecimal
- Checksums: Three 32-bit verification values

**Extensions**:
- 'z' compression for all-zero groups
- 'y' compression for all-space groups (v4.2+)
- Full group padding always applied

## Decoding Process and Error Handling

### Decoding Algorithm

1. **Character Validation**: Verify all characters in valid range (33-117)
2. **Special Case Detection**: Handle 'z' (and 'y' if supported)
3. **Base Conversion**: Convert 5-character groups to 32-bit integers
4. **Overflow Check**: Verify result < 2^32
5. **Byte Extraction**: Extract 4 bytes in big-endian order

### Error Conditions

**Invalid Characters**:
- Characters outside ! to u range
- 'z' appearing mid-group
- Invalid Unicode or non-ASCII input

**Arithmetic Errors**:
- Decoded value ≥ 2^32
- Integer overflow during calculation
- Malformed group sizes

### Whitespace Handling

All whitespace characters (spaces, tabs, line breaks) must be ignored during decoding, allowing for formatted output with line wrapping.

## Performance and Compatibility

### Efficiency Characteristics

- **Compression Ratio**: 80% efficiency (25% overhead)
- **Group Processing**: 4 input bytes → 5 output characters
- **Zero Compression**: Significant improvement for zero-heavy data

### Compatibility Considerations

**Safe Contexts**:
- PostScript and PDF files
- Binary patch formats (Git)
- 7-bit and 8-bit MIME transmission

**Problematic Contexts**:
- XML/SGML (requires escaping for <, >, &, ", ')
- Shell commands (special meaning for various characters)
- JSON strings (backslash and quote escaping needed)

### Implementation Variants

**Z85 (ZeroMQ)**:
- Different character set excluding problematic symbols
- Same mathematical foundation
- Designed for source code safety

**RFC 1924 (April Fools)**:
- Different 85-character alphabet
- IPv6 address encoding
- Single 128-bit integer conversion

## Reference Details

### Standards Documentation

- Adobe PostScript Language Reference Manual
- btoa utility original specification
- Git binary patch format documentation

### Implementation Guidelines

#### Memory Requirements
- Input buffer: Multiple of 4 bytes preferred
- Output buffer: (input_length × 5 / 4) + padding space
- Streaming: Process 4-byte chunks incrementally

#### Performance Optimization
- Lookup tables for character mapping
- Integer arithmetic optimization
- Zero-detection fast paths

#### Security Considerations
- Input validation before processing
- Buffer overflow protection
- Consistent error handling

## Digest

Complete Ascii85/Base85 encoding specification including Adobe and btoa variants, mathematical algorithms, padding rules, and implementation guidelines. Provides 80% encoding efficiency with special compression for zero and space patterns.

Retrieved: 2026-03-13
Sources: https://en.wikipedia.org/wiki/Ascii85, https://rfc-editor.org/rfc/rfc1924.html

Data size: Approximately 18KB of technical documentation consolidated into implementation specifications.