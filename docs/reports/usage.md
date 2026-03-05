# Hamming Library Usage Report

This short report demonstrates the library usage and sample outputs.

Examples:

- Hamming distance between 'karolin' and 'kathrin' is 3.
- Empty strings produce 0.
- Unicode surrogate-pair characters (emoji) are treated as single code points so comparisons are by visual character position, not UTF-16 code units.
- Bitwise Hamming distance works with Number or BigInt values and properly counts differing bits.

See `docs/examples/hamming_examples.txt` and `docs/evidence/hamming_results.json` for machine-readable examples and sample outputs.
