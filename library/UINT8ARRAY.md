NORMALISED EXTRACT

Table of contents:
1) Constructors and creation patterns
2) Properties and memory layout
3) Common methods and signatures
4) Interop with Node.js Buffer

Constructors
- new Uint8Array(length: number) -> Uint8Array (zero-filled)
- new Uint8Array(typedArray: TypedArray) -> copy of contents
- new Uint8Array(array: ArrayLike<number> | Iterable<number>) -> copy
- new Uint8Array(buffer: ArrayBuffer, byteOffset?: number, length?: number) -> view into buffer

Properties and memory layout
- .buffer -> ArrayBuffer backing store
- .byteOffset -> numeric offset in underlying ArrayBuffer
- .byteLength -> length in bytes
- Uint8Array is a TypedArray view over an ArrayBuffer; multiple views may share the same buffer.

Common methods (signatures)
- set(source: ArrayLike<number> | TypedArray, offset?: number) -> void
- subarray(begin?: number, end?: number) -> Uint8Array
- slice(begin?: number, end?: number) -> Uint8Array
- copyWithin(target: number, start: number, end?: number) -> Uint8Array
- fill(value: number, start?: number, end?: number) -> Uint8Array
- entries() -> Iterator<[number, number]>
- keys() -> Iterator<number>
- values() -> Iterator<number>

Interop with Node.js Buffer
- In Node.js, Buffer.from(uint8array) creates a Buffer that may share memory with the Uint8Array (no copy) depending on Node version and arguments. Buffer instances are subclasses of Uint8Array in modern Node versions.
- Conversion patterns:
  - Buffer.from(Uint8Array) -> Buffer
  - new Uint8Array(Buffer) -> Uint8Array (view over same memory if possible)
- When interoperating, pay attention to byteOffset and length when creating views over shared buffers.

Reference details (exact signatures)
- new Uint8Array(length: number)
- new Uint8Array(buffer: ArrayBuffer, byteOffset?: number, length?: number)
- Uint8Array.from(arrayLike: ArrayLike<number> | Iterable<number>, mapFn?: (v, i) => number)
- set(source: ArrayLike<number> | TypedArray, offset?: number): void

Detailed digest
- Source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array
- Retrieved: 2026-03-21
- Bytes fetched: 162007

Attribution
- MDN Web Docs: Uint8Array reference page.