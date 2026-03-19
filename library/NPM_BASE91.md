NPM_BASE91

Table of contents
- Package metadata
- Recommended usage notes
- Relation to BASE91 reference implementation
- Retrieval details and attribution

Package metadata
- Source URL: https://www.npmjs.com/package/base91
- Package name: base91 (as listed on npm)
- Retrieval date: 2026-03-19
- Data size downloaded during crawl: 7,150 bytes

Recommended usage notes
- Consult the package README on npm or the package repository for exact API (function names, parameter types, return types). The npm page is the authoritative distribution point; API surface varies between packages named "base91".
- If the package README is not machine-readable due to client-side rendering, prefer the BASE91 reference implementation at https://base91.sourceforge.net/ (included in SOURCES.md) for algorithmic details and deterministic reference behavior.

Relation to BASE91 reference implementation
- The base91.sourceforge.net reference documents the encoding algorithm and reference C implementation; use it to validate decode/encode round-trip and to extract exact mapping tables and bit manipulation patterns.
- For mission-critical code (round-trip correctness, bit-density calculations) use the reference algorithm and treat npm packages as convenience wrappers until their tests and behaviour are verified.

Detailed digest and attribution
- Crawled npm package page for metadata and README pointer.
- Retrieved: 2026-03-19
- Data size: 7,150 bytes
- Attribution: npm package page (https://www.npmjs.com/package/base91). For algorithmic specs, see BASE91 reference: https://base91.sourceforge.net/