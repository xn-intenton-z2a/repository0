SIGNING

Table of Contents
- Normalised extract
  - Deterministic canonicalisation pipeline (step-by-step)
  - Document loader contract (exact return object and semantics)
  - Verification checklist and failure modes
- Supplementary details
  - Document loader production recommendations (cache keys, ETag, UA, timeouts, retries)
  - Safe mode, React Native polyfills, and environment caveats
  - Caching and provenance for deterministic builds
- Reference details
  - JsonLdProcessor method signatures and JsonLdOptions fields with exact parameter names and values
  - Canonicalisation options and exact API call sequences used for signing/verification
  - Document loader TypeScript-like signature and required returned fields
  - Recommended option values (processingMode, format, algorithm, safe, produceGeneralizedRdf)
- Troubleshooting and step-by-step remediation procedures
- Detailed digest (sources + retrieval date)
- Attribution and crawl data size

Normalised extract

Deterministic canonicalisation pipeline (implementation-ready)
1. Expand the JSON-LD input with a controlled document loader and strict processing mode:
   - Call: expand(input, { documentLoader: loader, processingMode: 'json-ld-1.1', safe: true })
   - Output: an expanded array of node objects where all property names are absolute IRIs and values are normalized value objects or node objects.
2. Convert expanded form to an RDF dataset serialized as N-Quads:
   - Call: toRDF(expanded, { format: 'application/n-quads', produceGeneralizedRdf: false })
   - Output: a single N-Quads string representing the RDF dataset (quadset) derived from the expanded JSON-LD.
3. Canonicalise the N-Quads using URDNA2015:
   - Call: canonize(nquadsString, { algorithm: 'URDNA2015', format: 'application/n-quads' })
   - Output: a deterministic N-Quads string with stable blank-node labels suitable for byte-for-byte hashing.
4. Produce signature input and sign:
   - Treat canonical string as exact UTF-8 bytes; compute cryptographic digest (e.g., SHA-256) and sign with the chosen private key.
5. Verification: the verifier must repeat steps 1–3 using the same loader behaviour and option values; compare canonical bytes before verification.

Document loader contract (exact signature and semantics)
- Signature (TypeScript-like):
  async function documentLoader(url: string, options?: any): Promise<{ contextUrl: string | null; document: any; documentUrl: string }>
- Returned object fields and deterministic semantics:
  - contextUrl: string | null — value of the HTTP Link header with rel="context" when present; otherwise null. This field distinguishes context link locations from the response body.
  - document: any — the parsed response body (for contexts: the JSON object used as the @context); the processor MUST use this value for context processing.
  - documentUrl: string — the final resolved URL after following redirects; MUST be provided and used for provenance and canonicalisation.
- Redirect and provenance rules:
  - documentUrl is authoritative for provenance; canonicalisation must use documentUrl (final target after redirects) when resolving provenance-dependent content.
  - If the loader follows redirects, it MUST expose the final resolved URL via documentUrl; differences in documentUrl across signer and verifier will produce different canonical outputs.
- Error behaviour:
  - On transient network errors, the loader SHOULD retry with exponential backoff but MAY reject after retries are exhausted.
  - On permanent HTTP errors (4xx/5xx) the loader SHOULD reject; callers may implement fallbacks (local context bundles) when determinism is required.

Verification checklist and failure modes
- Ensure signer and verifier use identical jsonld options: processingMode='json-ld-1.1', safe=true, toRDF.format='application/n-quads', canonize.algorithm='URDNA2015', canonize.format='application/n-quads'.
- Confirm both environments use the same documentLoader logic and that loader returns identical documentUrl and document bytes for any remote contexts or imports; any divergence here is the most common cause of canonical mismatch.
- If canonical outputs differ:
  - Compare documentUrl and document bytes for each remote context used; ensure ETag/Last-Modified and redirect chains match.
  - Inspect expanded forms (output of expand) to find structural differences prior to RDF conversion.

Supplementary details

Document loader production recommendations (concrete)
- Cache keys and validation:
  - Key cached contexts by documentUrl (final resolved URL) and include Content-Type and ETag in cache metadata.
  - Validate freshness using ETag or Last-Modified conditional requests; for canonical signing prefer pinned documentUrl+ETag to ensure identical content across environments.
- Headers and identity:
  - Set an explicit User-Agent header to identify the loader (e.g., 'agentic-lib/1.0 jsonld-loader' or use jsonld.js default 'jsonld.js').
- Timeouts and retries:
  - Recommended options: timeout: 5000 (ms), retry: { retries: 3, factor: 2 } with exponential backoff.
- Security:
  - Do not accept unvetted user-supplied remote contexts for signing; use local pinned context bundles for deterministic workflows.
- Deterministic resolution for signing:
  - For cryptographic signing and verification workflows: either pin all remote contexts by documentUrl+ETag, or provide local bundles via custom documentLoader to guarantee identical content bytes.

