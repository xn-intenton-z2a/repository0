# Base62 Encoding

## Table of Contents

1. Character Set Specification
2. Alphabet Mapping Table
3. Efficiency Characteristics
4. Implementation Considerations
5. Comparison with Related Encodings

## Character Set Specification

Base62 represents arbitrary binary data using 62 printable ASCII characters: digits 0-9, uppercase letters A-Z, and lowercase letters a-z. This encoding scheme excludes special characters and punctuation to maximize compatibility across different systems and programming environments.

### Character Range Definition

- Digits: 0123456789 (10 characters)
- Uppercase: ABCDEFGHIJKLMNOPQRSTUVWXYZ (26 characters)  
- Lowercase: abcdefghijklmnopqrstuvwxyz (26 characters)
- Total: 62 characters

### Safety Characteristics

The Base62 alphabet contains only alphanumeric characters, making it:
- Safe for use in URLs and filenames
- Compatible with programming language identifiers
- Readable in case-sensitive and case-insensitive contexts
- Free of shell-escaping requirements

## Alphabet Mapping Table

| Value | Char | Value | Char | Value | Char | Value | Char |
|-------|------|-------|------|-------|------|-------|------|
| 0     | 0    | 16    | G    | 32    | W    | 48    | m    |
| 1     | 1    | 17    | H    | 33    | X    | 49    | n    |
| 2     | 2    | 18    | I    | 34    | Y    | 50    | o    |
| 3     | 3    | 19    | J    | 35    | Z    | 51    | p    |
| 4     | 4    | 20    | K    | 36    | a    | 52    | q    |
| 5     | 5    | 21    | L    | 37    | b    | 53    | r    |
| 6     | 6    | 22    | M    | 38    | c    | 54    | s    |
| 7     | 7    | 23    | N    | 39    | d    | 55    | t    |
| 8     | 8    | 24    | O    | 40    | e    | 56    | u    |
| 9     | 9    | 25    | P    | 41    | f    | 57    | v    |
| 10    | A    | 26    | Q    | 42    | g    | 58    | w    |
| 11    | B    | 27    | R    | 43    | h    | 59    | x    |
| 12    | C    | 28    | S    | 44    | i    | 60    | y    |
| 13    | D    | 29    | T    | 45    | j    | 61    | z    |
| 14    | E    | 30    | U    | 46    | k    |       |      |
| 15    | F    | 31    | V    | 47    | l    |       |      |

## Efficiency Characteristics

### Performance Metrics

- **Efficiency**: 74.4% (log₂(62)/8 ≈ 5.95/8)
- **Overhead**: 34.4% expansion from binary input
- **Bits per character**: ~5.95 bits encoded per output character
- **Character density**: Higher than Base64 alphabet utilization

### Encoding Mathematics

Base62 encoding efficiency calculation:
- Characters available: 62
- Bits representable per character: log₂(62) ≈ 5.95 bits
- Encoding efficiency: 5.95/8 = 74.4%
- Overhead ratio: (8 - 5.95)/5.95 ≈ 34.4%

## Implementation Considerations

### Encoding Algorithm

Base62 conversion follows standard base conversion principles:
1. Treat input binary data as large integer
2. Perform repeated division by 62
3. Map remainders to Base62 character alphabet
4. Reverse remainder sequence for final encoding

### Padding Requirements

Unlike Base64, Base62 typically does not use padding characters since 62 is not a power of 2. Implementation must handle:
- Variable-length output based on input
- Proper handling of leading zero preservation
- Deterministic encoding for identical inputs

### Character Case Sensitivity

Base62 implementations must preserve case sensitivity:
- Uppercase letters (A-Z) map to values 10-35
- Lowercase letters (a-z) map to values 36-61
- Case conversion changes encoded values
- Cross-platform case handling consistency required

## Comparison with Related Encodings

### Character Set Evolution

| Encoding | Characters | Notable Exclusions | Efficiency |
|----------|------------|-------------------|------------|
| Base58   | 58         | 0, O, I, l (ambiguous) | 73.2% |
| Base62   | 62         | Special characters only | 74.4% |
| Base64   | 64         | +, / (URL-problematic) | 75.0% |

### Use Case Positioning

Base62 fills the niche between Base58 and Base64:
- More efficient than Base58 (includes all alphanumeric)
- Safer than Base64 (excludes URL-problematic characters)
- Suitable for URL shorteners, identifiers, tokens
- Optimal for systems requiring alphanumeric-only output

### Academic and Standards Context

Base62 appears in academic literature for:
- Secure lossless compressed encoding (He et al., 2008)
- Multilingual identifier transformation (Wu, 2001)
- Alphanumeric identifier generation systems
- URL shortening and token generation applications

## Reference Details

### Research Citations

1. Kejing He, Xiancheng Xu, Qiang Yue (2008): "A secure, lossless, and compressed Base62 encoding" - IEEE Singapore International Conference on Communication Systems
2. Pei-Chi Wu (2001): "A base62 transformation format of ISO 10646 for multilingual identifiers" - Software: Practice and Experience

### Implementation Specifications

- Character set: 0-9, A-Z, a-z (62 total characters)
- Case sensitivity: Required for correct encoding/decoding
- Padding: Generally not used due to non-power-of-2 base
- Output length: Variable based on input size and value

## Digest

Technical specification for Base62 encoding extracted from Wikipedia documentation. Content includes complete character mapping table, efficiency calculations, implementation algorithms, and academic research context. Base62 provides alphanumeric-only encoding with 74.4% efficiency, suitable for URL-safe and programming-friendly applications.

