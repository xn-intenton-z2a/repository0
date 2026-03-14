DOCUMENT_LOADER

Table of Contents
- Normalised extract
  - Exact documentLoader contract
  - contextUrl semantics (Link: rel="context")
  - documentUrl semantics (final resolved URL after redirects)
  - Failure and retry behaviour
- Supplementary details
  - Caching, ETag/Last-Modified, TTL
  - User-Agent, timeouts, retries, security
  - React Native & Node differences
- Reference details
  - TypeScript-like signature and return types
  - Option enumerations and effects
  - Implementation patterns and canonicalisation implications
  - Troubleshooting and step-by-step procedures
- Detailed digest
  - Sources and retrieval date
  - Crawl data size notes
- Attribution

---

NORMALISED EXTRACT

Exact documentLoader contract (implementation-ready)
- Signature (language-neutral, TypeScript-like):
  async function documentLoader(url: string, options?: any): Promise<{ contextUrl: string | null; document: any; documentUrl: string }>
- Returned object fields and exact semantics:
  - contextUrl: string | null
    - If the HTTP response included a Link header with rel="context", contextUrl MUST be the value of that header. Otherwise contextUrl MUST be null.
    - Purpose: communicates an out-of-band context location separate from the response body.
  - document: any
    - The parsed response body. For JSON-LD contexts, this is the parsed JSON object. For other content types it is the parsed or raw document used by the processor.
    - The processor must use this value directly for context processing; it must not re-fetch or re-parse unless explicitly configured.
  - documentUrl: string
    - The final resolved URL after following redirects. This MUST be provided and used for provenance and for canonicalisation.
    - If the client followed redirects, documentUrl MUST reflect the final redirect target used when parsing the document.

Redirect and provenance semantics (deterministic requirements)
- documentUrl is authoritative: any canonicalisation or signature process MUST use documentUrl as the provenance identifier; differences in documentUrl between environments will produce different canonical outputs.
- If the loader follows redirects, the final target MUST be exposed via documentUrl and the processor MUST use that value when constructing any derived RDF or canonical forms.

Failure and retry behaviour (exact expectations)
- On transient network errors the loader SHOULD retry with exponential backoff but MAY surface a failure to the caller when retries are exhausted.
- On permanent errors (4xx/5xx) the loader SHOULD reject/throw; calling code (processor) may implement fallback policies such as local context bundles or cached copies.
- For cryptographic workflows (canonicalisation/signing) the loader SHOULD fail fast if a remote context cannot be deterministically resolved; prefer local context bundles to ensure deterministic builds.

SUPPLEMENTARY DETAILS

Caching, ETag and TTL
- Cache by documentUrl (final resolved URL) not by the original request URL to ensure canonical provenance.
- Use ETag and Last-Modified conditional requests where available; maintain short default TTLs and validate freshness for signing/verification scenarios.
- When storing cached contexts include the HTTP response headers used (ETag, Last-Modified, Content-Type) to aid debugging and reproducibility.

User-Agent, timeouts, and retries
- Set an explicit user-agent header to identify the loader (jsonld.js default is 'jsonld.js').
- Configure sensible timeouts and a limited retry policy with exponential backoff for transient network issues.
- For authenticated contexts, the loader should accept optional authorization headers or credentials via options and not hardcode secrets.

Security and vetting of remote contexts
- Do not blindly load user-supplied remote contexts in critical signing paths; accept only vetted or locally-cached contexts for canonical signing flows.
- Validate content-type (application/ld+json for JSON-LD contexts) and parse errors; reject contexts with unexpected content-type or invalid JSON.

React Native and Node differences
- React Native lacks built-in crypto.subtle and TextEncoder required for canonicalization/signing; include polyfills (e.g., data-integrity-rn) before importing jsonld.js.
- Node.js document loaders typically use an HTTP client exposing redirects and user-agent; ensure the chosen HTTP client exposes final response URL after redirects.

REFERENCE DETAILS

