# Binary-to-Text Encodings

## Table of Contents

1. Core Concepts and Principles
2. Encoding Efficiency Analysis
3. Common Use Cases and Requirements
4. Character Set Selection Criteria
5. Implementation Guidelines

## Core Concepts and Principles

Binary-to-text encoding represents binary data as printable ASCII characters, enabling transmission through text-only protocols and systems. The fundamental principle is converting arbitrary binary data into a restricted character set of printable characters.

### Key Technical Specifications

- Input: Arbitrary 8-bit byte sequences
- Output: Printable ASCII characters (typically 94 safe characters: 33-126)
- Purpose: Enable binary data transmission through 7-bit clean protocols
- Constraint: Systems designed for English language human-readable text

### Encoding Process

The general process involves grouping binary input bits and mapping them to a specific alphabet of printable characters. Each encoding scheme defines:

- Group size (number of input bits processed together)
- Output characters per group
- Specific alphabet mapping
- Padding mechanism (if applicable)

## Encoding Efficiency Analysis

Efficiency is calculated as the ratio between input bits and output bits: log2(n)/8 where n is the number of possible input values represented by one output character.

### Efficiency Table

| Encoding | Efficiency | Characters | Input Bits | Output Chars | Overhead |
|----------|------------|------------|------------|--------------|----------|
| Base16   | 50%        | 16         | 4          | 1            | 100%     |
| Base32   | 62.5%      | 32         | 5          | 1            | 60%      |
| Base36   | 64.6%      | 36         | ~5.17      | 1            | 54.7%    |
| Base45   | 68.6%      | 45         | ~5.49      | 1            | 45.7%    |
| Base58   | 73.2%      | 58         | ~5.86      | 1            | 36.6%    |
| Base62   | 74.4%      | 62         | ~5.95      | 1            | 34.4%    |
| Base64   | 75%        | 64         | 6          | 1            | 33.3%    |
| Ascii85  | 80%        | 85         | ~6.41      | 1            | 25%      |
| Base91   | 81.3%      | 91         | ~6.51      | 1            | 23%      |
| Base94   | 81.9%      | 94         | ~6.55      | 1            | 22%      |

## Common Use Cases and Requirements

### Email and NNTP Transmission

Requirements:
- 7-bit clean character transmission
- Line length limitations (often 76 characters for MIME, 64 for PEM)
- Avoidance of control characters
- Whitespace preservation concerns

### URL and Filename Safety

Requirements:
- No characters with special filesystem meaning
- URL-safe character sets
- Case-insensitive operation capability
- No ambiguous character pairs (0/O, 1/I/l)

### Programming Language Compatibility

Requirements:
- No characters requiring escaping in common languages
- Safe for JSON strings
- Compatible with shell commands
- Database field safety

## Character Set Selection Criteria

### Safety Classifications

**Always Safe**: Alphanumeric characters (0-9, A-Z, a-z) - 62 characters
**Often Safe**: Basic punctuation (+, -, _, =) - varies by application
**Context Dependent**: Mathematical symbols, brackets, quotes
**Problematic**: Control characters, whitespace, language-specific symbols

### Excluded Character Patterns

Common exclusions and reasons:
- Quotes (' ") - allow quoting of encoded strings
- Comma (,) - enable list representation
- Period (.) - sentence termination without quoting
- Slash (/) - CIDR notation support
- Colon (:) - avoid conflicts with IPv6, URLs
- Brackets ([ ]) - enable address delimiting
- Backslash (\) - escape character complications

## Implementation Guidelines

### Encoding Process Steps

1. Group input bytes according to scheme requirements
2. Convert grouped bytes to integer representation
3. Apply base conversion mathematics
4. Map result digits to character alphabet
5. Apply padding rules if necessary

### Padding Mechanisms

**Base64 Padding**: Uses '=' character, pad bits must be zero
**Base32 Padding**: Uses '=' character, multiple padding scenarios
**No Padding**: Some schemes calculate exact character requirements

### Canonical Encoding Requirements

- Pad bits must be set to zero
- Consistent character case handling
- Standardized whitespace treatment
- Deterministic encoding of identical inputs

### Error Handling

- Reject characters outside defined alphabet
- Handle padding validation
- Manage truncated input gracefully
- Validate character sequence integrity

## Reference Details

### Standards Documentation

- RFC 4648: Base16, Base32, Base64 standard encodings
- RFC 1924: Base85 IPv6 address representation
- Adobe specifications: Ascii85 in PostScript and PDF

### Implementation Considerations

- Alphabet size must be ≤ 256 for security guarantees
- Hardware random generation preferred for secure applications
- Uniform distribution testing for custom implementations
- Cross-platform compatibility validation

## Digest

Technical specifications for binary-to-text encoding schemes extracted from Wikipedia and RFC documentation. Content includes efficiency calculations, character set selection criteria, implementation guidelines, and standards compliance requirements.

Retrieved: 2026-03-13
Sources: https://en.wikipedia.org/wiki/Binary-to-text_encoding, https://tools.ietf.org/rfc/rfc4648.txt

Data size: Approximately 45KB of technical documentation condensed into focused implementation guidance.