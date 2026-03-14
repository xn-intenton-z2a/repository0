# RFC 1924 IPv6 Base85 Encoding

## Table of Contents

1. IPv6 Address Representation Challenge
2. Base85 Encoding Specification
3. Character Set and Selection Criteria
4. Mathematical Foundation
5. Conversion Algorithm Implementation
6. Security and Implementation Considerations

## IPv6 Address Representation Challenge

### Current IPv6 Formats

RFC 1924 addresses the verbose nature of standard IPv6 address representations:

**Standard Hexadecimal Format**:
- Notation: x:x:x:x:x:x:x:x (8 groups of 4 hex digits)
- Length: 15-39 characters depending on zero compression
- Example: FEDC:BA98:7654:3210:FEDC:BA98:7654:3210 (39 characters)

**Zero-Compressed Format**:
- Uses :: to indicate multiple zero groups
- Example: 1080::8:800:200C:417A (21 characters from 25)
- Minimum case: :: (2 characters for all-zero address)

### Proposed Solution Benefits

RFC 1924 proposes a Base85 encoding that provides:
- **Fixed Length**: Always exactly 20 characters for any IPv6 address
- **Compact Representation**: Shorter than most standard formats
- **No Variable Length**: Eliminates ugly variable-length representations
- **Mathematical Elegance**: Treats address as single 128-bit integer

## Base85 Encoding Specification

### Radix Selection Justification

**Mathematical Requirements**:
- IPv6 addresses: 2^128 possible values (340,282,366,920,938,463,463,374,607,431,768,211,456)
- Base85^20: 387,595,310,845,143,558,731,231,784,820,556,640,625 (sufficient)
- Base84^20: 305,904,398,238,499,908,683,087,849,324,518,834,176 (insufficient)

**Efficiency Analysis**:
- Base85 uses minimum character set for 20-character representation
- Range 85-94 could work but wastes character space
- Base94 would still require 20 characters for coverage
- Selecting 85 preserves maximum characters for other uses

### Address Processing Method

**Single Integer Approach**:
- Treat entire 128-bit IPv6 address as one large integer
- Convert complete integer to base85 representation
- No grouping or chunking of address components
- Results in exactly 20 base85 digits for any address

## Character Set and Selection Criteria

### Complete Alphabet Definition

The RFC 1924 character set contains 85 characters in ascending order:

**Character Groups**:
- Digits: 0-9 (10 characters)
- Uppercase: A-Z (26 characters)
- Lowercase: a-z (26 characters)  
- Special: !#$%&()*+-;<=>?@^_`{|}~ (23 characters)

### Excluded Characters and Rationale

**Quotation Marks**: " and ' excluded
- Allows IPv6 addresses to be quoted in environments where other characters have special meanings
- Prevents escaping requirements in string literals

**Structural Characters**: , and . excluded
- Comma enables list representation (addr1, addr2, addr3)
- Period allows sentence termination without quoting requirement

**Network Notation**: / and : excluded
- Slash preserved for CIDR notation (address/prefix-length)
- Colon avoids conflicts with mail headers and URLs

**Address Delimiters**: [ and ] excluded
- Enables textual address delimiting consistent with IPv4 practices
- Supports bracketed representation in protocols

**Escaping Issues**: \ excluded
- Eliminates representation difficulties where backslash appears as quote character
- Simplifies parsing and string handling

## Mathematical Foundation

### Conversion Algorithm Specification

**Encoding Process**:
1. Interpret IPv6 address as 128-bit big-endian integer
2. Repeatedly divide by 85, collecting remainders
3. Map each remainder (0-84) to character set position
4. Result is 20-character base85 string

**Decoding Process**:
1. Map each character to numeric value (0-84)
2. Calculate positional values: character_value × 85^position
3. Sum all positional values to reconstruct 128-bit integer
4. Convert integer to 16-byte IPv6 address format

### Practical Example Implementation

**Sample Conversion**:
- IPv6: 1080:0:0:0:8:800:200C:417A
- Decimal: 21,932,261,930,451,111,902,915,077,091,070,067,066
- Base85 remainders: 51,34,65,57,58,0,75,53,37,4,19,61,31,63,12,66,46,70,68,4
- Encoded result: 4)+k&C#VzJ4br>0wv%Yp

**Verification Process**:
- Each remainder maps to character set position
- Character 4 = position 4, ) = position 51, + = position 62, etc.
- Decoding reverses the process exactly

## Security and Implementation Considerations

### Cryptographic Properties

**Address Obfuscation**:
- Encoded form appears random to casual observers
- Harder to immediately recognize address structure
- Complicates packet sniffing for address detection
- Provides mild security-through-obscurity benefit

**Non-Cryptographic Nature**:
- Encoding is purely mathematical transformation
- No cryptographic security guarantees
- Deterministic bidirectional conversion
- Not suitable for actual security applications

### Implementation Challenges

**128-bit Arithmetic Requirements**:
- Many processors lack native 128-bit integer support
- Requires extended precision arithmetic libraries
- Implementation complexity higher than chunked approaches
- Performance may be processor-dependent

**Precision Considerations**:
- Must maintain exact integer precision throughout conversion
- Floating-point arithmetic insufficient for 128-bit values
- Requires careful overflow and underflow handling
- Testing needed across different architectures

### Deployment Compatibility

**Protocol Integration**:
- Fixed 20-character length simplifies parsing
- No special characters requiring protocol escaping
- Compatible with most text-based network protocols
- Uniform representation reduces implementation complexity

**Legacy System Interaction**:
- May require conversion utilities for existing tools
- Database schema implications for fixed-width storage
- Logging and monitoring system updates needed
- Training requirements for network administrators

## Reference Details

### Standards Context

**RFC Classification**: Informational (April Fools' Day RFC)
- Published April 1, 1996 as humorous document
- Technically sound mathematical foundation
- Not intended for actual deployment
- Demonstrates IPv6 representation alternatives

**Historical Significance**:
- Highlights IPv6 address length concerns
- Influenced later compact representation discussions
- Academic exercise in encoding efficiency
- Preserved as educational reference

### Implementation Notes

**Mathematical Libraries**:
- Requires arbitrary precision arithmetic support
- Consider existing big integer implementations
- Test edge cases: all-zero and all-one addresses
- Validate conversion round-trip accuracy

**Character Set Handling**:
- Ensure proper ASCII character mapping
- Validate character set completeness (85 characters)
- Implement bounds checking for character values
- Handle invalid characters gracefully

**Performance Optimization**:
- Consider lookup tables for character mapping
- Cache intermediate calculations when possible
- Optimize for common address patterns
- Profile conversion performance characteristics

## Digest

RFC 1924 specification for Base85 encoding of IPv6 addresses using 85-character ASCII alphabet. Provides fixed 20-character representation of any IPv6 address through 128-bit integer conversion. Published as April Fools' RFC but contains technically valid encoding mathematics.

Retrieved: 2026-03-14
Sources: https://rfc-editor.org/rfc/rfc1924.html

Data size: Approximately 5KB of RFC specification consolidated into implementation reference format.