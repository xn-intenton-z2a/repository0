CANONICALIZATION

Table of Contents
- Normalised extract
  - Deterministic canonicalization flow (expand -> toRDF -> canonize)
  - Required options and exact method behaviors
  - Document loader contract and provenance requirements
- Supplementary details
  - Option enumerations and effects (safe, format, algorithm, produceGeneralizedRdf)
  - Production recommendations for documentLoader (caching, UA, redirects, ETag)
- Reference details
  - Complete API method signatures for expand, toRDF, canonize and registerRDFParser with parameter types and return types
  - Document loader exact return object shape and redirect handling
  - Concrete signing sequence with exact option values
  - Troubleshooting procedures and deterministic verification steps
- Detailed digest and attribution
  - Sources and retrieval date: 2026-03-14
  - Crawl data size notes

Normalised extract

Deterministic canonicalization flow (implementation-ready steps)
1. Expand the JSON-LD input to expanded form using the JSON-LD processor's expand method with processingMode set to 'json-ld-1.1' and a controlled documentLoader:
   - Call: expand(input, { documentLoader: loader, processingMode: 'json-ld-1.1', safe: true }) => Promise<Array<object>>
   - Effect: returns fully expanded node objects with absolute IRIs and normalized value objects.
2. Convert the expanded form to an RDF dataset in N-Quads format using toRDF with format 'application/n-quads':
   - Call: toRDF(expanded, { format: 'application/n-quads', produceGeneralizedRdf: false }) => Promise<string>
   - Effect: produces N-Quads serialisation of the RDF dataset derived from the expanded JSON-LD.
3. Canonicalise the N-Quads using URDNA2015:
   - Call: canonize(nquadsString, { algorithm: 'URDNA2015', format: 'application/n-quads' }) => Promise<string>
   - Effect: produces a deterministic N-Quads string with stable blank-node labels suitable for hashing and signing.
4. Compute signature input and sign:
   - Treat canonical string as exact UTF-8 byte sequence; hash (e.g., SHA-256) and sign using chosen cryptographic algorithm.
5. Verification requires repeating steps 1-3 with the verifier's environment; canonical outputs must match byte-for-byte prior to hashing.

Document loader and provenance requirements (exact contract)
- Document loader signature: async function documentLoader(url: string, options?: any) => Promise<{ contextUrl: string | null; document: any; documentUrl: string }>
- Returned object fields and exact semantics:
  - contextUrl: string | null — the URL referenced by an HTTP Link header with rel="context", or null when absent.
  - document: any — parsed body (for JSON contexts this is the JSON object) used by the processor.
  - documentUrl: string — the final resolved URL after following redirects; MUST be provided and used for provenance and canonicalisation.
- Redirect behavior: documentLoader MUST expose the final resolved URL in documentUrl. If the loader follows redirects, the documentUrl must reflect the final target used for canonicalisation.
- Failure modes: loader should throw/reject on network errors; callers should implement fallback logic or cached local contexts for signing/verification use cases.

Supplementary details

Option enumerations and effects
- processingMode: 'json-ld-1.1' | 'json-ld-1.0' — selects algorithm variants; use 'json-ld-1.1' for canonicalisation.
- safe: boolean — when true, make the processor fail on lossy conversions; set safe: true for cryptographic workflows to prevent silent data loss.
- format (toRDF/canonize): typically 'application/n-quads' — use N-Quads for canonicalisation and signing.
- algorithm (canonize): 'URDNA2015' recommended — other algorithms produce different canonical outputs and are incompatible.
- produceGeneralizedRdf (toRDF): boolean — set false to avoid generalized RDF when signing; set true only for specialized datasets.

DocumentLoader production recommendations
- Cache remote contexts by documentUrl using ETag/Last-Modified; keep TTLs short and validate with conditional requests to avoid stale contexts during verification.
- Set an explicit user-agent header to identify the loader in server logs; default Node.js loader commonly identifies as 'jsonld.js'.
- Implement retries with exponential backoff for transient errors and a deterministic fallback to a local context bundle for critical signing paths.
- For security: avoid loading unvetted remote contexts specified by untrusted users when performing canonicalisation/signing; prefer local context bundles.

Reference details

API method signatures (TypeScript-like exact signatures)
- expand(input: object | string, options?: { base?: string; documentLoader?: (url:string,opts?:any)=>Promise<{contextUrl:string|null,document:any,documentUrl:string}>; processingMode?: 'json-ld-1.1'|'json-ld-1.0'; safe?: boolean; expandContext?: object | string }): Promise<Array<object>>
- toRDF(input: object | string | Array<object>, options?: { format?: string; documentLoader?: Function; produceGeneralizedRdf?: boolean }): Promise<string | RDFDataset>
- canonize(input: string | object | Array<object>, options?: { algorithm?: 'URDNA2015' | string; format?: 'application/n-quads' | string }): Promise<string>
- registerRDFParser(contentType: string, parser: (input: string) => RDFDataset | Promise<RDFDataset>): void

Exact signing sequence (concrete option values)
1. expanded = await expand(input, { documentLoader: loader, processingMode: 'json-ld-1.1', safe: true })
2. nquads = await toRDF(expanded, { format: 'application/n-quads', produceGeneralizedRdf: false })
3. canonical = await canonize(nquads, { algorithm: 'URDNA2015', format: 'application/n-quads' })
4. signature_input = canonical (UTF-8 bytes) -> digest (e.g., SHA-256) -> sign with private key

Deterministic verification checklist (step-by-step)
1. Confirm verifier uses identical loader behavior: resolves the same documentUrl and returns identical context document content; any divergence alters canonical output.
2. Confirm both signer and verifier use algorithm: 'URDNA2015' and format: 'application/n-quads'.
3. Repeat expand -> toRDF -> canonize steps and compare canonical string bytes; if identical, verify signature using the hashed canonical bytes.

Troubleshooting procedures
- Symptom: canonical outputs differ between signer and verifier
  1. Check documentLoader behavior: compare documentUrl and document content returned for each remote context; differences here are the most common cause.
  2. Check processingMode, safe, algorithm and format option values for exact matches.
  3. Re-run expand and inspect expanded forms; differences in expanded structure indicate context or loader divergence.
- Symptom: remote context failed to load during signing
  1. Ensure documentLoader has caching and retry logic; verify URL respond with expected JSON-LD context and correct Content-Type.
  2. Provide a local context bundle as deterministic fallback for signing workflows.

Detailed digest
- Extracted content drawn from sources listed in repository SOURCES.md and existing library documents (JSON_LD.md, JSON_LD_API.md, JSONLD_JS.md, LINKED_DATA.md, SOURCES_DIGEST.md).
- Retrieval date: 2026-03-14
- Crawl data size: pages fetched with web_fetch limited to 20,000 characters per URL during extraction; longer normative pages were truncated where noted in SOURCES_DIGEST.md.

Attribution
- Content condensed from W3C JSON-LD 1.1 (syntax and API), json-ld.org guidance, and digitalbazaar/jsonld.js README and docs; also cross-referenced RDF and OWL sources where canonicalisation interacts with RDF datasets. Retrieved 2026-03-14.
