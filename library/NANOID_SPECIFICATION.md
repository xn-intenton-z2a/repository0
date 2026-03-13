# NanoID Specification

## Table of Contents

1. Core Architecture and Design
2. Character Set and Alphabet
3. Security Implementation
4. Customization API Specifications
5. Performance Characteristics
6. Cross-Platform Implementation

## Core Architecture and Design

### Primary Specifications

- **Default Length**: 21 characters
- **Alphabet Size**: 64 characters (URL-safe Base64URL)
- **Collision Probability**: Similar to UUID v4 (126 vs 122 random bits)
- **Package Size**: 118 bytes (minified and Brotli compressed)
- **Dependencies**: Zero external dependencies

### Design Principles

**Cryptographic Security**:
- Hardware random number generator usage
- No predictable patterns in output
- Cluster-safe operation without coordination
- Uniform distribution across alphabet

**URL Safety**:
- No percent-encoding required
- Compatible with filenames across platforms
- Safe in web contexts without escaping
- Human-readable and typeable

**Compact Size**:
- Smaller than UUID (21 vs 36 characters)
- Reduced collision space while maintaining safety
- Optimal balance of length and entropy

## Character Set and Alphabet

### Default Alphabet (Base64URL)

The default NanoID alphabet contains 64 URL-safe characters:
```
ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_
```

**Character Categories**:
- Uppercase Letters: A-Z (26 characters)
- Lowercase Letters: a-z (26 characters)
- Digits: 0-9 (10 characters)
- URL-Safe Symbols: - (hyphen), _ (underscore) (2 characters)

### Alphabet Design Rationale

**URL Compatibility**:
- No + or / characters (replaced with - and _)
- No padding character = required
- Safe in query parameters without encoding
- Compatible with Base64URL standard (RFC 4648)

**Cross-Platform Safety**:
- Valid in filenames on all major operating systems
- No shell metacharacters or escape sequences
- JSON string compatible without escaping
- Database-safe without special handling

## Security Implementation

### Random Number Generation

**Node.js Environment**:
- Uses crypto.randomBytes() for hardware entropy
- Cryptographically secure pseudo-random number generator
- Non-blocking operation in most cases
- Cluster-safe without shared state

**Browser Environment**:
- Uses Web Crypto API (crypto.getRandomValues())
- Hardware-based random number generation
- Synchronous operation
- Cross-origin compatible

### Uniformity Guarantees

**Distribution Testing**:
- Uniform distribution across entire alphabet
- No bias toward specific characters
- Statistical validation of randomness
- Rejection of predictable patterns

**Algorithm Design**:
- Avoids modulo bias in character selection
- Uses rejection sampling for uniform distribution
- Cryptographically secure bit manipulation
- No correlation between adjacent characters

### Collision Resistance

**Entropy Calculation**:
- 21 characters × log2(64) = 126 bits of entropy
- Comparable to UUID v4 (122 effective bits)
- Birthday paradox threshold: ~5.4 × 10^18 IDs for 50% collision probability
- Production safe threshold: ~10^12 IDs for negligible collision risk

## Customization API Specifications

### Custom Alphabet Function

```typescript
function customAlphabet(alphabet: string, defaultSize: number): (size?: number) => string
```

**Parameters**:
- `alphabet`: String containing custom character set (max 256 characters)
- `defaultSize`: Default ID length when size not specified
- Returns: Function to generate IDs with custom configuration

**Constraints**:
- Alphabet must contain ≤ 256 unique characters
- No duplicate characters allowed in alphabet
- Empty alphabet throws error
- Security guaranteed only for alphabets ≤ 256 characters

### Custom Random Generator Function

```typescript
function customRandom(alphabet: string, size: number, random: (bytes: number) => Uint8Array): () => string
```

**Parameters**:
- `alphabet`: Character set for ID generation
- `size`: Fixed ID length
- `random`: Function returning random byte array of specified size
- Returns: Function generating IDs with custom randomness source

**Random Function Requirements**:
- Must return Uint8Array of requested length
- Values should be uniformly distributed 0-255
- Should provide cryptographic quality randomness for security
- Called once per ID generation with calculated byte count

### Non-Secure Variant

```typescript
import { nanoid } from 'nanoid/non-secure'
```

**Characteristics**:
- Uses Math.random() instead of crypto API
- Faster generation for non-security-critical use cases
- Not suitable for cryptographic applications
- Deterministic with Math.random() seed manipulation

## Performance Characteristics

### Benchmark Results (Framework 13 7840U, Node.js 21.6)

```
crypto.randomUUID          7,619,041 ops/sec
uuid v4                    7,436,626 ops/sec  
nanoid                     3,693,964 ops/sec
customAlphabet             2,799,255 ops/sec
nanoid for browser           380,915 ops/sec
nanoid/non-secure          2,226,483 ops/sec
```

### Performance Factors

**Speed Considerations**:
- Random number generation is primary bottleneck
- Custom alphabets require additional character mapping
- Browser performance limited by Web Crypto API
- Non-secure variant significantly faster

**Memory Usage**:
- Minimal memory footprint
- No persistent state between calls
- Garbage collection friendly
- Suitable for high-frequency generation

## Cross-Platform Implementation

### JavaScript API Specification

#### Basic Usage
```typescript
import { nanoid } from 'nanoid'
const id = nanoid() // => "V1StGXR8_Z5jdHi6B-myT"
```

#### Size Customization
```typescript
const shortId = nanoid(10) // => "IRFa-VaY2b"
```

#### Custom Alphabet
```typescript
import { customAlphabet } from 'nanoid'
const nanoid = customAlphabet('1234567890abcdef', 10)
const id = nanoid() // => "4f90d13a42"
```

### Platform Implementations

**Available Languages**: 20+ programming languages including:
- C, C++, C#, Java, Python, Go, Rust
- Elixir, Clojure, Ruby, PHP, Swift
- Specialized implementations for databases (MySQL, PostgreSQL)

**Implementation Requirements**:
- Same default alphabet and length
- Cryptographically secure random source
- Uniform distribution guarantee
- API compatibility where language permits

### React Integration Guidelines

**Incorrect Usage** (causes re-render issues):
```typescript
// DON'T: Generates new ID on every render
<li key={nanoid()}>{todo.text}</li>
```

**Correct Approach**:
- Use stable IDs from data source
- Generate IDs during data creation, not rendering
- For React 18+: use useId() hook for component-local IDs

## Reference Details

### Standards Compliance

- **Base64URL**: RFC 4648 alphabet subset
- **Web Crypto API**: W3C standard random generation
- **Node.js Crypto**: Standard library compatibility
- **Cross-Origin**: Compatible with all web security policies

### Security Validation

- **Entropy Testing**: Statistical validation of uniform distribution
- **Cryptographic Review**: Open source security analysis
- **Production Usage**: Widely deployed in production systems
- **Vulnerability Reporting**: Coordinated disclosure through Tidelift

### Integration Considerations

**Framework Compatibility**:
- React: Use for stable IDs, not render keys
- Node.js: Full crypto module support
- React Native: Requires polyfill for crypto support
- Browsers: Modern Web Crypto API support required

## Digest

Complete NanoID specification including cryptographic security model, URL-safe character set, customization APIs, and cross-platform implementation guidelines. Provides UUID v4-equivalent collision resistance in 21-character URL-safe format.

Retrieved: 2026-03-13
Sources: https://github.com/ai/nanoid

Data size: Approximately 15KB of documentation and API specifications consolidated into implementation reference.