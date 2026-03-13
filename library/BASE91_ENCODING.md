# Base91 Encoding

## Table of Contents

1. Encoding Efficiency and Performance
2. Implementation Specifications
3. Variable vs Fixed Width Variants
4. Algorithm Design and Mathematics
5. Character Set and Safety Features

## Encoding Efficiency and Performance

### Performance Characteristics

Base91 provides superior efficiency compared to traditional encodings:
- **Efficiency**: 81.3% (approximately 14-23% overhead)
- **Overhead Range**: Variable depending on input data characteristics
- **Optimal Case**: 14% overhead for suitable input patterns
- **Worst Case**: 23% overhead for problematic patterns

### Efficiency Comparison

| Encoding | Efficiency | Overhead | Use Case |
|----------|------------|----------|----------|
| Base64   | 75.0%      | 33.3%    | Standard web/email |
| Base85   | 80.0%      | 25.0%    | PostScript/PDF |
| Base91   | 81.3%      | 18.5%    | Optimal compression |
| Base94   | 81.9%      | 22.1%    | Theoretical maximum |

### Performance Factors

**Input Data Dependencies**:
- Bit distribution affects efficiency
- Sequential patterns impact compression
- Random data approaches average efficiency
- Specific byte sequences may trigger optimal paths

## Implementation Specifications

### basE91 (Variable Width) Implementation

**Core Algorithm Features**:
- Variable-length encoding depending on input
- Adaptive bit accumulation
- Dynamic output character generation
- State-dependent encoding process

**Processing State**:
- Bit accumulator with variable length
- Current bit count tracker
- Output character buffer
- End-of-stream handling

### Base91 (Constant Width) Implementation

**Fixed Processing**:
- Consistent character output per input block
- Predictable memory requirements
- Simplified implementation logic
- Regular encoding patterns

## Variable vs Fixed Width Variants

### basE91 Variable Width Characteristics

**Algorithm Properties**:
- Accumulates input bits in variable-length buffer
- Generates output characters when sufficient bits available
- Final output length depends on bit alignment
- Requires state management for streaming

**Memory Usage**:
- Input-dependent buffer sizes
- Unpredictable intermediate storage
- Complex memory management for streaming
- State preservation required between blocks

**Performance Trade-offs**:
- Better compression for specific input patterns
- Higher implementation complexity
- Variable processing time per input byte
- Optimal efficiency when input aligns favorably

### Base91 Constant Width Characteristics

**Algorithm Properties**:
- Fixed input block processing
- Predictable output character count
- Consistent memory requirements
- Simplified state management

**Implementation Benefits**:
- Easier to implement correctly
- Predictable performance characteristics
- Straightforward memory allocation
- Better suited for embedded systems

## Algorithm Design and Mathematics

### Mathematical Foundation

Base91 uses 91 distinct characters, providing:
- **Character Space**: 91 symbols
- **Bits per Character**: log2(91) ≈ 6.51 bits
- **Theoretical Efficiency**: 6.51/8 = 81.3%

### Encoding Process Overview

#### Bit Accumulation Phase

1. **Input Processing**: Read input bytes sequentially
2. **Bit Accumulation**: Add bits to accumulator buffer
3. **Threshold Check**: Monitor accumulator bit count
4. **Character Generation**: Extract characters when possible

#### Character Extraction Logic

- **Minimum Threshold**: Wait for sufficient bits
- **Character Mapping**: Map bit patterns to character set
- **Buffer Management**: Remove used bits from accumulator
- **Continuation**: Repeat until input exhausted

#### Finalization Process

- **Remaining Bits**: Handle incomplete accumulator
- **Padding Considerations**: No explicit padding used
- **State Finalization**: Ensure complete output generation

### Variable Length Encoding Details

The basE91 variant adjusts output based on bit patterns:
- **Short Patterns**: May produce fewer characters
- **Long Patterns**: May require additional characters
- **Bit Alignment**: Efficiency depends on input alignment
- **State Carryover**: Incomplete bits affect next blocks

## Character Set and Safety Features

### Character Selection Criteria

Base91 character set designed for broad compatibility:
- **Printable ASCII**: All characters visible and typeable
- **Programming Safety**: Avoids problematic symbols in code
- **Shell Safety**: Compatible with command-line usage
- **URL Compatibility**: Generally safe in URL contexts

### Character Set Composition

**Included Characters**:
- Alphanumeric: A-Z, a-z, 0-9 (62 characters)
- Safe Punctuation: Selected symbols without special meanings
- Total Count: 91 distinct characters

**Excluded Characters**:
- Control characters (0-31, 127)
- Whitespace (space, tab, newline)
- Quote characters (' ")
- Shell metacharacters (`, \, |, etc.)
- Programming operators (+, -, *, /, etc.)

### Safety Considerations

**Cross-Platform Compatibility**:
- No platform-specific character interpretations
- Consistent rendering across systems
- Safe for file names in most filesystems
- Compatible with text-based protocols

**Programming Language Safety**:
- No string escape requirements
- Safe in JSON contexts
- Compatible with XML attributes
- No SQL injection concerns

## Reference Details

### Implementation Availability

**Programming Languages**:
- C: Original reference implementation
- C#, F#: .NET implementations
- Java: Multiple library implementations
- Rust: Crate ecosystem support
- PHP: Community implementations
- Assembly: Optimized variants
- AWK: Script-based implementations

### Performance Considerations

**Computational Complexity**:
- Linear time complexity O(n)
- Constant space overhead
- Bit manipulation intensive
- Platform-dependent optimization opportunities

**Memory Requirements**:
- Small constant memory overhead
- Streaming implementation possible
- No large lookup tables required
- Efficient for embedded systems

### Use Case Recommendations

**Optimal Applications**:
- High-efficiency binary encoding required
- Space-critical applications
- Streaming data processing
- Binary data in text protocols

**Alternative Considerations**:
- Base64 for standard compatibility
- Base85 for PostScript/PDF contexts
- Custom encodings for specific alphabets

## Digest

Base91 encoding specification providing 81.3% efficiency for binary-to-text conversion. Includes both variable-width (basE91) and constant-width implementations with detailed algorithm descriptions and character set specifications.

Retrieved: 2026-03-13
Sources: http://base91.sourceforge.net/

Data size: Approximately 2KB of technical specification expanded into comprehensive implementation guidance.