TypeScript-like exact signature and return type
- async function documentLoader(url: string, options?: any): Promise<{
    contextUrl: string | null,
    document: any,
    documentUrl: string
  }>

Option enumerations and effects
- options.timeout?: number — milliseconds before aborting the request; default recommended 5000ms for remote contexts in production
- options.headers?: Record<string,string> — additional HTTP headers (e.g., Authorization)
- options.cache?: 'no-cache' | 'validate' | 'force' — loader caching strategy; 'validate' uses ETag/Last-Modified, 'force' uses cached value without network
- options.retry?: { retries: number, factor: number } — controls retry attempts and exponential backoff

Implementation patterns (deterministic and production-ready)
- Canonical cache key: use documentUrl (final resolved URL) plus response Content-Type and ETag to identify cached context versions.
- Deterministic resolution: for signing/verification, pin contexts to specific documentUrl + ETag or supply a local context bundle to guarantee identical content across environments.
- Error handling: throw/reject on unexpected content-type or parse errors. Provide a clear error object: { name, message, url, statusCode, responseHeaders } to aid reproducibility.

Step-by-step usage sequence (no code block, implementation steps)
1. Call documentLoader(url) to retrieve the context document.
2. If response contains Link: rel="context" set contextUrl to that link value, else null.
3. Parse response body into document (JSON.parse for JSON-LD contexts) and include documentUrl equal to final resolved URL after redirects.
4. Store cached copy keyed by documentUrl and ETag for future retrievals with validation.
5. Return { contextUrl, document, documentUrl } to the JSON-LD processor.
6. When canonicalising for signing, ensure cached document is the same across environments by pinning to documentUrl+ETag or using a local bundle.

Troubleshooting procedures (step-by-step)
- Symptom: "canonical outputs differ between signer and verifier"
  1. Verify both environments use the same documentLoader behavior: compare documentUrl and the exact document content bytes for any remote contexts.
  2. If documentUrl differs, compare redirect chains and HTTP client behavior; adjust loader to expose final URL consistently.
  3. If document content differs, compare ETag/Last-Modified and cached copies; fetch fresh copies and re-run canonicalisation steps.
- Symptom: "failed to load remote context intermittently"
  1. Check network connectivity and DNS resolution.
  2. Inspect HTTP status codes and retry logs; increase retries or use cached fallback for short outages.
  3. Consider bundling critical contexts locally for deterministic availability.
- Symptom: "remote context content parsing error"
  1. Inspect Content-Type header; if not application/ld+json, validate whether alternative content types are acceptable.
  2. Dump raw response body and run JSON validation; if malformed, contact the context provider or rely on a pinned local copy.

DETAILED DIGEST

- Sources processed (from repository SOURCES.md):
  - JSON-LD 1.1 Syntax: https://www.w3.org/TR/json-ld11/ (retrieved 2026-03-14)
  - JSON-LD community site: https://json-ld.org/ (retrieved 2026-03-14)
  - JSON-LD 1.1 Processing Algorithms and API: https://www.w3.org/TR/json-ld11-api/ (retrieved 2026-03-14)
  - jsonld.js README (digitalbazaar): https://github.com/digitalbazaar/jsonld.js (retrieved 2026-03-14)
  - RDF 1.1 Primer: https://www.w3.org/TR/rdf11-primer/ (retrieved 2026-03-14)
  - OWL 2 Overview: https://www.w3.org/TR/owl2-overview/ (retrieved 2026-03-14)
  - N3.js README: https://github.com/rdfjs/N3.js (retrieved 2026-03-14)
  - rdflib.js README: https://github.com/linkeddata/rdflib.js (retrieved 2026-03-14)

- Crawl data size notes: web_fetch calls were limited to 20,000 characters per URL for this extraction; larger normative pages were truncated in the fetch output and are flagged in the digest documents.

ATTRIBUTION

Condensed from W3C JSON-LD 1.1 (syntax and API), json-ld.org guidance, digitalbazaar/jsonld.js README and RDF/OWL primers and library READMEs; retrieval date: 2026-03-14.
