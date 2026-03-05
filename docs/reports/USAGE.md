Hamming Distance Library — Usage Walkthrough

This report demonstrates common usage patterns and sample outputs.

1. String Hamming distance (Unicode-aware):

   - Input: 'karolin', 'kathrin'
   - Output: 3

2. Empty strings:

   - Input: '', ''
   - Output: 0

3. Integer bit Hamming distance:

   - Input: 1, 4
   - Output: 2

4. BigInt support:

   - Input: 1n, 4n
   - Output: 2

Error handling:

- Passing different-length strings throws RangeError.
- Passing negative integers throws RangeError.
- Passing non-integer numeric types throws TypeError.

Files with examples and machine-readable evidence are in docs/examples and docs/evidence.