Retrieved: 2026-03-14
Sources: https://en.wikipedia.org/wiki/Base62

Data size: Approximately 2KB of technical specifications and research references.

## Table of Contents

1. Character Alphabet and Mapping
2. Mathematical Foundations
3. Implementation Specifications
4. Use Cases and Applications
5. Security and Collision Considerations

## Character Alphabet and Mapping

Base62 uses 62 alphanumeric ASCII characters, providing a URL-safe and case-sensitive encoding.

### Complete Alphabet Table

| Value | Char | Value | Char | Value | Char | Value | Char |
|-------|------|-------|------|-------|------|-------|------|
| 0     | 0    | 16    | G    | 32    | W    | 48    | m    |
| 1     | 1    | 17    | H    | 33    | X    | 49    | n    |
| 2     | 2    | 18    | I    | 34    | Y    | 50    | o    |
| 3     | 3    | 19    | J    | 35    | Z    | 51    | p    |
| 4     | 4    | 20    | K    | 36    | a    | 52    | q    |
| 5     | 5    | 21    | L    | 37    | b    | 53    | r    |
| 6     | 6    | 22    | M    | 38    | c    | 54    | s    |
| 7     | 7    | 23    | N    | 39    | d    | 55    | t    |
| 8     | 8    | 24    | O    | 40    | e    | 56    | u    |
| 9     | 9    | 25    | P    | 41    | f    | 57    | v    |
| 10    | A    | 26    | Q    | 42    | g    | 58    | w    |
| 11    | B    | 27    | R    | 43    | h    | 59    | x    |
| 12    | C    | 28    | S    | 44    | i    | 60    | y    |
| 13    | D    | 29    | T    | 45    | j    | 61    | z    |
| 14    | E    | 30    | U    | 46    | k    |       |      |
| 15    | F    | 31    | V    | 47    | l    |       |      |

### Character Set Composition

- Digits: 0-9 (10 characters, values 0-9)
- Uppercase: A-Z (26 characters, values 10-35)
- Lowercase: a-z (26 characters, values 36-61)

## Mathematical Foundations

### Efficiency Calculation

Base62 efficiency = log2(62) / 8 = 5.954 / 8 = 74.4%

This means Base62 produces approximately 34.4% overhead compared to raw binary data.

### Conversion Process

#### Encoding Algorithm

1. Treat input binary data as a large integer (big-endian)
2. Repeatedly divide by 62, collecting remainders
3. Map each remainder to corresponding Base62 character
4. Reverse the order of characters for final result

#### Decoding Algorithm

1. Map each character to its numeric value using the alphabet
2. Calculate positional value: char_value × 62^position
3. Sum all positional values to reconstruct original integer
4. Convert integer back to binary representation

### Mathematical Properties

- Character space: 62 distinct symbols
- Bits per character: ≈5.954 bits
- Maximum integer for n characters: 62^n - 1
- Minimum characters for b bits: ⌈b / log2(62)⌉

## Implementation Specifications

### Encoding Function Signature

```
function base62Encode(input: Uint8Array): string
function base62Decode(input: string): Uint8Array
```

### Character Validation

Valid characters must be within the set: `0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz`

### Edge Cases

- Empty input produces empty output
- Single zero byte encodes to "0"
- Leading zero bytes affect output length
- Maximum input size limited by integer precision

### Error Conditions

- Invalid characters in input string
- Numeric overflow in large inputs
- Malformed input sequences

## Use Cases and Applications

### URL Shortening Services

Base62 provides compact, URL-safe identifiers:
- No URL encoding required
- Case-sensitive unique identifiers
- Sequential or random ID generation
- Database primary key encoding

### User-Friendly Identifiers

Characteristics that make Base62 suitable:
- No ambiguous character pairs (unlike Base58)
- All alphanumeric characters included
- Readable and typeable
- Case-sensitive differentiation

### Data Compression

Efficiency characteristics:
- Better than Base32 (62.5% efficiency)
- Slightly worse than Base64 (75% efficiency)
- Balanced between compactness and readability

## Security and Collision Considerations

### Randomness Requirements

For secure random IDs:
- Use cryptographically secure random number generators
- Ensure uniform distribution across character space
- Consider birthday paradox for collision probability

### Collision Probability

For random Base62 strings of length n:
- Total possible strings: 62^n
- Collision probability follows birthday paradox
- Safe range approximately: 1.2 × √(62^n) unique IDs

### Length Recommendations

- 6 characters: 56.8 billion possibilities
- 8 characters: 218.3 trillion possibilities
- 10 characters: 839.3 quadrillion possibilities

### Security Considerations

- Predictable patterns in input create predictable output
- Sequential inputs produce observable patterns
- Time-based seeds may be predictable
- Consider cryptographic hashing before encoding

## Reference Details

### Implementation Libraries

Available in multiple programming languages:
- Python: pybase62 package
- Rust: base62 crate
- JavaScript: custom implementations widely available
- Go: Various third-party libraries

### Standards Compliance

No formal RFC standard exists for Base62, but implementations generally follow consistent conventions for character ordering and mathematical operations.

### Performance Characteristics

- Encoding speed depends on integer arithmetic efficiency
- Memory usage scales with input size
- No significant computational overhead compared to other base encodings

## Digest

Base62 encoding specifications including complete character mapping, mathematical foundations, and implementation guidelines. Provides 74.4% efficiency encoding arbitrary binary data using alphanumeric characters. Commonly used for URL shortening and human-readable identifiers.

Retrieved: 2026-03-13
Sources: https://en.wikipedia.org/wiki/Base62

Data size: Approximately 3KB of technical specification consolidated into implementation-ready format.