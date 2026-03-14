# NanoID Specification

## Table of Contents

1. Unique String ID Generation Overview
2. Security and Randomness Requirements
3. URL-Safe Alphabet and Character Selection
4. API Specifications and Usage Patterns
5. Performance Benchmarks and Comparisons
6. Implementation Variants and Customization

## Unique String ID Generation Overview

### Core Design Principles

NanoID provides secure, URL-friendly unique string ID generation with:
- **Compact size**: 118 bytes (minified and brotlied) with zero dependencies
- **Hardware security**: Uses hardware random generator for cryptographic strength
- **Shorter IDs**: Reduced from UUID's 36 characters to 21 characters default
- **Broad portability**: Ported to over 20 programming languages

### Efficiency Improvements over UUID

**Size Comparison**:
- **UUID v4**: 36 characters using limited character set
- **NanoID**: 21 characters using expanded character set
- **Character set**: A-Za-z0-9_- (64 characters vs UUID's effective alphabet)
- **Implementation**: 4x smaller than uuid/v4 package (130 vs 423 bytes)

### Collision Probability Analysis

NanoID provides comparable collision resistance to UUID v4:
- **Random bits**: 126 in NanoID vs 122 in UUID v4
- **Collision threshold**: One in billion chance requires 103 trillion IDs
- **Practical safety**: Sufficient for distributed systems and high-volume generation
- **Mathematical foundation**: Birthday paradox calculations confirm safety margins

## Security and Randomness Requirements

### Hardware Random Generation

**Unpredictability Sources**:
- **Node.js**: crypto module for server-side generation
- **Browser**: Web Crypto API for client-side generation
- **Hardware basis**: Both use unpredictable hardware random generators
- **Avoids Math.random()**: Eliminates predictable pseudo-random vulnerabilities

### Uniform Distribution Requirements

**Algorithm Design**:
- **Avoids modulo bias**: Does not use simple `random % alphabet` approach
- **Uniform distribution**: Each character has equal probability of selection
- **Brute force resistance**: Uniform distribution maximizes entropy per character
- **Testing verification**: Distribution uniformity validated through statistical tests

### Security Vulnerability Management

**Responsible Disclosure**:
- **Security contact**: Tidelift security coordination
- **Vulnerability reporting**: Coordinated fix and disclosure process
- **Code documentation**: All implementation details documented in source
- **Audit trail**: Security decisions and trade-offs explicitly documented

## URL-Safe Alphabet and Character Selection

### Default Character Set

NanoID uses 64 URL-safe characters:
```
A-Z (26 uppercase letters)
a-z (26 lowercase letters)  
0-9 (10 digits)
_ (underscore)
- (hyphen)
```

### Character Exclusion Rationale

**Problematic characters avoided**:
- **+ and /**: Base64 characters problematic in URLs
- **Ambiguous pairs**: No 0/O or 1/I/l confusion (unlike some alternatives)
- **Special symbols**: Avoids characters requiring URL encoding
- **Whitespace**: No spaces or control characters

### Safety Characteristics

**Cross-platform compatibility**:
- **Filesystem safe**: Works in filenames across operating systems
- **URL safe**: No percent-encoding required in URLs
- **Programming safe**: Safe in strings without escaping
- **Database safe**: Works in database identifiers and queries

## API Specifications and Usage Patterns

### Core API Functions

**Basic Generation**:
```javascript
import { nanoid } from 'nanoid'
const id = nanoid() // => "V1StGXR8_Z5jdHi6B-myT"
```

**Custom Length**:
```javascript
const shortId = nanoid(10) // => "IRFa-VaY2b"
```

**Non-Secure Variant**:
```javascript
import { nanoid } from 'nanoid/non-secure'
const id = nanoid() // => "Uakgb_J5m9g-0JDMbcJqLJ"
```

### Customization APIs

**Custom Alphabet**:
```javascript
import { customAlphabet } from 'nanoid'
const nanoid = customAlphabet('1234567890abcdef', 10)
const id = nanoid() // => "4f90d13a42"
```

**Custom Random Generator**:
```javascript
import { customRandom } from 'nanoid'
const nanoid = customRandom('abcdef', 10, size => {
  return (new Uint8Array(size)).map(() => 256 * rng())
})
```

### Safety Requirements

**Alphabet Size Limits**:
- **Maximum characters**: 256 symbols or fewer
- **Security guarantee**: Larger alphabets compromise internal algorithm security
- **Collision calculator**: Tool available for safety verification
- **Length recommendations**: Balance between collision resistance and practicality

## Performance Benchmarks and Comparisons

### Benchmark Results (Node.js 21.6, Framework 13 7840U)

**Secure Generation**:
```
crypto.randomUUID          7,619,041 ops/sec
uuid v4                    7,436,626 ops/sec
@napi-rs/uuid              4,730,614 ops/sec
uid/secure                 4,729,185 ops/sec
@lukeed/uuid               4,015,673 ops/sec
nanoid                     3,693,964 ops/sec
customAlphabet             2,799,255 ops/sec
nanoid for browser           380,915 ops/sec
secure-random-string         362,316 ops/sec
uid-safe.sync                354,234 ops/sec
shortid                       38,808 ops/sec
```

**Non-Secure Generation**:
```
uid                       11,872,105 ops/sec
nanoid/non-secure          2,226,483 ops/sec
rndm                       2,308,044 ops/sec
```

### Performance Analysis

**Secure vs Non-Secure**:
- **Security trade-off**: 5x slower for cryptographic security
- **Blocking risk**: Hardware random generation may block CPU briefly
- **Production recommendation**: Use secure version for production systems
- **Development usage**: Non-secure acceptable for non-critical applications

**Competitive Position**:
- **vs UUID libraries**: Comparable performance with additional features
- **vs shortid**: 95x faster while maintaining security
- **vs custom generators**: Good balance of performance and safety

## Implementation Variants and Customization

### Environment-Specific Implementations

**React Integration**:
- **Key generation**: Safe for React component keys
- **State management**: Suitable for dynamic element identification
- **Server-side rendering**: Consistent generation across environments

**React Native**:
- **Mobile compatibility**: Works in React Native applications
- **Performance considerations**: Hardware random generation on mobile devices
- **Cross-platform consistency**: Same API across iOS and Android

**CLI Usage**:
```bash
npx nanoid        # Generate single ID
npx nanoid --size 10  # Custom length
npx nanoid --alphabet 1234567890abcdef  # Custom alphabet
```

### Multi-Language Support

**Available Implementations**:
- **JavaScript**: Original implementation with full features
- **TypeScript**: Full type definitions and support
- **Python**: pythonic API with same security guarantees
- **Go**: High-performance implementation
- **Rust**: Memory-safe implementation
- **C++**: Systems programming support
- **20+ others**: Consistent API across language ecosystem

### Integration Patterns

**Database Usage**:
- **Primary keys**: Suitable for database primary key generation
- **URL parameters**: Safe in query strings and path components  
- **API tokens**: Appropriate for non-cryptographic token generation
- **Session identifiers**: Suitable for session management

**Framework Integration**:
- **PouchDB/CouchDB**: Document ID generation
- **Express.js**: Request ID and session management
- **Next.js**: Static site generation with unique identifiers
- **Various frameworks**: Consistent behavior across JavaScript ecosystem

## Reference Details

### Project Information

- **Creator**: Andrey Sitnik (@ai)
- **Organization**: Evil Martians (product consulting for developer tools)
- **Repository**: https://github.com/ai/nanoid
- **License**: MIT License
- **Package size**: 118 bytes (minified and brotlied)

### Distribution Channels

**NPM Installation**:
```bash
npm install nanoid
```

**JSR (JavaScript Registry)**:
```bash
npx jsr add @sitnik/nanoid
```

**CDN Usage**:
```javascript
import { nanoid } from 'https://cdn.jsdelivr.net/npm/nanoid/nanoid.js'
```

### Quality Assurance

**Size Monitoring**: Size Limit tool controls package size growth
**Security Auditing**: Tidelift security vulnerability coordination
**Distribution Testing**: Uniformity validation through statistical analysis
**Cross-Platform Testing**: Verification across supported environments

## Digest

Complete technical specification for NanoID unique string ID generator extracted from GitHub project documentation. Content includes security requirements, API specifications, performance benchmarks, implementation variants, and multi-language support details. Provides 126-bit entropy in 21-character URL-safe format with hardware random generation and extensive ecosystem support.

Retrieved: 2026-03-14
Sources: https://github.com/ai/nanoid

Data size: Approximately 10KB of project documentation and technical specifications.

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