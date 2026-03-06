Hamming utilities usage

This report demonstrates the hammingDistance and hammingDistanceBits functions.

Examples:

- hammingDistance('karolin', 'kathrin') -> 3
- hammingDistance('e\u0301', 'é') -> 0 (NFC normalisation makes them equal)
- hammingDistanceBits('a', 'b') -> 2

Notes:
- Strings are normalised to NFC and compared by Unicode code points (Array.from).
- hammingDistanceBits accepts strings (encoded to UTF-8), Buffer and Uint8Array. Byte lengths must match after encoding.
