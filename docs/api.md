# API Documentation

## hammingDistance(a, b)

Computes the Hamming distance between two strings of equal length by counting the number of positions where the characters differ.

### Parameters

- **a** `{string}` - The first string to compare
- **b** `{string}` - The second string to compare  

### Returns

`{number}` - The number of positions where the characters differ

### Throws

- **TypeError** - If either argument is not a string
- **RangeError** - If the strings have different lengths

### Examples

```javascript
import { hammingDistance } from 'repo';

// Basic usage
hammingDistance("karolin", "kathrin");  // 3
hammingDistance("hello", "world");      // 4
hammingDistance("", "");                // 0

// Unicode support
hammingDistance("café", "cave");        // 2
hammingDistance("🎉🎊", "🎉🌟");         // 1

// Error cases
hammingDistance("short", "longer");     // RangeError
hammingDistance(123, "string");         // TypeError
```

### Implementation Notes

- Uses `Array.from()` to properly handle Unicode code points
- Compares code points rather than UTF-16 code units
- Supports all Unicode characters including emoji and surrogate pairs

---

## hammingDistanceBits(x, y)

Computes the Hamming distance between two non-negative integers by counting the number of differing bits in their binary representations.

### Parameters

- **x** `{number}` - The first integer to compare (must be non-negative)
- **y** `{number}` - The second integer to compare (must be non-negative)

### Returns

`{number}` - The number of differing bits

### Throws

- **TypeError** - If either argument is not an integer
- **RangeError** - If either argument is negative

### Examples

```javascript
import { hammingDistanceBits } from 'repo';

// Basic usage
hammingDistanceBits(1, 4);      // 2 (001 vs 100)
hammingDistanceBits(5, 3);      // 2 (101 vs 011)
hammingDistanceBits(0, 0);      // 0

// Larger numbers
hammingDistanceBits(255, 0);    // 8 (all bits differ)
hammingDistanceBits(1024, 1);   // 2 (10000000000 vs 00000000001)

// Error cases
hammingDistanceBits(-1, 5);     // RangeError
hammingDistanceBits(1.5, 2);    // TypeError
```

### Implementation Notes

- Uses XOR operation to identify differing bits
- Counts 1s in the XOR result using bit manipulation
- Handles arbitrarily large integers within JavaScript's safe integer range

---

## Type Definitions

```typescript
declare function hammingDistance(a: string, b: string): number;
declare function hammingDistanceBits(x: number, y: number): number;
```