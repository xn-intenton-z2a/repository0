# ArrayBuffer Binary Data Handling

## Table of Contents

1. Core ArrayBuffer Specification
2. Resizable ArrayBuffer Operations
3. Transferable ArrayBuffer Mechanics
4. Typed Array View Integration
5. Memory Management and Performance
6. Cross-Context Usage Patterns

## Core ArrayBuffer Specification

### Constructor and Basic Properties

**ArrayBuffer Constructor**:
```typescript
new ArrayBuffer(length: number, options?: { maxByteLength?: number })
```

**Core Properties**:
- `byteLength`: Current size in bytes (read-only unless resizable)
- `maxByteLength`: Maximum resize limit for resizable buffers
- `resizable`: Boolean indicating if buffer can be resized
- `detached`: Boolean indicating if buffer has been transferred

### Fundamental Characteristics

**Memory Layout**:
- Contiguous memory block allocation
- Byte-addressable storage
- Platform-native memory alignment
- Zero-initialized upon creation

**Access Patterns**:
- Direct access requires typed array views
- No direct byte manipulation methods
- Immutable size (unless resizable)
- Reference-based sharing between views

## Resizable ArrayBuffer Operations

### Resizing Capabilities

**Resize Method**:
```typescript
arrayBuffer.resize(newLength: number): void
```

**Constraints**:
- New length must be ≤ maxByteLength
- Cannot resize detached buffers
- New bytes initialized to zero
- Affects all associated typed array views

### Implementation Patterns

**Creating Resizable Buffers**:
```typescript
const buffer = new ArrayBuffer(1024, { maxByteLength: 4096 });
// Initial size: 1024 bytes, can grow to 4096 bytes
```

**Efficient Growth Strategy**:
```typescript
function growBuffer(buffer, requiredSize) {
    if (requiredSize <= buffer.byteLength) return;
    if (requiredSize > buffer.maxByteLength) throw new Error('Exceeds max size');
    
    // Grow by doubling until sufficient
    let newSize = buffer.byteLength;
    while (newSize < requiredSize) {
        newSize = Math.min(newSize * 2, buffer.maxByteLength);
    }
    
    buffer.resize(newSize);
}
```

### Performance Considerations

**Memory Allocation**:
- Avoid frequent small resizes
- Pre-allocate expected maximum when possible
- Consider memory fragmentation impact
- Monitor system memory pressure

**View Invalidation**:
- Typed array views remain valid after resize
- Length properties update automatically
- No need to recreate views after resize
- Bounds checking automatically adjusts

## Transferable ArrayBuffer Mechanics

### Transfer Operations

**Transfer Method**:
```typescript
const newBuffer = arrayBuffer.transfer(newLength?: number): ArrayBuffer
const fixedBuffer = arrayBuffer.transferToFixedLength(newLength?: number): ArrayBuffer
```

**Transfer Characteristics**:
- Original buffer becomes detached (unusable)
- Only one copy retains memory access
- Atomic ownership transfer
- Optional size change during transfer

### Detached Buffer Behavior

**Detached State Properties**:
- `byteLength` returns 0
- `detached` property returns true
- All methods throw TypeError
- Associated typed array views become invalid

**Error Conditions**:
```typescript
// All operations on detached buffer throw TypeError:
// - resize(), slice(), transfer()
// - Typed array view access
// - Any memory operations
```

### Cross-Context Transfer

**Web Worker Message Passing**:
```typescript
// Main thread
const buffer = new ArrayBuffer(1024);
worker.postMessage({ buffer }, [buffer]); // Transfer ownership

// Worker thread
self.onmessage = (event) => {
    const { buffer } = event.data;
    // Can now use buffer, original is detached
};
```

**Structured Clone Algorithm**:
- ArrayBuffers support transferable object protocol
- Efficient zero-copy transfer between contexts
- Maintains referential integrity during transfer
- Automatic detachment of source buffer

## Typed Array View Integration

### View Creation Patterns

**Multiple View Types**:
```typescript
const buffer = new ArrayBuffer(16);
const uint8View = new Uint8Array(buffer);      // Byte access
const uint32View = new Uint32Array(buffer);    // 32-bit integers
const floatView = new Float64Array(buffer);     // Double precision
```

