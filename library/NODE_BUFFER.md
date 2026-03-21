NORMALISED EXTRACT

Table of contents:
1) Overview
2) Construction and allocation
3) Conversion and interop with TypedArray
4) API reference signatures
5) Security and performance notes

Overview
- Buffer is Node.js's raw binary data type. It behaves as a subclass of Uint8Array in modern Node versions and provides additional convenience and performance APIs for allocating and manipulating binary data.

Construction and allocation
- Buffer.from(arrayBuffer[, byteOffset[, length]]) -> Buffer
- Buffer.from(array) -> Buffer (copies array-like)
- Buffer.from(string[, encoding]) -> Buffer (creates buffer from encoded string)
- Buffer.alloc(size[, fill[, encoding]]) -> Buffer (zero-filled)
- Buffer.allocUnsafe(size) -> Buffer (uninitialized memory, faster)

Conversion and interop
- Buffer.from(uint8array) -> Buffer (often shares memory with the original Uint8Array without copy)
- new Uint8Array(buffer) -> Uint8Array (view over buffer's underlying memory)
- Buffer instances expose .buffer (ArrayBuffer) and .byteOffset/.byteLength for interoperability.

API reference signatures
- Buffer.from(value: string | ArrayBuffer | ArrayLike<number> | Buffer, encoding?: string) -> Buffer
- Buffer.alloc(size: number, fill?: string|number|Buffer, encoding?: string) -> Buffer
- Buffer.allocUnsafe(size: number) -> Buffer
- Buffer.byteLength(string: string, encoding?: string) -> number
- Buffer.concat(list: Buffer[], totalLength?: number) -> Buffer

Security and performance notes
- Use Buffer.alloc when you must avoid leaking sensitive data from previously allocated memory; Buffer.allocUnsafe may contain old memory contents and must be explicitly filled.
- Prefer Buffer.from for conversions where sharing memory is acceptable, but be mindful of the lifetime of the underlying ArrayBuffer when views are shared.

Detailed digest
- Source: https://nodejs.org/api/buffer.html
- Retrieved: 2026-03-21
- Bytes fetched: 1111904

Attribution
- Node.js Buffer documentation (nodejs.org).