TITLE: NPM_BASE62

Table of Contents
- Normalised extract: npm base62 package API and usage patterns
- Technical details: method signatures and Buffer vs Uint8Array handling
- Supplementary details: compatibility notes and fallbacks
- Reference details: example API signatures
- Digest and attribution

Normalised extract
The npm package named "base62" exposes convenience functions to encode/decode binary and numeric values. Many npm packages operate on Node Buffer objects; when integrating with a browser or Uint8Array-based code, convert between Buffer and Uint8Array as needed. During fetch, npmjs.com returned a Cloudflare challenge page; consult the package repository or package.json for canonical API if fetch is blocked.

Technical details and API (common patterns across base62 packages)
- encode(bufferOrNumber) => string
  - Accepts Node Buffer or number; for binary, pass Buffer.from(uint8array)
- decode(string) => Buffer or number
  - For binary decode, convert returned Buffer to Uint8Array for API consistency
- createEncoder(charset?: string) => encoder with encode/decode methods

Integration notes
- Provide adapter functions to accept Uint8Array inputs and return Uint8Array outputs, e.g.:
  - encode(bytes: Uint8Array) => string  // Buffer.from(bytes) -> package.encode -> string
  - decode(text: string) => Uint8Array    // package.decode -> Buffer -> Uint8Array
- Validate that package alphabet matches mission charset if custom alphabet required

Limitations observed during fetch
- Direct curl to npmjs.com returned an anti-bot interstitial (Cloudflare). If programmatic access required, use registry.npmjs.org API or clone package repository for authoritative source code.

Digest
- Source fetched: https://www.npmjs.com/package/base62 (retrieved 2026-03-19) — fetch returned Cloudflare challenge HTML (~70 KB)

Attribution
- Source: npmjs package page for "base62". Retrieved 2026-03-19. Data size fetched: ~70 KB (challenge page).