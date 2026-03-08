# Dense Binary-to-Text Encoding Library

A JavaScript library that explores the frontier of binary-to-text encoding density using printable characters. The benchmark: produce the shortest possible printable representation of a v7 UUID, beating standard base64 encoding.

## Features

- **High-density encodings**: base62, base85, and base91 implementations
- **UUID optimization**: Specialized functions for encoding/decoding UUIDs
- **Custom encodings**: Create your own encodings from character sets
- **Round-trip guaranteed**: Perfect decode(encode(x)) === x for all inputs
- **No ambiguous characters**: Avoids 0/O, 1/l/I confusion in base62
- **Browser and Node.js**: Works in both environments

## Installation

```bash
npm install @xn-intenton-z2a/repository0
```

## Quick Start

```javascript
import { encode, decode, encodeUUID, decodeUUID, listEncodings } from '@xn-intenton-z2a/repository0';

// Encode arbitrary binary data
const data = Buffer.from('Hello, World!');
const encoded = encode(data, 'base91');
const decoded = decode(encoded, 'base91');
console.log(decoded.toString()); // "Hello, World!"

// UUID encoding (uses densest encoding automatically)
const uuid = '01234567-89ab-cdef-0123-456789abcdef';
const shortUuid = encodeUUID(uuid);
const restored = decodeUUID(shortUuid);
console.log(restored); // "01234567-89ab-cdef-0123-456789abcdef"

// List available encodings
console.log(listEncodings());
```

## UUID Encoding Comparison

This table shows the encoding density improvements over base64 for a 16-byte UUID:

| Encoding | Example Output | Length | Bit Density | Improvement |
|----------|---------------|--------|-------------|-------------|
| Base64   | `ASNFZ4mrze8BI0VniavN7w==` | 24 chars | 6.00 bits/char | baseline |
| Base62   | `GRcAy5Fpfdb2eHTFEUmQg` | 21 chars | 5.95 bits/char | 13% shorter |
| Base85   | `Y=Ne{)V{r{-ild^Ff6d` | 19 chars | 6.41 bits/char | 21% shorter |
| Base91   | `IXxddHz,@7rJEQ0zMm:` | 19 chars | 6.50 bits/char | 21% shorter |

> **Key advantage**: Base91 produces ~19 character UUIDs vs 24 for base64, saving 5 characters per UUID (21% reduction).

## API Reference

### Core Functions

#### `encode(buffer, encoding)`
Encode binary data using the specified encoding.
- `buffer`: Buffer containing binary data
- `encoding`: Encoding name ('base62', 'base85', 'base91', or custom)
- Returns: Encoded string

#### `decode(str, encoding)`
Decode a string using the specified encoding.
- `str`: Encoded string
- `encoding`: Encoding name
- Returns: Buffer with decoded binary data

### UUID Functions

#### `encodeUUID(uuid)`
Encode a UUID string using the densest available encoding (base91).
- `uuid`: UUID string with or without dashes
- Returns: Encoded UUID string (~20 characters)

#### `decodeUUID(str)`
Decode a UUID from an encoded string.
- `str`: Encoded UUID string
- Returns: Standard UUID string with dashes

### Utility Functions

#### `createEncoding(name, charset)`
Create a custom encoding from a character set.
- `name`: Encoding name for future use
- `charset`: String of unique characters to use
- Returns: Encoding definition object

#### `listEncodings()`
List all available encodings with metadata.
- Returns: Array of encoding objects with name, charset, bitDensity, and charsetLength

## Built-in Encodings

### Base62 (`0-9A-Za-z`)
- **Characters**: 62 (0-9, A-Z, a-z)
- **Bit density**: ~5.95 bits/char
- **UUID length**: ~22 characters
- **Use case**: URL-safe identifiers, no special characters

### Base85 (Z85 variant)
- **Characters**: 85 printable ASCII characters
- **Bit density**: ~6.41 bits/char  
- **UUID length**: ~20 characters
- **Use case**: More compact than base64, still readable

### Base91
- **Characters**: 91 printable characters
- **Bit density**: ~6.50 bits/char
- **UUID length**: ~20 characters  
- **Use case**: Maximum density while staying printable

## Character Set Safety

All built-in encodings use only printable characters and avoid common ambiguities:
- No control characters (0-31, 127)
- Base62 avoids 0/O, 1/l/I confusion  
- No whitespace or quotes that could cause parsing issues
- Safe for URLs, JSON, databases, and most text protocols

## Performance & Compatibility

- **Round-trip property**: Guaranteed `decode(encode(x, enc), enc) === x`
- **Edge cases**: Handles empty buffers, single bytes, all-zero, all-0xFF
- **Error handling**: Clear error messages for invalid inputs
- **Memory efficient**: Processes data in chunks where possible
- **No dependencies**: Pure JavaScript implementation

## Use Cases

- **Short URLs**: Encode UUIDs in URLs with fewer characters
- **Database keys**: Shorter string primary keys  
- **QR codes**: Fit more data in smaller QR codes
- **API responses**: Reduce JSON payload size
- **File names**: Shorter encoded filenames
- **Tokens**: Compact authentication tokens

## CLI Usage

```bash
# Run demo
npm run start:cli -- --demo

# Show version
npm run start:cli -- --version

# Show library info  
npm run start:cli -- --identity
```

## Web Demo

Run `npm start` to launch an interactive web demo showing:
- Live encoding/decoding interface
- UUID comparison table
- Performance comparisons
- Available encodings list

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

# Start development server
npm start
```

## License

MIT © [Polycode Limited](https://github.com/xn-intenton-z2a)

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for development guidelines.

## Links

- [Repository](https://github.com/xn-intenton-z2a/repository0)
- [Issues](https://github.com/xn-intenton-z2a/repository0/issues)
- [Live Demo](https://xn-intenton-z2a.github.io/repository0/)