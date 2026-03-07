# Dense Binary-to-Text Encoding Library

A JavaScript library that explores the frontier of binary-to-text encoding density using printable characters. The benchmark: produce the shortest possible printable representation of a v7 UUID.

## Features

- **Multiple Encodings**: Base62, Base85, Base91 with progressively higher bit densities
- **UUID Optimization**: Specialized functions for encoding UUIDs with maximum compression  
- **Round-trip Correctness**: Guaranteed `decode(encode(x)) === x` for all inputs
- **Custom Encodings**: Create your own encodings from any character set
- **Safe Characters**: No control characters or ambiguous symbols

## Installation

```bash
npm install @xn-intenton-z2a/repository0
```

## Quick Start

```javascript
import { encodeUUID, decodeUUID, listEncodings } from '@xn-intenton-z2a/repository0';

// Encode a UUID with maximum density
const uuid = '550e8400-e29b-41d4-a716-446655440000';
const encoded = encodeUUID(uuid, 'base91');
console.log(encoded); // 20 chars vs 24 for base64

// Decode it back
const decoded = decodeUUID(encoded, 'base91');
console.log(decoded === uuid); // true

// See all available encodings
console.log(listEncodings());
```

## UUID Encoding Comparison

| Encoding | Characters | Bits/Char | UUID Length | vs Base64 |
|----------|-----------|-----------|-------------|-----------|
| Base64   | 64        | 6.00      | 24 chars    | baseline  |
| Base62   | 62        | 5.95      | 22 chars    | 8% shorter |
| Base85   | 85        | 6.41      | 20 chars    | 17% shorter |
| Base91   | 91        | 6.50      | 20 chars    | 17% shorter |

## API Reference

### Core Functions

#### `encode(buffer, encoding)`
Encode arbitrary binary data using a named encoding.

```javascript
import { encode } from '@xn-intenton-z2a/repository0';

const data = Buffer.from('Hello, World!');
const encoded = encode(data, 'base91');
```

#### `decode(str, encoding)`
Decode a string back to binary data.

```javascript
import { decode } from '@xn-intenton-z2a/repository0';

const buffer = decode(encoded, 'base91');
console.log(buffer.toString()); // "Hello, World!"
```

### UUID Functions

#### `encodeUUID(uuid, encoding = 'base91')`
Encode a UUID string (strips dashes, encodes the 16 bytes).

```javascript
import { encodeUUID } from '@xn-intenton-z2a/repository0';

// With or without dashes
const encoded1 = encodeUUID('550e8400-e29b-41d4-a716-446655440000');
const encoded2 = encodeUUID('550e8400e29b41d4a716446655440000');
```

#### `decodeUUID(str, encoding = 'base91')`
Decode a UUID from an encoded string.

```javascript
import { decodeUUID } from '@xn-intenton-z2a/repository0';

const uuid = decodeUUID(encoded); // Returns with dashes
```

### Encoding Management

#### `createEncoding(name, charset)`
Create a custom encoding from a character set.

```javascript
import { createEncoding, encode } from '@xn-intenton-z2a/repository0';

createEncoding('base16', '0123456789ABCDEF');
const hex = encode(Buffer.from([0x1A, 0x2B]), 'base16'); // "1A2B"
```

#### `listEncodings()`
Get metadata for all available encodings.

```javascript
import { listEncodings } from '@xn-intenton-z2a/repository0';

const encodings = listEncodings();
/*
[
  {
    name: 'base62',
    charset: '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ',
    base: 62,
    bitsPerChar: 5.954196310386876,
    uuidLength: 22
  },
  // ...
]
*/
```

## Built-in Encodings

### Base62 (`base62`)
- **Characters**: `0-9a-zA-Z` (62 total)
- **Bit Density**: ~5.95 bits/char
- **UUID Length**: 22 characters
- **Use Case**: URL-safe, widely compatible

### Base85 (`base85`)  
- **Characters**: Z85 variant with printable ASCII
- **Bit Density**: ~6.41 bits/char
- **UUID Length**: 20 characters
- **Use Case**: Higher density, still human-readable

### Base91 (`base91`)
- **Characters**: 91 printable ASCII characters
- **Bit Density**: ~6.50 bits/char  
- **UUID Length**: 20 characters
- **Use Case**: Maximum density while avoiding ambiguous characters

## Round-trip Guarantees

All encodings maintain the round-trip property:

```javascript
import { encode, decode } from '@xn-intenton-z2a/repository0';

function testRoundTrip(data, encoding) {
  const encoded = encode(data, encoding);
  const decoded = decode(encoded, encoding);
  return decoded.equals(data); // Always true
}

// Test with various data types
testRoundTrip(Buffer.from([0]), 'base62');           // true
testRoundTrip(Buffer.from([0xFF]), 'base85');        // true  
testRoundTrip(Buffer.from('Hello'), 'base91');       // true
testRoundTrip(crypto.randomBytes(100), 'base62');    // true
```

## CLI Usage

```bash
# Show version
node src/lib/main.js --version

# Show available encodings  
node src/lib/main.js --encodings

# Show library identity
node src/lib/main.js --identity
```

## Demo Website

Run the interactive demo to explore encoding comparisons:

```bash
npm start
```

Then open http://localhost:3000 to see:
- Live UUID encoding comparison
- Interactive binary data encoder
- Encoding statistics and metadata
- Real-time length and density calculations

## Development

```bash
# Install dependencies
npm install

# Run tests
npm test

# Run tests with coverage
npm run test:unit

# Build website
npm run build:web

# Start demo server
npm start
```

## Design Principles

1. **Density First**: Prioritize maximum information density per character
2. **Safety**: Avoid control characters and ambiguous symbols (0/O, 1/l/I)  
3. **Correctness**: Guarantee perfect round-trip encoding/decoding
4. **Flexibility**: Support custom character sets for specialized needs
5. **Performance**: Efficient BigInt-based conversion algorithms

## Character Set Design

Each encoding carefully selects characters to maximize density while avoiding:
- Control characters (`\0`, `\n`, `\t`, etc.)
- Ambiguous characters in many fonts (`0`/`O`, `1`/`l`/`I`)
- Characters that cause issues in common contexts (`"`, `'`, `\`, etc.)

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for development guidelines.

## Mission

This library demonstrates autonomous code evolution through GitHub Actions workflows. The source code in `src/lib/main.js` is continuously enhanced by automated agents to meet evolving requirements while maintaining backward compatibility.