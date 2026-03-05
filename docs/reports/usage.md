# Hamming Library Usage Walkthrough

This short walkthrough demonstrates using the library functions and captures example outputs.

1. Strings (Unicode-aware)

- Input: 'karolin', 'kathrin' -> Output: 3
- Input: '', '' -> Output: 0
- Input: 'a😊b', 'a😢b' -> Output: 1

2. Bits (integers / BigInt)

- Input: 1, 4 -> Output: 2
- Input: 0, 0 -> Output: 0
- BigInt: 1n << 60n, 0n -> Output: 1

These examples are also included in docs/examples and a machine-readable summary in docs/evidence.
