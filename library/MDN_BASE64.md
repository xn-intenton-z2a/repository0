MDN — Base64 (Glossary / Web API notes)

Table of contents
- btoa/atob limitations
- Converting between string and Uint8Array
- URL-safe base64 notes
- Encoding/decoding recommendations for binary data
- Supplementary details
- Reference signatures and examples
- Digest and retrieval
- Attribution and data size

btoa/atob limitations
- btoa and atob operate on strings treated as ISO-8859-1 / Latin1; they are not safe for arbitrary UTF-8 text.
- To encode UTF-8 text, first encode to a Uint8Array using TextEncoder, then base64-encode the bytes. To decode base64 to UTF-8, decode to bytes and then use TextDecoder.

Converting between string and Uint8Array (recommended patterns)
- To encode text to base64 safely:
  1. const bytes = new TextEncoder().encode(myString);
  2. const base64 = encoding.encode(bytes); // use library encode that accepts Uint8Array
- To decode base64 to text:
  1. const bytes = encoding.decode(base64String);
  2. const text = new TextDecoder().decode(bytes);

URL-safe base64 notes
- When producing base64 for URLs, use the base64url alphabet and consider omitting padding; ensure the decoder accepts unpadded forms by reconstructing padding based on length mod 4.

Encoding/decoding recommendations for binary data
- Always expose encode/decode APIs that operate on Uint8Array for correctness with arbitrary binary inputs (images, UUID bytes, etc.).
- Avoid exposing btoa/atob directly as public API; provide wrapper helpers that accept/return strings and use TextEncoder/TextDecoder internally.

Reference signatures and examples
- Recommended API (consistent with RFC-based docs):
  - encode(name: string, bytes: Uint8Array): string
  - decode(name: string, encoded: string): Uint8Array

Digest and retrieval
- Extracted technical guidance and implementation patterns from MDN Base64 glossary and Web API notes.
- Retrieved: 2026-03-19

Attribution and data size
- Source: MDN (developer.mozilla.org). Retrieved HTML snapshot on 2026-03-19.