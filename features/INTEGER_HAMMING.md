# INTEGER_HAMMING

Purpose
Specify the hammingBits API which computes the bit-level Hamming distance between two non-negative integers.

Specification
- Provide a named export called hammingBits that accepts two integer values. Supported input types: Number (integer) and BigInt.
- Canonical internal representation is BigInt: coerce Number inputs to BigInt before computation.
- Validation rules are documented in VALIDATION.md.

Behavior
- Compute the XOR of the two BigInt values then count the set bits in the result.
- A correct and straightforward algorithm is: let x be a BigInt XOR result; repeatedly inspect the least-significant bit and shift x right until x is zero, counting set bits.
- Return the count as a Number.

Acceptance criteria (testable)
- hammingBits(1, 4) returns 2.
- hammingBits(0, 0) returns 0.
- hammingBits accepts BigInt inputs: hammingBits(1n, 4n) returns 2.
- Passing a negative integer for either argument causes RangeError.
- Passing a non-integer Number (for example 1.5) or a non-integer/non-BigInt type causes TypeError.

Notes
- Implementation may use a Kernighan-style loop or a bit-shift loop; tests only observe the return values and exception behaviour.
- Performance considerations for very large BigInt values are out of scope for acceptance tests but should be documented if optimisations are added.
