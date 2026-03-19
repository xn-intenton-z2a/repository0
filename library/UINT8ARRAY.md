UINT8ARRAY

Table of contents
1. Overview
2. Constructors and creation patterns
3. Core properties and fields
4. Core instance methods (in-place and functional)
5. Interop with Node.js Buffer and ArrayBuffer/DataView
6. Common utility signatures for encoders/decoders (mission-specific)
7. Endianness and multi-byte views
8. Supplementary implementation notes
9. Reference details (method signatures and types)
10. Retrieval digest and attribution

1. Overview
Uint8Array is a fixed-length typed array view representing an array of 8-bit unsigned integers (bytes). Each element is an integer in range 0..255. The underlying storage is an ArrayBuffer; multiple typed views can share the same buffer.

2. Constructors and creation patterns
- new Uint8Array(length: number) -> Uint8Array: allocate zero-initialized byte array of specified length.
- new Uint8Array(buffer: ArrayBuffer, byteOffset?: number, length?: number) -> Uint8Array: create a view over an existing ArrayBuffer. byteOffset must be a multiple of BYTES_PER_ELEMENT (1) and >= 0.
- Uint8Array.from(source: ArrayLike<number> | Iterable<number>, mapFn?: (value: number, index: number) => number) -> Uint8Array: create from array-like or iterable.
- Common helpers (implementation patterns):
  - fromHex(hex: string) -> Uint8Array: accept hex string (optionally prefixed with 0x, optionally containing separators) and return bytes; expected input length must be even; implementation: strip non-hex, validate length, parse pairs as parseInt(pair, 16).
  - fromUUIDHex(uuidHex32: string) -> Uint8Array: input is 32 hex characters (no dashes); parse each pair to bytes and return Uint8Array(16).

3. Core properties and fields
- readonly BYTES_PER_ELEMENT: 1 (constant on constructor).
- length: number of elements (read-only property on the view).
- buffer: ArrayBuffer backing storage.
- byteOffset: number offset into buffer where this view starts.
- byteLength: number of bytes in the view.

4. Core instance methods (in-place and functional)
(only methods relevant to byte manipulation listed)
- set(source: ArrayLike<number> | TypedArray, offset?: number): void — copy source bytes into this buffer at offset.
- subarray(begin?: number, end?: number): Uint8Array — returns a new view into the same buffer (zero-copy slice).
- slice(begin?: number, end?: number): Uint8Array — returns a new copy of the selected bytes.
- fill(value: number, start?: number, end?: number): this — fill a range with the given byte value.
- copyWithin(target: number, start: number, end?: number): this — copy bytes within same view.
- reverse(): this — reverse bytes in place.
- indexOf/search utilities: indexOf, includes, lastIndexOf — useful for validation/trimming.

5. Interop with Node.js Buffer and ArrayBuffer/DataView
- Node.js Buffer <-> Uint8Array interoperability:
  - Buffer.from(u8) or Buffer.from(u8.buffer, u8.byteOffset, u8.byteLength) yields a Buffer referencing the same memory (zero-copy where possible).
  - Buffer.from(hexString, 'hex') -> Buffer -> new Uint8Array(buffer) for converting hex to bytes.
- To get an ArrayBuffer copy: u8.buffer.slice(u8.byteOffset, u8.byteOffset + u8.byteLength) or new Uint8Array(u8).buffer when a copy is needed.
- DataView provides multi-byte reads/writes (getUint16, setUint32) with explicit endianness; use DataView(view.buffer, view.byteOffset) when reading ints spanning bytes.

6. Common utility signatures for encoders/decoders (mission-specific)
These signatures are normative for the encoding library and use Uint8Array as the binary I/O type.
- encode(encodingName: string, data: Uint8Array) -> string
  - encodingName: predefined encoding id (e.g., 'base62', 'base85', 'base91' or custom name)
  - data: Uint8Array containing raw bytes
  - returns: printable encoded string (no control characters)
- decode(encodingName: string, text: string) -> Uint8Array
  - text: encoded string from encode()
  - returns: Uint8Array identical to input passed to encode (round-trip property)
- shorthandUuidEncode(uuidString: string, encodingName: string) -> string
  - uuidString: canonical UUID v1..v7 with dashes
  - action: strip dashes, parse 32-hex characters to Uint8Array(16), reverse bytes if mission requires, then encode()
- shorthandUuidDecode(encoded: string, encodingName: string) -> string
  - returns canonical UUID string (with dashes) after decoding and any reversal

7. Endianness and multi-byte views
- Uint8Array stores bytes in logical order. When interpreting multi-byte integers use DataView with explicit littleEndian flag.
- The library must avoid implicit endianness assumptions when composing/disassembling multi-byte integers; encode/decode operate on raw bytes only.

8. Supplementary implementation notes
- Validation: always validate input types; reject non-Uint8Array inputs for encode/decode public API, or coerce safely with Uint8Array.from where appropriate.
- Edge cases: empty Uint8Array (length 0) must round-trip. Single-byte arrays and all-0x00 or all-0xFF must be handled by encoders/decoders.
- Performance: prefer zero-copy subarray and Buffer interop for Node.js when converting large blobs.
- Security: do not accept control characters in encoded output charsets; ensure decoding ignores or rejects invalid characters consistently per encoding rules.

9. Reference details (method signatures and types)
- Constructor signatures:
  - Uint8Array(length: number) -> Uint8Array
  - Uint8Array(buffer: ArrayBuffer, byteOffset?: number, length?: number) -> Uint8Array
- Utility functions (recommended signatures):
  - function fromHex(hex: string): Uint8Array
  - function toHex(data: Uint8Array): string
  - function uuidHexToBytes(hex32: string): Uint8Array  // hex32 must be 32 hex chars
  - function bytesToUuidHex(b: Uint8Array): string // returns 32-char hex string
  - function encode(name: string, data: Uint8Array): string
  - function decode(name: string, text: string): Uint8Array
  - function listEncodings(): { name: string; bitsPerChar: number; charsetSize: number }[]

10. Retrieval digest and attribution
- Source: MDN Web Docs — Uint8Array (developer.mozilla.org)
- URL retrieved: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array
- Retrieval date: 2026-03-19
- Bytes obtained during crawl: 166935 bytes (HTML response saved during fetch)
- Attribution: MDN contributors; content extracted and condensed into this technical note.

Data license and usage: MDN content is used here to extract precise API signatures and behaviors; consult original MDN page for latest updates.
