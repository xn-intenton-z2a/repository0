BUFFER_NODE

Table of contents
- Buffer creation and allocation
- Buffer length and byte access
- Converting between strings and buffers (encoding)
- Integer read/write helpers (endian-aware methods)
- Slicing, copy and fill
- Use-cases for bitwise operations and population counts

Normalised extract
Buffer creation and allocation
- Buffer.from(source[, encoding]) accepts String, ArrayBuffer, TypedArray, Array, or Buffer and returns a new Buffer containing a copy of the provided data.
- Buffer.alloc(size[, fill[, encoding]]) returns a zero-filled Buffer of length size; use to avoid uninitialized memory.
- Buffer.allocUnsafe(size) and Buffer.allocUnsafeSlow(size) allocate without zero-fill for performance; must be overwritten before use to avoid leaking sensitive data.

Buffer length and byte access
- Buffer.length is the number of bytes in the Buffer.
- Access bytes by index: buffer[i] returns a number 0..255. Assign similarly.
- For iterating bytes, use for (const byte of buffer) to get numeric values.

Converting between strings and buffers (encoding)
- Buffer.from(string, encoding='utf8') encodes string to bytes using specified encoding ('utf8', 'ascii', 'base64', 'hex', etc.).
- buffer.toString([encoding[, start[, end]]]) decodes bytes to string using encoding; default 'utf8'.

Integer read/write helpers (endian-aware methods)
- Methods: readUIntLE/BE(offset, byteLength), readIntLE/BE(offset, byteLength), writeUIntLE/BE(value, offset, byteLength), writeIntLE/BE(...).
- For standard 32-bit/64-bit operations use readUInt32LE/BE and writeUInt32LE/BE.
- These methods throw if offset/length out of range.

Slicing, copy and fill
- buffer.slice(start, end) returns a view referencing the same memory (no copy). Use Buffer.from(slice) to copy.
- buffer.copy(target[, targetStart[, sourceStart[, sourceEnd]]]) copies bytes to target Buffer.
- buffer.fill(value[, offset[, end]][, encoding]) fills bytes with value (number, Buffer or string).

Use-cases for bitwise operations and population counts
- To compute bit-level Hamming distance between integers stored in Buffers, XOR corresponding bytes and count set bits per byte.
- For performance, use a precomputed 256-entry table mapping byte->popcount or use Kernighan's algorithm on 32/64-bit integers read with readUInt32*/64*.

Supplementary details
- Encoding pitfalls: multi-code-point Unicode characters may span multiple bytes in UTF-8; to compare Unicode code points use String iteration or codePointAt rather than Buffer byte comparison.
- Endianness: multi-byte integer read/write require explicit LE/BE choice; choose consistently across read/write.
- Safety: avoid Buffer.allocUnsafe for data derived from untrusted sources unless immediately overwritten.

Reference details (API signatures)
- Buffer.from(arrayBuffer[, byteOffset[, length]]) -> Buffer
- Buffer.from(string[, encoding]) -> Buffer
- Buffer.alloc(size[, fill[, encoding]]) -> Buffer
- Buffer.allocUnsafe(size) -> Buffer
- buffer.toString([encoding='utf8', start=0, end=buffer.length]) -> string
- buffer.readUInt32LE(offset) -> number
- buffer.readUInt32BE(offset) -> number
- buffer.writeUInt32LE(value, offset) -> number (offset after write)
- buffer.slice(start=0, end=buffer.length) -> Buffer (view)
- buffer.copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length) -> number of bytes copied

Detailed digest
- Retrieved from Node.js Buffer docs on 2026-03-19. Extracted methods and behaviours needed for implementing byte-level hamming distance computations and safe buffer handling for encoding/decoding.

Attribution
Source: https://nodejs.org/api/buffer.html (fetched 2026-03-19). Size of raw HTML retrieved: approximately 113 KB.