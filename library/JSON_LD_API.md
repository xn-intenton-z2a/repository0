JSON_LD_API

Table of Contents
- Normalised extract
  - JsonLdProcessor interface and method contracts
  - JsonLdOptions type (fields and effects)
  - Document loader contract (exact shape and behavior)
  - Core algorithms referenced by the API (Context Processing, Expansion, Compaction, Flattening, Framing, RDF Serialization/Deserialization, Canonicalization)
- Supplementary details
  - Error handling semantics and processingMode differences
  - Remote context retrieval, caching, and user-agent behavior
  - Canonicalization (URDNA2015) specifics and format options
- Reference details (API signatures, parameter types, return types, option field enumerations, exact effects)
  - Complete method signatures with parameter and return types
  - JsonLdOptions fields list with types and default behavior
  - Document loader exact return contract and redirect handling
  - registerRDFParser contract
  - Canonicalization options and usage for cryptographic signing
  - Best practices and step-by-step troubleshooting procedures
- Detailed digest
  - Source: https://www.w3.org/TR/json-ld11-api/ (retrieved 2026-03-14)
  - Data size: web fetches limited to 20,000 characters per page; some content truncated where noted
- Attribution
  - Content extracted from W3C JSON-LD 1.1 Processing Algorithms and API and related JSON-LD community materials (json-ld.org, jsonld.js)

Normalised extract

JsonLdProcessor interface and method contracts
- JsonLdProcessor is the API surface that implements the JSON-LD processing algorithms. The canonical method signatures (TypeScript-like) are:
  - compact(input: object | string, context: object | string, options?: JsonLdOptions): Promise<object>
    - input: JSON-LD document object or URL string resolving to a JSON-LD document
    - context: context object or URL string; used to compact the expanded input
    - options: JsonLdOptions (see below)
    - returns: Promise resolving to a compacted JSON-LD document object
  - expand(input: object | string, options?: JsonLdOptions): Promise<Array<object>>
    - returns: Promise resolving to an expanded array of node objects where all terms are absolute IRIs and value objects are normalized
  - flatten(input: object | string, context?: object | string, options?: JsonLdOptions): Promise<Array<object>>
    - returns: flattened node map as an array of node objects
  - frame(input: object | string, frame: object | string, options?: JsonLdOptions): Promise<object>
    - frame: frame object or URL; returns a framed document shaped per the frame rules
  - toRDF(input: object | string, options?: JsonLdOptions & {format?: string}): Promise<string | RDFDataset>
    - options.format: MIME type such as 'application/n-quads' to produce N-Quads string; otherwise may return an RDF dataset object
  - fromRDF(input: string | RDFDataset, options?: JsonLdOptions): Promise<object>
    - input: N-Quads string or RDF dataset object; converts RDF to JSON-LD
  - canonize(input: object | string, options?: {algorithm?: string, format?: string}): Promise<string>
    - options.algorithm: 'URDNA2015' (recommended), options.format: 'application/n-quads'
    - returns: canonicalized string suitable for hashing/signing
  - registerRDFParser(contentType: string, parser: (input: string) => RDFDataset | Promise<RDFDataset>): void
    - registers a parser for a given contentType; parser may be synchronous or return a Promise

JsonLdOptions type (fields and effects)
- base?: string
  - Base IRI used for resolving relative IRIs; default: document base or HTTP/HTML base
- processingMode?: 'json-ld-1.1' | 'json-ld-1.0'
  - Controls algorithm variants and edge-case behavior; default: 'json-ld-1.1'
- documentLoader?: (url: string, options?: any) => Promise<{contextUrl: string | null, document: any, documentUrl: string}>
  - Custom document loader for remote contexts and external resources; must return the document and the final documentUrl after redirects
- expandContext?: object | string
  - Additional context to apply during expansion
- safe?: boolean
  - When true, processor must fail on lossy conversions and ambiguous coercions; recommended when preparing data for canonicalization/signing
