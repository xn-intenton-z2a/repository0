# repository0

A JavaScript library exporting Hamming distance functions.

## CLI

Usage:

- node src/lib/main.js string <left> <right>
  - Prints the Hamming distance (by code point) between two strings and exits with code 0 on success.
- node src/lib/main.js bits <x> <y>
  - Prints the Hamming distance (in bits) between two non-negative integers and exits with code 0 on success.

Canonical examples (also available in docs/examples/cli-output.md):

- node src/lib/main.js string karolin kathrin  => stdout: 3, exit: 0
- node src/lib/main.js bits 1 4               => stdout: 2, exit: 0

View the example on the local docs site after building the site:

- npm run build:web && npm run start

For library API usage and exported functions, see src/lib/main.js and the tests in tests/unit/.
