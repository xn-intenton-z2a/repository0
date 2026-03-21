Title: NPM_FIZZBUZZ

Table of contents:
- Existing package behaviours and API signatures
- Installation and common usage patterns
- Licensing and version considerations
- Digest and retrieval metadata
- Attribution and data size

Existing package behaviours and API signatures:
- Many npm fizzbuzz packages expose a function that returns strings for numbers or prints to stdout. For library design, prefer returning values rather than printing.
- Define API as: function fizzBuzz(n: number): string[] and function fizzBuzzSingle(n: number): string

Installation and common usage patterns:
- Installation: npm install fizzbuzz (not required for this mission, used as reference)
- Usage pattern consumers expect: import { fizzBuzz } from 'fizzbuzz'

Licensing and version considerations:
- Verify package license before reuse. This doc is for reference only; implement own functions rather than relying on an external package to meet mission acceptance criteria.

Digest and retrieval metadata:
- Retrieved: 2026-03-21
- Source: https://www.npmjs.com/package/fizzbuzz
- Extract size (first chunk fetched): access blocked by anti-bot; partial placeholder retrieved (~2 KB)

Attribution:
- Source: npm package page
- URL: https://www.npmjs.com/package/fizzbuzz
- Retrieved on 2026-03-21
