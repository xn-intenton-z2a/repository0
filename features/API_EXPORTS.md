# API_EXPORTS

Purpose
Define the public API surface and the required export style for src/lib/main.js.

Public exports
- hammingString: named export implementing string Hamming distance measured in Unicode code points.
- hammingBits: named export implementing integer bit-level Hamming distance; accepts Number (integer) or BigInt.
- name, version, description: string metadata exported from package.json.
- getIdentity: helper returning an object with name, version and description.
- main: CLI entrypoint function that reuses the exported library functions.

CLI behaviour
- When invoked as a script the package should call main with the CLI args and print either identity information or computed results.
- The CLI must reuse the exported functions and must not duplicate validation logic; tests should call main to ensure it terminates without error.

Acceptance criteria
- All public functions above are exported as named exports from src/lib/main.js and importable by tests.
- Tests import hammingString and hammingBits directly from src/lib/main.js.
- The CLI reuses exported functions and main can be invoked in tests without throwing.
- README documents import examples and basic CLI usage that demonstrate the core acceptance cases described in other feature specs.
