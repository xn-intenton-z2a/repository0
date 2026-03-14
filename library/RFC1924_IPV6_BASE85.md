# RFC 1924: IPv6 Base85 Compact Representation

## Table of Contents

1. Compact IPv6 Address Specification
2. Base85 Character Set Selection  
3. Encoding Algorithm and Mathematics
4. Implementation Requirements
5. Security and Address Privacy
6. Practical Examples and Conversion

## Compact IPv6 Address Specification

### Address Length Optimization

RFC 1924 defines a Base85 encoding that represents any IPv6 address in exactly 20 ASCII characters, compared to the standard representation's variable 15-39 characters.

### Current IPv6 Format Problems

Standard IPv6 representations suffer from:
- **Variable length**: 15 to 39 characters depending on zero compression
- **Colon complexity**: Multiple colons for zero suppression (::)
- **Case sensitivity**: Hex digits allow upper/lowercase variants
- **Punctuation density**: Frequent colon separators reduce readability

### Base85 Solution Benefits

The Base85 approach provides:
- **Fixed length**: Always exactly 20 characters
- **Higher density**: No punctuation separators
- **Consistent format**: No special zero-compression rules
- **Reduced ambiguity**: Single canonical representation

## Base85 Character Set Selection

### Mathematical Requirements

IPv6 addresses are 128-bit values requiring specific encoding capacity:
- **Address space**: 2¹²⁸ = 340,282,366,920,938,463,463,374,607,431,768,211,456
- **Base85 capacity**: 85²⁰ = 387,595,310,845,143,558,731,231,784,820,556,640,625
- **Margin**: Base85 provides sufficient space with room for growth

### Base Selection Analysis

| Base | Characters Needed | Capacity Check |
|------|-------------------|----------------|
| 84   | 21               | 84²⁰ insufficient |
| 85   | 20               | 85²⁰ sufficient |
| 94   | 19               | 94¹⁹ insufficient |
| 95   | 20               | No improvement over 85 |

85 is optimal: smallest character set achieving 20-character representation.

### Character Set Definition