**Offset and Length Specification**:
```typescript
const buffer = new ArrayBuffer(1024);
const view = new Uint8Array(buffer, 100, 200); // Bytes 100-299
```

### Data Interpretation

**Endianness Considerations**:
- Typed arrays use platform native byte order
- DataView provides explicit endianness control
- Cross-platform compatibility requires attention
- Network protocols often specify byte order

**Type Conversion Patterns**:
```typescript
// Converting between different interpretations
const buffer = new ArrayBuffer(8);
const bytes = new Uint8Array(buffer);
const doubles = new Float64Array(buffer);

// Write as bytes, read as double
bytes.set([0x40, 0x09, 0x21, 0xFB, 0x54, 0x44, 0x2D, 0x18]);
const piValue = doubles[0]; // IEEE 754 representation of π
```

## Memory Management and Performance

### Allocation Strategies

**Size Planning**:
- Estimate maximum required size upfront
- Use powers of 2 for efficient memory allocation
- Consider memory pool patterns for frequent allocations
- Monitor garbage collection impact

**Sharing and Copying**:
```typescript
// Efficient sharing (no copy)
const sharedView1 = new Uint8Array(buffer);
const sharedView2 = new Uint8Array(buffer, offset);

// Explicit copying when needed
const copy = buffer.slice(start, end);
const newView = new Uint8Array(copy);
```

### Performance Optimization

**Access Patterns**:
- Sequential access more cache-friendly
- Batch operations when possible
- Minimize view creation overhead
- Use appropriate typed array for data type

**Memory Efficiency**:
- Reuse buffers when possible
- Clear references to enable garbage collection
- Consider memory-mapped file alternatives
- Monitor memory usage in long-running applications

## Cross-Context Usage Patterns

### Module Integration

**Binary Data Processing**:
```typescript
function processBuffer(buffer: ArrayBuffer): Uint8Array {
    const input = new Uint8Array(buffer);
    const output = new Uint8Array(buffer.byteLength);
    
    // Process binary data
    for (let i = 0; i < input.length; i++) {
        output[i] = input[i] ^ 0xFF; // Example: bitwise NOT
    }
    
    return output;
}
```

**Encoding Integration**:
```typescript
function encodeToBase64(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    // Convert to base64 (implementation specific)
    return btoa(String.fromCharCode(...bytes));
}

function decodeFromBase64(base64: string): ArrayBuffer {
    const binaryString = atob(base64);
    const buffer = new ArrayBuffer(binaryString.length);
    const bytes = new Uint8Array(buffer);
    
    for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    
    return buffer;
}
```

### File and Network Integration

**File API Integration**:
```typescript
async function readFileAsBuffer(file: File): Promise<ArrayBuffer> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as ArrayBuffer);
        reader.onerror = () => reject(reader.error);
        reader.readAsArrayBuffer(file);
    });
}
```

**Network Data Handling**:
```typescript
async function fetchBinaryData(url: string): Promise<ArrayBuffer> {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Network error');
    return response.arrayBuffer();
}
```

## Reference Details

### Browser Compatibility

**Modern Support**:
- All modern browsers support ArrayBuffer
- Resizable ArrayBuffer: Chrome 111+, Firefox 128+
- Transferable objects: Universal modern support
- Performance varies by implementation

### Performance Characteristics

**Memory Operations**:
- Allocation speed depends on size and system memory
- Transfer operations are zero-copy when possible
- Garbage collection impact varies by usage pattern
- Memory mapping provides OS-level optimization

### Security Considerations

**Memory Safety**:
- Bounds checking prevents buffer overflows
- Typed arrays provide type safety
- No direct pointer arithmetic available
- Detached buffers prevent use-after-free

## Digest

Complete ArrayBuffer specification for binary data handling in JavaScript, including resizable buffers, transferable objects, typed array integration, and performance optimization patterns. Essential for implementing binary data encoding and processing systems.

Retrieved: 2026-03-13
Sources: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer

Data size: Approximately 8KB of API documentation consolidated into implementation-focused reference guide.