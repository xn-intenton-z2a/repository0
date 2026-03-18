# API_EXPORTS

Purpose
Define the public API surface and the required export style for src/lib/main.js.

Exports
- Named export computeStringHamming: implements the string Hamming feature.
- Named export computeIntegerHamming: implements the integer Hamming feature.
- Optional aliases stringHamming and integerHamming may be exported to improve ergonomics.

CLI behaviour
- When invoked as a script, main should accept a simple command-line interface that can compute a string or integer Hamming distance and print the numeric result.
- CLI syntax examples are described in the README: mode string arg1 arg2 or mode int arg1 arg2.
- The CLI must reuse the same exported functions and must not duplicate validation logic.

Acceptance criteria
- All public functions are exported as named exports from src/lib/main.js.
- The CLI reuses exported functions and prints results suitable for tests.
- README documents import examples and CLI usage.
