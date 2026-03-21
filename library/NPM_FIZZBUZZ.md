NPM_FIZZBUZZ

Table of contents:
1. Package purpose and API surface
2. Install and import patterns
3. Behaviour notes and differences from simple implementations

1. Package purpose and API surface
- The npm package "fizzbuzz" provides convenience functions to produce fizzbuzz sequences and single outputs. Exact exported names vary by package version; inspect package README for details.

2. Install and import patterns
- Install: npm i fizzbuzz
- CommonJS: const fizzbuzz = require('fizzbuzz')
- ESM: import fizzbuzz from 'fizzbuzz'

3. Behaviour notes and differences from simple implementations
- Third-party packages sometimes coerce input types or accept options for start/end values; mission requires strict type and edge-case handling so prefer implementing local functions that throw TypeError/RangeError as specified.

Reference digest: npm package page retrieved 2026-03-21 (Cloudflare JS challenge prevented full HTML retrieval); initial page fetch size ~13KB
Attribution: npm package page (partial fetch)