- compactArrays?: boolean
  - When true, single-element arrays may be represented as single values in compaction; affects deterministic outputs
- framed?: boolean (implementation hint)
  - Internal optimization toggle used by some implementations; non-normative
- skipExpansion?: boolean (implementation hint)
  - May improve performance but must preserve semantics when used correctly; non-normative

Document loader contract (shape and semantics)
- Signature: async function documentLoader(url: string, options?: any) => Promise<{contextUrl: string | null, document: any, documentUrl: string}>
- Returned object fields:
  - contextUrl: string | null — URL provided via HTTP Link header for context documents; null when absent
  - document: any — the parsed JSON or document content; for JSON-LD contexts this is the context object
  - documentUrl: string — the actual URL after redirects; required for canonicalization and provenance
- Redirect handling: implementations must expose the final resolved URL via documentUrl; implementers should configure timeouts and retries and consider caching remote contexts
- Recommended behavior for production: supply a custom documentLoader that caches remote contexts, applies timeouts, and sets a sensible user-agent header

Core algorithms referenced by the API (IO and effects)
- Context Processing Algorithm
  - Input: set of context objects and base IRI
  - Output: term definitions mapping, inverse context for compaction, computed default vocabulary and base
  - Key steps: createTermDefinition for each term; merge remote contexts in-order; respect @protected
- Expansion Algorithm
  - Input: JSON-LD document + active context
  - Output: expanded array of node objects (absolute IRIs, normalized values)
  - Behavior: resolves terms via context, expands compact IRIs and CURIEs, expands values into value objects or node objects
- Compaction Algorithm
  - Input: expanded form + active context
  - Output: compacted document selecting short terms from inverse context; performs term selection and container handling
- Flattening Algorithm
  - Input: expanded form
  - Output: node map with flattened nodes keyed by @id
- Framing Algorithm
  - Input: expanded form + frame
  - Output: tree-shaped document conforming to frame; uses framing semantics for default values and optional embedding
- RDF Serialization / Deserialization
  - toRDF: converts expanded JSON-LD to RDF Dataset (quads); use N-Quads ('application/n-quads') for canonicalization
  - fromRDF: converts RDF Dataset to JSON-LD with optional context for compaction
- Canonicalization (URDNA2015)
  - Produces deterministic N-Quads ordering and stable blank node labels; recommended algorithm 'URDNA2015' with format 'application/n-quads' for signing

Supplementary details

Error handling semantics and processingMode differences
- Errors are surfaced as thrown exceptions (or rejected Promises) with diagnostic messages. Implementations should include the algorithm step and cause where possible.
- processingMode differences:
  - 'json-ld-1.0' may permit legacy behaviors; 'json-ld-1.1' enforces stricter rules (recommended default)
  - Implementors must document any deviations and provide compatibility layers if supporting both modes

Remote context retrieval, caching, and user-agent behavior
- Default Node.js document loaders often set a user-agent string such as 'jsonld.js'. Override via a custom documentLoader when specific headers or auth are required.
- Caching strategy: cache contexts by URL with short TTLs or use ETag/Last-Modified verification; do not cache indefinitely unless explicitly configured
- Robustness: implement retries with backoff and a fallback to local context bundles when remote retrieval fails

Canonicalization specifics and format options
- canonize(input, {algorithm: 'URDNA2015', format: 'application/n-quads'}) => Promise<string>
  - algorithm: 'URDNA2015' currently recommended for RDF dataset canonicalization; other algorithms may be supported but produce different outputs
  - format: 'application/n-quads' yields N-Quads string; certain libraries may return an RDF dataset object if format omitted
- Use canonicalized N-Quads string as input to cryptographic hashing (e.g., SHA-256) for signing

Reference details (API signatures, parameter types, return types, option enumerations)