The RFC 1924 Base85 alphabet (85 characters):
```
0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!#$%&()*+-;<=>?@^_`{|}~
```

### Excluded Characters and Rationale

Nine characters deliberately excluded from the 94 printable ASCII set:

| Character | Reason for Exclusion |
|-----------|---------------------|
| "         | Enable quoted IPv6 addresses |
| '         | Enable quoted IPv6 addresses |
| ,         | Allow comma-separated address lists |
| .         | Permit sentence-ending addresses |
| /         | Support CIDR notation (address/length) |
| :         | Avoid mail header and URL conflicts |
| [         | Enable address delimiting |
| ]         | Enable address delimiting |
| \         | Prevent escape character complications |

## Encoding Algorithm and Mathematics

### Conversion Process

IPv6 to Base85 conversion follows standard base conversion:
1. **Integer interpretation**: Treat 128-bit address as single integer
2. **Division algorithm**: Repeatedly divide by 85, collect remainders
3. **Character mapping**: Map each remainder to Base85 alphabet
4. **Digit ordering**: Read remainders in reverse order

### Detailed Example

IPv6 address `1080:0:0:0:8:800:200C:417A` conversion:

**Step 1**: Convert to decimal integer
- Hexadecimal: 1080:0:0:0:8:800:200C:417A
- Decimal: 21,932,261,930,451,111,902,915,077,091,070,067,066

**Step 2**: Base85 division sequence
```
21932261930451111902915077091070067066 ÷ 85 = remainder 51
... (continue division) ...
Final remainders: 51,34,65,57,58,0,75,53,37,4,19,61,31,63,12,66,46,70,68,4
```

**Step 3**: Character mapping
- Remainders: 4,68,70,46,66,12,63,31,61,19,4,37,53,75,0,58,57,65,34,51
- Characters: 4)+k&C#VzJ4br>0wv%Yp

### Reversal Process

Base85 to IPv6 decoding:
1. **Character validation**: Ensure all characters in valid alphabet
2. **Remainder extraction**: Map characters back to 0-84 values
3. **Integer reconstruction**: Calculate sum of (remainder × 85^position)
4. **Hex conversion**: Convert integer to 128-bit hex representation
5. **IPv6 formatting**: Apply standard colon formatting

## Implementation Requirements

### Arithmetic Precision

**128-bit Integer Support**: Many processors lack native 128-bit arithmetic, requiring:
- Multi-precision arithmetic libraries
- Careful overflow handling
- Consistent cross-platform behavior
- Performance optimization for repeated operations

### Algorithm Complexity

**Division-Heavy Process**: Base conversion requires:
- Repeated division by 85 (encoding direction)
- Multiplication and addition (decoding direction)  
- Handling of large integer values
- Precision maintenance throughout process

### Validation Requirements

Implementations must validate:
- **Character validity**: All input characters in defined alphabet
- **Length verification**: Exactly 20 characters for complete addresses
- **Range checking**: Result fits within IPv6 address space
- **Canonical output**: Consistent formatting for identical inputs

## Security and Address Privacy

### Address Obfuscation Benefits

Base85 representation provides indirect security benefits:
- **Reduced recognition**: Casual observers cannot immediately identify binary form
- **Pattern masking**: Standard IPv6 patterns become less obvious
- **Tool compatibility**: Many tools expect standard IPv6 format

### Privacy Considerations

**Not a Security Measure**: RFC 1924 encoding is NOT designed for:
- Cryptographic protection
- Access control mechanisms  
- Address hiding from determined observers
- Prevention of reverse engineering

The encoding provides convenience, not security.

### Memorization Challenges

IPv6 addresses are inherently difficult to memorize regardless of representation:
- **Address purpose**: Not intended for human memorization
- **Length factor**: 20 characters still exceed comfortable memory limits
- **Character density**: Base85 characters less familiar than hex
- **Network tools**: Most utilities can handle both representations

## Practical Examples and Conversion

### Standard Format Comparison

| Standard IPv6 | Length | Base85 Equivalent | Length |
|---------------|--------|-------------------|--------|
| 1080::8:800:200C:417A | 21 | 4)+k&C#VzJ4br>0wv%Yp | 20 |
| FEDC:BA98:7654:3210:FEDC:BA98:7654:3210 | 39 | (example not provided) | 20 |
| :: | 2 | 00000000000000000000 | 20 |

### Edge Cases

**All Zero Address** (::):
- Standard: :: (2 characters, minimal case)
- Base85: 4)+k&C#VzJ4br>0wv%Yp (20 characters, consistent length)

**Maximum Address** (all F's):
- Standard: FFFF:FFFF:FFFF:FFFF:FFFF:FFFF:FFFF:FFFF (39 characters)
- Base85: (20 characters, specific encoding not shown in RFC)

### Implementation Status Note

RFC 1924 was published as an **April 1st RFC** (April Fools' Day), indicating its primary purpose as demonstration rather than serious deployment recommendation. However, the technical approach remains mathematically sound and could be implemented if desired.

## Reference Details

### RFC Information

- **Document**: RFC 1924
- **Title**: A Compact Representation of IPv6 Addresses
- **Date**: April 1, 1996
- **Status**: Informational  
- **Category**: April Fools' RFC
- **Author**: R. Elz, University of Melbourne

### Technical Specifications

- **Character set**: 85 carefully selected ASCII printable characters
- **Fixed length**: Always 20 characters per IPv6 address
- **Mathematical foundation**: Base85 number system
- **Precision requirements**: 128-bit integer arithmetic
- **Error handling**: Character validation and range checking

### Implementation Considerations

- **Processor limitations**: 128-bit arithmetic not universally available
- **Library dependencies**: Multi-precision math libraries typically required
- **Performance characteristics**: Division-heavy algorithm impacts speed
- **Compatibility**: Standard tools expect conventional IPv6 format

## Digest

Technical specification for RFC 1924 Base85 IPv6 address encoding extracted from IETF documentation. Content includes mathematical foundations, character set design, encoding algorithms, security considerations, and practical examples. Provides fixed 20-character representation using carefully selected 85-character alphabet with detailed implementation guidance.

Retrieved: 2026-03-14
Sources: https://rfc-editor.org/rfc/rfc1924.html

Data size: Approximately 10KB of RFC specifications with mathematical examples and implementation details.

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