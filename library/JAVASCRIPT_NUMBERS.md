# JAVASCRIPT_NUMBERS

## Table of Contents
- Number Type and Representation
- Numeric Literals and Formats
- Number Object Properties
- Mathematical Operations
- Precision and Range Limitations

## Number Type and Representation

JavaScript uses IEEE 754 double-precision 64-bit binary format for all numeric values:
- Range: ±2^-1022 to ±2^+1023 (approximately ±10^-308 to ±10^+308)
- Precision: 53 bits for integer values
- Safe integer range: ±2^53 - 1 (±9007199254740991)

Special numeric values:
- Infinity: Positive overflow result
- -Infinity: Negative overflow result  
- NaN: Not-a-Number for invalid operations

Integer values up to ±2^53 - 1 can be represented exactly. Beyond this range, precision loss occurs due to floating-point representation limitations.

## Numeric Literals and Formats

Decimal literals:
- Standard notation: 1234567890, 42
- Scientific notation: 1e3 (1000), 175e-2 (1.75), 5e1 (50)
- Leading zero legacy: 0777 parsed as octal in non-strict mode

Binary literals:
- Prefix: 0b or 0B
- Digits: 0 and 1 only
- Example: 0b10000000000000000000000000000000 (2147483648)

Octal literals:
- Modern syntax: 0o or 0O prefix
- Legacy syntax: leading zero (strict mode forbidden)
- Examples: 0o755 (493), 0O644 (420)

Hexadecimal literals:
- Prefix: 0x or 0X
- Digits: 0-9, A-F (case insensitive)
- Examples: 0xFFFFFF (16777215), 0xabcdef (11259375)

Numeric separators:
- Underscore (_) between digits for readability
- Examples: 1_000_000, 0b1010_0001, 0xFF_EC_DE_5E

## Number Object Properties

Static properties for numeric constants:

MAX_VALUE: 1.7976931348623157e+308 (largest representable number)
MIN_VALUE: 5e-324 (smallest positive representable number)
POSITIVE_INFINITY: Positive infinity value
NEGATIVE_INFINITY: Negative infinity value
NaN: Not-a-Number value
EPSILON: 2.220446049250313e-16 (difference between 1 and next representable)
MAX_SAFE_INTEGER: 9007199254740991 (largest safe integer)
MIN_SAFE_INTEGER: -9007199254740991 (smallest safe integer)

Static methods for number validation:

isFinite(value): Tests if value is finite number
isInteger(value): Tests if value is integer
isNaN(value): Tests if value is NaN (more reliable than global isNaN)
isSafeInteger(value): Tests if value is safe integer
parseFloat(string): Parses string as floating point
parseInt(string, radix): Parses string as integer with optional radix

## Mathematical Operations

Math object provides mathematical functions:

Basic operations:
- Math.abs(x): Absolute value
- Math.pow(x, y): x raised to power y
- Math.sqrt(x): Square root
- Math.cbrt(x): Cube root

Trigonometric functions:
- Math.sin(x), Math.cos(x), Math.tan(x): Standard trig functions (radians)
- Math.asin(x), Math.acos(x), Math.atan(x): Inverse trig functions
- Math.atan2(y, x): Two-argument arctangent

Logarithmic and exponential:
- Math.exp(x): e raised to power x
- Math.log(x): Natural logarithm
- Math.log10(x): Base-10 logarithm
- Math.log2(x): Base-2 logarithm

Rounding functions:
- Math.floor(x): Round down to nearest integer
- Math.ceil(x): Round up to nearest integer
- Math.round(x): Round to nearest integer
- Math.trunc(x): Remove fractional part

## Precision and Range Limitations

Floating-point precision issues:
- 0.1 + 0.2 !== 0.3 due to binary representation
- Use Number.EPSILON for equality comparisons
- Consider rounding for display purposes

Safe integer operations:
- Operations beyond MAX_SAFE_INTEGER lose precision
- Use Number.isSafeInteger() to validate
- Consider BigInt for larger integer values

Arithmetic overflow:
- Results exceeding MAX_VALUE become Infinity
- Underflow results become 0 or -0
- Division by zero produces ±Infinity
- Invalid operations produce NaN

## Supplementary Details

JavaScript's number system unified integer and floating-point types into a single IEEE 754 double-precision format. This simplifies the language but creates precision considerations for certain applications.

The safe integer range represents values that can be exactly represented and compared. Beyond this range, consecutive integers cannot be distinguished due to floating-point representation gaps.

Scientific notation provides a compact way to express very large or very small numbers. The exponent can be positive or negative, with e or E separating the mantissa from the exponent.

Numeric literal formats enable different representations for the same value, with binary and hexadecimal being particularly useful for bit manipulation and system programming contexts.

## Reference Details

IEEE 754 double-precision format:
- Sign bit: 1 bit
- Exponent: 11 bits (biased by 1023)
- Mantissa: 52 bits (plus implicit leading 1)
- Total: 64 bits

Number conversion rules:
- undefined → NaN
- null → 0
- boolean → 0 or 1
- string → parsed numeric value or NaN
- object → valueOf() then toString() conversion

Comparison behavior:
- NaN !== NaN (only value not equal to itself)
- +0 === -0 (positive and negative zero are equal)
- Infinity comparisons follow mathematical rules
- Number comparisons use IEEE 754 semantics

Mathematical constants available:
- Math.PI: π (3.141592653589793)
- Math.E: e (2.718281828459045)
- Math.LN2: ln(2) (0.6931471805599453)
- Math.LN10: ln(10) (2.302585092994046)
- Math.SQRT2: √2 (1.4142135623730951)

## Detailed Digest

Technical content extracted from MDN JavaScript Numbers and Dates guide on 2026-03-11.

JavaScript's number type uses IEEE 754 double-precision floating-point format providing good range and precision for most applications. The unified number type simplifies language design but requires understanding of floating-point limitations.

Numeric literals support multiple formats including binary (0b), octal (0o), hexadecimal (0x), and scientific notation. Numeric separators using underscore (_) improve readability for large numbers across all literal syntaxes.

The Math object provides comprehensive mathematical functionality with functions for basic arithmetic, trigonometry, logarithms, and rounding. All trigonometric functions expect arguments in radians rather than degrees.

Safe integer operations are guaranteed within the ±2^53-1 range (±9007199254740991), beyond which precision loss may occur. For applications requiring larger integers, BigInt provides arbitrary precision arithmetic but cannot represent floating-point numbers.

## Attribution Information

Sources crawled:
- MDN JavaScript Guide Numbers and Dates: 20000+ characters (truncated)

Total data size: 20000+ characters
Retrieved: 2026-03-11T22:17:13Z