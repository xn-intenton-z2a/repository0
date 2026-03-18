# VALIDATION

Purpose
Document validation rules and the deterministic error messages used by the library so tests can assert on exception types and stable messages where required.

Rules for string API
- If either argument to hammingString is not a string, throw TypeError with message exactly: hammingString: both arguments must be strings
- If the two inputs have different lengths in Unicode code points, throw RangeError with message exactly: hammingString: strings must have the same length (in Unicode code points)

Rules for integer API
- If either argument to hammingBits is not an integer (Number integer or BigInt), throw TypeError with message exactly: hammingBits: both arguments must be integers (Number or BigInt)
- If either integer is negative, throw RangeError with message exactly: hammingBits: arguments must be non-negative

Acceptance criteria
- Passing non-strings to hammingString causes a TypeError with the message above.
- Passing strings with differing code point lengths causes a RangeError with the message above.
- Passing non-integer Numbers or non-number/non-BigInt types to hammingBits causes a TypeError with the message above.
- Passing negative integers to hammingBits causes a RangeError with the message above.
- Validation behaviour and messages are documented in README and covered by unit tests.