Environment caveats
- React Native: lacks built-in crypto.subtle and TextEncoder needed for canonicalisation/signature primitives; include polyfills (e.g., data-integrity-rn) before importing jsonld.js.
- Node.js: default document loader generally exposes final resolved URL and sets User-Agent 'jsonld.js'; override when custom headers or auth are required.
- Large datasets: avoid materializing very large N-Quads strings in memory; use streaming RDF writers/readers when supported by canonicaliser or preprocess with chunked strategies.

Reference details

JsonLdProcessor method signatures (TypeScript-like) and exact parameter names
- compact(input: object | string, context: object | string, options?: JsonLdOptions): Promise<object>
- expand(input: object | string, options?: JsonLdOptions): Promise<Array<object>>
- flatten(input: object | string, context?: object | string, options?: JsonLdOptions): Promise<Array<object>>
- frame(input: object | string, frame: object | string, options?: JsonLdOptions & { embed?: boolean; explicit?: boolean; requireAll?: boolean }): Promise<object>
- toRDF(input: object | string | Array<object>, options?: JsonLdOptions & { format?: string; produceGeneralizedRdf?: boolean }): Promise<string | RDFDataset>
- fromRDF(input: string | RDFDataset, options?: JsonLdOptions & { format?: string; useNativeTypes?: boolean }): Promise<object>
- canonize(input: string | object | Array<object>, options?: { algorithm?: 'URDNA2015' | string; format?: 'application/n-quads' | string }): Promise<string>
- registerRDFParser(contentType: string, parser: (input: string) => RDFDataset | Promise<RDFDataset>): void

JsonLdOptions fields (explicit) and recommended values for signing workflows
- base?: string
- processingMode?: 'json-ld-1.1' | 'json-ld-1.0'  (use 'json-ld-1.1')
- documentLoader?: (url: string, options?: any) => Promise<{ contextUrl: string | null; document: any; documentUrl: string }>
- expandContext?: object | string
- safe?: boolean  (set true for signing/canonicalisation)
- compactArrays?: boolean
- skipExpansion?: boolean (non-normative)
- produceGeneralizedRdf?: boolean (toRDF) (use false for canonical N-Quads)

Canonicalisation exact call sequence and parameters (normative for signing)
1. expanded = await expand(input, { documentLoader: loader, processingMode: 'json-ld-1.1', safe: true })
2. nquads = await toRDF(expanded, { format: 'application/n-quads', produceGeneralizedRdf: false })
3. canonical = await canonize(nquads, { algorithm: 'URDNA2015', format: 'application/n-quads' })
4. signature_input = canonical (UTF-8 bytes) -> digest (e.g., SHA-256) -> sign

Troubleshooting and step-by-step remediation
- Symptom: canonical outputs differ between signer and verifier
  1. Verify documentLoader returns identical documentUrl and document content for each remote context; compare bytes and ETag values.
  2. Confirm both sides use algorithm='URDNA2015' and format='application/n-quads' and processingMode='json-ld-1.1' and safe:true.
  3. Use expand() outputs to inspect structural differences prior to RDF conversion.
- Symptom: failed to load remote context intermittently
  1. Check network connectivity and HTTP response codes.
  2. Ensure documentLoader implementation follows redirects and returns documentUrl.
  3. Use cached local context bundles for determinism in signing workflows.
- Symptom: lossy compaction (information missing after round-trip)
  1. Use expand() to identify dropped fields or coercions.
  2. Re-run toRDF() + canonize() on expanded form and enable safe:true to make processor throw on lossy conversions.

Detailed digest (sources processed and retrieval date)
- Sources (from repository SOURCES.md) and retrieval date: 2026-03-14
  - https://www.w3.org/TR/json-ld11/  (JSON-LD 1.1 Syntax) — fetched; content exceeded 20,000 characters and was truncated in the fetch result
  - https://json-ld.org/  (JSON-LD community site and Playground) — fetched (within 20k limit)
  - https://www.w3.org/TR/json-ld11-api/  (JSON-LD 1.1 Processing Algorithms and API) — fetched; content truncated at 20k
  - https://github.com/digitalbazaar/jsonld.js  (jsonld.js repository README and docs) — fetched (within 20k)
  - https://www.w3.org/TR/owl2-overview/  (OWL 2 Overview) — fetched; content truncated at 20k
  - https://www.w3.org/TR/rdf11-primer/  (RDF 1.1 Primer) — fetched; content truncated at 20k
  - https://github.com/rdfjs/N3.js  (N3.js README/docs) — fetched (within 20k)
  - https://github.com/linkeddata/rdflib.js  (rdflib.js README/docs) — fetched (within 20k)
- Crawl/data size note: each web fetch was requested with max_length=20000 characters; pages longer than this were truncated and flagged in fetch output.

Attribution and crawl data size
- Attribution: technical material condensed from W3C JSON-LD 1.1 (syntax and API), json-ld.org guidance, digitalbazaar/jsonld.js README, W3C OWL 2 Overview, W3C RDF 1.1 Primer, rdfjs/N3.js README and linkeddata/rdflib.js README.
- Retrieval date: 2026-03-14
- Data size: web fetches were limited to 20,000 characters per URL during extraction; truncated pages were noted above and should be re-fetched with pagination or larger max_length for full normative text.

End of SIGNING document
