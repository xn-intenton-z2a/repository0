# BITWISE_OPERATIONS

## Table of Contents
- Bitwise Operators Overview
- XOR Operation Details
- Bit Manipulation Techniques
- JavaScript Implementation Specifics
- Performance and Use Cases

## Bitwise Operators Overview

Bitwise operations work on individual bits of binary representations. JavaScript supports standard bitwise operators operating on 32-bit signed integers.

Fundamental operators:
- AND (&): Result bit is 1 only if both operand bits are 1
- OR (|): Result bit is 1 if either operand bit is 1
- XOR (^): Result bit is 1 if operand bits differ
- NOT (~): Inverts all bits (ones' complement)
- Left shift (<<): Shifts bits left, zeros fill from right
- Right shift (>>): Shifts bits right, sign bit fills from left
- Unsigned right shift (>>>): Shifts bits right, zeros fill from left

## XOR Operation Details

The XOR (exclusive OR) operator performs logical exclusive OR on each bit pair:
- 0 XOR 0 = 0
- 0 XOR 1 = 1 
- 1 XOR 0 = 1
- 1 XOR 1 = 0

Truth table shows XOR returns 1 only when bits differ, making it ideal for detecting differences between values.

JavaScript XOR operator (^):
- Converts operands to 32-bit signed integers
- Handles BigInt operands when both are BigInt
- Throws TypeError if mixing BigInt with Number
- Discards bits beyond 32-bit range for numbers

Properties of XOR:
- Commutative: a ^ b = b ^ a
- Associative: (a ^ b) ^ c = a ^ (b ^ c)
- Self-inverse: a ^ a = 0
- Identity element: a ^ 0 = a

## Bit Manipulation Techniques

Common bit manipulation patterns:

Setting bits:
- Set bit n: value | (1 << n)
- Set multiple bits: value | mask

Clearing bits:
- Clear bit n: value & ~(1 << n)  
- Clear multiple bits: value & ~mask

Toggling bits:
- Toggle bit n: value ^ (1 << n)
- Toggle multiple bits: value ^ mask

Testing bits:
- Test bit n: (value & (1 << n)) !== 0
- Check if power of 2: (value & (value - 1)) === 0

Population count (count set bits):
- Brian Kernighan algorithm: while(v) { v &= v-1; count++; }
- Built-in functions where available
- Lookup tables for performance

## JavaScript Implementation Specifics

JavaScript bitwise operations convert operands to 32-bit signed integers:
- Range: -2147483648 to 2147483647
- Larger values truncated to 32-bit representation
- Floating point numbers truncated to integers
- Boolean and other types coerced to numbers first

Number conversion process:
1. Convert to numeric value
2. If BigInt, handle separately  
3. Convert to 32-bit signed integer
4. Perform bitwise operation
5. Return 32-bit signed integer result

BigInt support:
- Bitwise operations work with BigInt operands
- No truncation occurs with BigInt
- Cannot mix BigInt and Number in operations
- Conceptually infinite precision for BigInt operations

## Performance and Use Cases

Bitwise operations are among the fastest primitive operations:
- Single CPU instruction for most operations
- Constant time complexity O(1)
- No memory allocation required
- Highly optimizable by JavaScript engines

Common applications:
- Flags and bitmasks for state management
- Hash functions and checksums
- Cryptographic operations
- Graphics and image processing
- Network protocols and data formats
- Algorithm optimizations

XOR specific uses:
- Hamming distance calculation
- Data encryption and decryption
- Error detection and correction
- Swapping variables without temporary storage
- Finding unique elements in arrays

## Supplementary Details

Bitwise operations form the foundation of low-level programming and algorithm optimization. The mathematical properties of bitwise operators enable elegant solutions to problems involving bit patterns and boolean logic.

Two's complement representation used by JavaScript means negative numbers have their sign bit set and follow two's complement arithmetic rules. This affects the behavior of shift operations and bit manipulation on negative values.

Endianness considerations apply when working with byte-level data or when bitwise operations interact with typed arrays or buffer objects. JavaScript's bitwise operators work on the logical bit representation regardless of underlying byte order.

Optimization opportunities:
- Use bitwise operations instead of arithmetic where appropriate
- Leverage bit manipulation for array indexing and math operations
- Consider lookup tables for complex bit counting operations
- Profile performance for bit manipulation vs. standard algorithms

## Reference Details

JavaScript XOR operator (^) specifications:
- Syntax: x ^ y  
- Precedence: Higher than equality, lower than shift operators
- Associativity: Left-to-right
- Type coercion: ToInt32 for Number operands
- BigInt handling: ToBigInt for BigInt operands  
- Error conditions: TypeError for mixed Number/BigInt
- Truth table: 0^0=0, 0^1=1, 1^0=1, 1^1=0
- 32-bit truncation: Numbers > 32 bits get most significant bits discarded
- Warning: Avoid using ^ 0 for integer truncation, use Math.trunc() instead

Bit manipulation utility functions:
- Population count: Count number of set bits
- Leading zeros: Count leading zero bits  
- Trailing zeros: Count trailing zero bits
- Bit rotation: Circular bit shifting
- Gray code: Binary to Gray code conversion
- Bit reversal: Reverse bit order in value

Mathematical equivalents for bitwise operations:
- x AND y = sum over n of 2^n * floor(x/2^n) mod 2 * floor(y/2^n) mod 2
- x OR y = x + y - (x AND y)
- x XOR y = x + y - 2*(x AND y)
- NOT x = (2^n - 1) - x for n-bit values

## Detailed Digest

Technical content extracted from Wikipedia bitwise operations article and MDN JavaScript documentation on 2026-03-11.

Bitwise operations enable efficient manipulation of binary data at the bit level. The XOR operation specifically provides a way to detect differences between bit patterns, making it fundamental for applications like Hamming distance calculation.

JavaScript's implementation follows standard bitwise operation semantics but includes specific behaviors for type coercion, BigInt support, and 32-bit integer truncation. The XOR operator is overloaded for numbers and BigInts, performing appropriate conversions while throwing TypeError when mixing types.

The mathematical properties of bitwise operators enable optimization opportunities and elegant algorithmic solutions. XOR's self-inverse property (a ^ a = 0) and commutative nature make it particularly valuable for error detection and cryptographic applications.

## Attribution Information

Sources crawled:
- Wikipedia Bitwise Operations: 20000+ characters (truncated)
- MDN Bitwise XOR: Complete document

Total data size: 20000+ characters  
Retrieved: 2026-03-11T22:32:38Z