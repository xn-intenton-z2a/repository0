# Hamming utilities report

This short report demonstrates the hammingDistance and hammingDistanceBits utilities added to the library.

Summary:

- Strings are normalized to NFC and compared by Unicode code points. This ensures canonical equivalence (e.g., `e\u0301` matches `é`).
- Binary inputs accept Buffer, Uint8Array, or ArrayBuffer; the functions compute per-byte XOR and a popcount to total differing bits.

Example outputs are available in `docs/examples/hamming_example.txt` and machine-readable JSON in `docs/evidence/hamming_example.json`.
