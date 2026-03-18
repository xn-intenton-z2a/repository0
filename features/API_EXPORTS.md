# API_EXPORTS

Summary
Define the public API surface and export requirements so unit tests and the website can import and verify behavior. This aligns implementation with the mission requirement to export named exports from src/lib/main.js.

Specification
- Required named exports (from src/lib/main.js): hammingString, hammingBits, getIdentity
- Tests must import these named exports directly from src/lib/main.js and validate acceptance criteria described in STRING_HAMMING and INTEGER_HAMMING
- Keep existing getIdentity and --version CLI behavior unchanged; do not remove or break existing exports

Acceptance criteria
- src/lib/main.js exports hammingString and hammingBits as named exports
- Unit tests import the exports and verify examples and error handling documented in STRING_HAMMING and INTEGER_HAMMING
- README contains usage examples for both exported functions

Notes
The minimal CLI example may be added in an examples/ folder to demonstrate usage, but the core contract is that named exports exist and are importable by tests.