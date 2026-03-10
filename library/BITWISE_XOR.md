# BITWISE_XOR

## Table of Contents

1. XOR Operator Syntax and Behavior
2. Truth Table and Bit-Level Operations
3. Number Type Coercion Rules
4. BigInt Support and Type Compatibility
5. Practical Applications and Optimizations

## Normalised Extract

### XOR Operator Syntax and Behavior

The bitwise XOR operator ^ performs exclusive OR operations on the binary representations of its operands. The operator is overloaded for number and BigInt types.

For numbers, the operator returns a 32-bit integer. For BigInts, it returns a BigInt result. The operator first coerces both operands to numeric values and tests their types.

If both operands become BigInts, it performs BigInt XOR. Otherwise, it converts both operands to 32-bit integers and performs number bitwise XOR. A TypeError is thrown if one operand becomes a BigInt while the other becomes a number.

### Truth Table and Bit-Level Operations

The XOR operation follows this truth table:

x | y | x XOR y
0 | 0 | 0
0 | 1 | 1  
1 | 0 | 1
1 | 1 | 0

The operator works on bit pairs from corresponding positions in both operands. Each bit in the first operand pairs with the corresponding bit in the second operand, and the XOR operation applies to each pair individually.

Example bit-level calculation:
```
     9 (base 10) = 00000000000000000000000000001001 (base 2)
    14 (base 10) = 00000000000000000000000000001110 (base 2)
                   --------------------------------
14 ^ 9 (base 10) = 00000000000000000000000000000111 (base 2) = 7 (base 10)
```

### Number Type Coercion Rules

The operator operates on 32-bit signed integer representations using two's complement format. Numbers with more than 32 bits have their most significant bits discarded during conversion.

Example of bit truncation:
```
Before: 11100110111110100000000000000110000000000001
After:              10100000000000000110000000000001
```

XORing any number with 0 returns the number converted to a 32-bit integer, which removes leading bits for numbers outside the range -2147483648 to 2147483647. However, Math.trunc() should be used instead for number truncation rather than ^ 0.

### BigInt Support and Type Compatibility

For BigInts, no truncation occurs. Positive BigInts conceptually have infinite leading 0 bits, while negative BigInts have infinite leading 1 bits.

Mixed type operations throw TypeError:
- number ^ BigInt = TypeError
- BigInt ^ number = TypeError  
- BigInt ^ BigInt = BigInt result
- number ^ number = 32-bit integer result

### Practical Applications and Optimizations

XOR operations are fundamental for:
- Bit manipulation and masking
- Cryptographic operations
- Hash function implementations
- Error detection algorithms
- Data structure optimizations

The operation is computationally efficient as it maps directly to processor instructions. XOR has useful mathematical properties including commutativity (a ^ b = b ^ a) and associativity ((a ^ b) ^ c = a ^ (b ^ c)).

## Supplementary Details

The XOR operator has special properties that make it useful for algorithmic applications. XORing a value with itself produces zero (a ^ a = 0), and XORing with zero produces the original value (a ^ 0 = a).

These properties enable space-efficient algorithms for problems like finding single unique elements in arrays, swapping variables without temporary storage, and implementing simple encryption schemes.

## Reference Details

### Operator Precedence and Associativity

The ^ operator has precedence level 6 in JavaScript, between equality operators (precedence 7) and bitwise AND (precedence 8). It is left-associative, meaning a ^ b ^ c evaluates as (a ^ b) ^ c.

### Type Conversion Specifications  

Numeric Coercion Process:
1. Convert operands using ToNumber() for primitive values
2. Check resulting types - both must be numbers or both must be BigInt
3. For numbers: apply ToInt32() conversion to get 32-bit signed integers
4. For BigInt: preserve full precision without truncation

32-bit Integer Conversion (ToInt32):
- Range: -2,147,483,648 to 2,147,483,647
- Overflow behavior: Wrapping using modulo 2^32 arithmetic
- Sign extension: Uses two's complement representation

### Error Conditions

TypeError thrown when:
- One operand is BigInt and other is number after coercion
- Either operand cannot be converted to numeric value

### Performance Characteristics

XOR operations execute in constant time O(1) regardless of operand values. Modern processors implement XOR as single-cycle instructions. For BigInt operands, performance scales with the size of the larger operand.

### ECMAScript Specification

Defined in ECMAScript 2026 Language Specification section covering bitwise expressions. Implementation must handle type coercion, overflow behavior, and error conditions according to specification requirements.

Browser support is universal across all JavaScript environments. No polyfills required as XOR is a fundamental language operator.

## Detailed Digest

Technical specification extracted from MDN JavaScript reference documenting bitwise XOR operator behavior, type coercion rules, and implementation details. Retrieved 2026-03-10.

Content provides comprehensive coverage of XOR operator semantics essential for bit manipulation algorithms and low-level JavaScript programming.

## Attribution Information

Source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Bitwise_XOR
Data size: 10000 characters extracted  
Retrieved: 2026-03-10