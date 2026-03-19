NPM_PACKAGE

Table of contents
- Package metadata observed
- API surface (observed / recommended signatures)
- Notes about external implementations and license
- Crawl limitations and attribution

Package metadata observed
- Package name: roman-numerals (npm listing observed)
- The npm registry page presented an anti-bot challenge on retrieval; full package README was not accessible during crawl.

API surface (recommended for interoperability)
- Implement own named exports to match community expectations:
  - function integerToRoman(n: number): string
  - function romanToInteger(s: string): number
- If consuming the npm package, map or adapt its exported functions to the same names to keep the library API consistent.

Notes about external implementations and license
- Third-party package implementations may expose different function names or permissive licenses; verify license and tests before reuse.
- Because the npm page was Cloudflare-protected at retrieval, direct code extraction was not performed; do not copy code verbatim without license checks.

Crawl limitations and attribution
- Source URL: https://www.npmjs.com/package/roman-numerals
- Retrieval date: 2026-03-19
- Retrieved content: Cloudflare challenge page (JavaScript anti-bot) prevented full HTML extraction; saved challenge HTML of ~ (Cloudflare) ~ ? KB.