Complete method signatures (TypeScript-like) and parameter details
- compact(
    input: object | string,
    context: object | string,
    options?: {
      base?: string,
      documentLoader?: (url: string, options?: any) => Promise<{contextUrl: string|null, document: any, documentUrl: string}>,
      processingMode?: 'json-ld-1.1' | 'json-ld-1.0',
      safe?: boolean,
      expandContext?: object | string,
      compactArrays?: boolean,
      skipExpansion?: boolean
    }
  ): Promise<object>

- expand(
    input: object | string,
    options?: { base?: string, documentLoader?: Function, processingMode?: string }
  ): Promise<Array<object>>

- flatten(
    input: object | string,
    context?: object | string,
    options?: JsonLdOptions
  ): Promise<Array<object>>

- frame(
    input: object | string,
    frame: object | string,
    options?: JsonLdOptions & {embed?: boolean, explicit?: boolean, requireAll?: boolean}
  ): Promise<object>

- toRDF(
    input: object | string,
    options?: {format?: string, documentLoader?: Function, produceGeneralizedRdf?: boolean}
  ): Promise<string | RDFDataset>

- fromRDF(
    input: string | RDFDataset,
    options?: {format?: string, useNativeTypes?: boolean}
  ): Promise<object>

- canonize(
    input: object | string,
    options?: {algorithm?: 'URDNA2015' | string, format?: 'application/n-quads' | string}
  ): Promise<string>

- registerRDFParser(contentType: string, parser: (input: string) => RDFDataset | Promise<RDFDataset>): void

Document loader exact return contract and redirect handling
- documentLoader must return an object with fields:
  - contextUrl: string | null
  - document: any (parsed JSON or response body)
  - documentUrl: string (the final resolved URL after redirects)
- Failure modes:
  - If document retrieval fails, documentLoader should throw/reject; calling code may catch and implement fallback
  - For contexts used in expansion/compaction the processor will propagate the error unless options provide an alternate local context

registerRDFParser contract
- registerRDFParser(contentType: string, parser: (input: string) => RDFDataset | Promise<RDFDataset>)
  - contentType: MIME type string e.g., 'application/n-quads'
  - parser: function transforming an input string into an RDFDataset compatible with the processor's expected dataset object

Canonicalization options and usage for cryptographic signing
- Recommended flow for signing:
  1. expand(input, {documentLoader, processingMode: 'json-ld-1.1'})
  2. toRDF(expanded, {format: 'application/n-quads', produceGeneralizedRdf: false})
  3. canonize(nquadsString, {algorithm: 'URDNA2015', format: 'application/n-quads'})
  4. hash the resulting canonical string with chosen hash (e.g., SHA-256) and sign
- For verification, canonicalize the signed input using same algorithm and compare hashes

Best practices and step-by-step troubleshooting
- Symptom: "term not defined" during compaction
  1. Inspect the active context; ensure the term is present or provided via expandContext
  2. If context is remote, verify documentLoader returns the expected context object and documentUrl
  3. Provide explicit context mapping in the request or use a local context bundle

- Symptom: "lossy compaction" (information lost during compact/expand round-trip)
  1. Use expand() to inspect the expanded form and locate missing properties
  2. If canonicalization/signing is required, enable safe: true to force errors on lossy operations
  3. Avoid compacting before signing; canonicalize N-Quads derived from expanded form instead

- Symptom: "failed to load remote context"
  1. Check network reachability and HTTP response codes
  2. Ensure documentLoader implements redirects and returns documentUrl
  3. Provide a cached local context or fallback mapping to continue processing

Detailed digest
- Source processed: JSON-LD 1.1 Processing Algorithms and API (https://www.w3.org/TR/json-ld11-api/) retrieved 2026-03-14
- Additional references used while extracting: JSON-LD 1.1 Syntax (https://www.w3.org/TR/json-ld11/), json-ld.org, jsonld.js README
- Data size: web fetches limited to 20,000 characters per page; several pages were truncated and flagged in fetch output

Attribution
- Extracted from the JSON-LD 1.1 Processing Algorithms and API W3C Recommendation and related JSON-LD community resources (json-ld.org, jsonld.js), retrieved 2026-03-14

End of JSON_LD_API document
