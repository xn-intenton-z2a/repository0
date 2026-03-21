TABLE OF CONTENTS
1. Purpose
2. API: RangeError
3. Usage pattern
4. Examples
5. Supplementary details
6. Digest and retrieval

1. Purpose
Document the proper use of RangeError for invalid numeric ranges (e.g., negative n for fizzBuzz).

2. API: RangeError
- Constructor: new RangeError(message)
- Thrown to indicate a value not in the set or range of allowed values.

3. Usage pattern
- For n < 0: throw new RangeError('n must be non-negative')
- Do not use RangeError for type mismatches (use TypeError instead)

4. Examples
- if (n < 0) throw new RangeError('n must be non-negative')

5. Supplementary details
- RangeError inherits from Error; typical pattern: throw new RangeError(message) and let caller handle or test for thrown exception in unit tests.

6. Digest and retrieval
Source: MDN RangeError
Retrieved: 2026-03-21
Attribution: MDN Web Docs
Data size: small (API reference extraction)
