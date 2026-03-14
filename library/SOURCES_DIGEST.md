SOURCES_DIGEST

Table of Contents
- Normalised extract
  - JSON-LD Processing API (method signatures and behaviours)
  - Document loader contract (exact return shape and redirect semantics)
  - Canonicalization & signing (algorithm, format, step sequence)
  - JSON-LD processing algorithms (context, expansion, compaction, flattening, framing, RDF conversion)
  - jsonld.js implementation notes (bundles, loaders, safe mode, RN polyfills)
  - RDF fundamentals needed for implementers (triples, IRIs, literals, datasets, serializations)
  - N3.js API surface (DataFactory, Parser, StreamParser, Writer, Store)
  - rdflib.js API surface (graph, serialize, fetcher, UpdateManager, serializer flags)
  - OWL 2 practical choices (syntaxes, profiles and when to use them)
- Supplementary details
  - JsonLdOptions enumerated with types and effects
  - Document loader behaviour, caching and UA guidance
  - N3.Parser and Writer option specifics
  - rdflib serializer flags and effects
- Reference details
  - Full TypeScript-style method signatures for JSON-LD API and jsonld.js
  - Document loader exact contract
  - N3.js factory and parser signatures
  - rdflib.serialize signature and flag semantics
  - RDF MIME types mapping and JSON-LD-to-RDF mapping rules
  - OWL 2 profile guarantees and mandatory interchange format
  - Canonicalization usage pattern and precise option values
- Troubleshooting and step-by-step procedures
  - "term not defined", "lossy compaction", "failed to load remote context", canonicalization mismatch
- Detailed digest
  - SOURCES list and retrieval date
- Attribution and crawl data size

---

Normalised extract

1) JSON-LD Processing API (implementation-ready details)
- Method signatures (language-neutral, TypeScript-like):
  - compact(input: object | string, context: object | string, options?: JsonLdOptions): Promise<object>
    - Input: an in-memory JSON-LD document or a URL string resolving to one.
    - Behaviour: uses active context (provided or resolved) to select short terms via the inverse context and returns a compacted document object.
    - Returns: Promise resolved with a compacted JSON-LD document (object).
  - expand(input: object | string, options?: JsonLdOptions): Promise<Array<object>>
    - Returns: expanded array of node objects where all property IRIs are absolute and values normalized as value objects or node objects.
  - flatten(input: object | string, context?: object | string, options?: JsonLdOptions): Promise<Array<object>>
    - Returns: flattened node map as an array of node objects keyed by @id.
  - frame(input: object | string, frame: object | string, options?: JsonLdOptions & FrameOptions): Promise<object>
    - Behaviour: applies framing rules to produce a tree-shaped document matching the frame.
  - toRDF(input: object | string, options?: JsonLdOptions & { format?: string, produceGeneralizedRdf?: boolean }): Promise<string | RDFDataset>
    - options.format: e.g., 'application/n-quads' to receive an N-Quads string; otherwise may yield a dataset object.
  - fromRDF(input: string | RDFDataset, options?: JsonLdOptions & { format?: string, useNativeTypes?: boolean }): Promise<object>
    - Behaviour: converts RDF dataset (N-Quads or dataset object) to JSON-LD.
  - canonize(input: object | string, options?: { algorithm?: 'URDNA2015' | string, format?: 'application/n-quads' | string }): Promise<string>
    - Recommended: algorithm: 'URDNA2015', format: 'application/n-quads'. Returns deterministic N-Quads string suitable for hashing/signing.
  - registerRDFParser(contentType: string, parser: (input: string) => RDFDataset | Promise<RDFDataset>): void
    - Parser may be synchronous (returns RDFDataset) or asynchronous (returns Promise<RDFDataset>).

2) Document loader contract (exact shape and semantics)
- Signature: async function documentLoader(url: string, options?: any) => Promise<{ contextUrl: string | null; document: any; documentUrl: string }>
- Returned fields and semantics:
  - contextUrl: string | null — value from Link header indicating a context document URL; null when absent.
  - document: any — parsed response body (for contexts, the JSON object); must be the actual document content used in processing.
  - documentUrl: string — the final resolved URL after redirects; required for provenance/canonicalization.
- Redirects: implementer MUST return documentUrl equal to the final redirected URL. Caller relies on documentUrl for canonicalization and provenance.
- Failure: loader should throw/reject on fatal network errors; callers may implement retries, fallbacks or use a local context cache.

3) Canonicalization & signing (precise steps and option values)
- Use: canonize(input, { algorithm: 'URDNA2015', format: 'application/n-quads' }) to obtain a canonical N-Quads string.
- Recommended signing flow (deterministic):
  1. expanded = await jsonld.expand(input, { documentLoader, processingMode: 'json-ld-1.1' })
  2. nquads = await jsonld.toRDF(expanded, { format: 'application/n-quads', produceGeneralizedRdf: false })
  3. canonical = await jsonld.canonize(nquads, { algorithm: 'URDNA2015', format: 'application/n-quads' })
  4. signature_input = canonical (exact UTF-8 bytes); then hash (e.g., SHA-256) and sign.
- Use safe: true in expand/compact where you need the processor to throw on lossy transformations (important when canonicalizing for signatures).

4) JSON-LD processing algorithms (I/O and operational rules)
- Context Processing: input contexts (local and remote) are merged in order; Create Term Definition algorithm resolves @id, @type, @container, @language, @prefix, @protected; build inverse context for term selection.
- Expansion: maps compacted terms to absolute IRIs using term definitions, expands values into value objects: { "@value": v, "@type": t } or node objects { "@id": ... }. Resolves compact IRIs and CURIEs per context.
- Compaction: uses inverse context to select shortest terms for IRIs and prefers terms with matching container/type combos; options compactArrays controls single-element array compaction.
- Flattening: produces a node map, generating blank node identifiers for nodes without @id, merges nodes with same @id.
- Framing: finds and embeds nodes according to a frame, producing deterministic tree-shaped outputs controlled by embed/explicit/requireAll options.
- RDF mapping specifics (exact rules):
  - Property name (IRI) -> RDF predicate
  - Node with @id -> RDF subject (IRI) or object (IRI) as appropriate
  - Value object {"@value": v, "@type": t} -> RDF literal with datatype t
  - Value object {"@value": v, "@language": lang} -> literal with language tag; mapped to rdf:langString for some processors
  - @type entries -> rdf:type triples
  - @list -> RDF collection assembled as rdf:first/rdf:rest chain ending in rdf:nil
  - Blank nodes: generate stable labels only for local processing; use URDNA2015 to canonicalize labels across runs

5) jsonld.js implementation notes (deployment-ready)
- Bundles: ./dist/jsonld.min.js (broad compatibility), ./dist/jsonld.esm.min.js (ES module optimized). Use ESM bundle for modern browsers to reduce size.
- Node.js usage: import jsonld from 'jsonld' or const jsonld = require('jsonld'); default Node document loader sets user-agent 'jsonld.js'.
- Custom documentLoader: override jsonld.documentLoader = customLoader or pass documentLoader in call options.
- Safe mode: pass option safe: true to expand/compact to make processor throw on lossy operations—use when canonicalizing/signing.
- React Native: requires global polyfills for crypto.subtle and TextEncoder (e.g., data-integrity-rn) before importing jsonld.
- registerRDFParser: register custom RDF parsers by MIME type to support toRDF/fromRDF for non-default formats.

6) RDF fundamentals for implementers (practical rules)
- Triple form: subject (IRI|blank), predicate (IRI), object (IRI|blank|literal).
- IRIs: resolve relative IRIs using base IRI per RFC3987 and JSON-LD @base or HTML base element.
- Literals: map JSON native types to XSD datatypes when converting to RDF: integers -> xsd:integer; floats -> xsd:double; booleans -> xsd:boolean; language-tagged strings -> rdf:langString.
- Datasets: use application/n-quads for datasets with named graphs; default graph is unnamed.
- Serializations and MIME types: text/turtle; application/trig; application/n-quads; application/n-triples; application/rdf+xml; application/ld+json.

7) N3.js API surface (compact reference)
- DataFactory:
  - namedNode(iri: string): NamedNode
  - literal(value: string, languageOrDatatype?: string): Literal
  - blankNode([id?]): BlankNode
  - defaultGraph(): DefaultGraph
  - quad(subject: Term, predicate: Term, object: Term, graph?: Term): Quad
- Parser:
  - new N3.Parser(options?: { format?: string, baseIRI?: string, blankNodePrefix?: string, isImpliedBy?: boolean, comments?: boolean })
  - parser.parse(input: string | stream, callback?: (err: Error | null, quad: Quad | null, prefixes?: object) => void): Quad[] | void
- StreamParser: Node.js stream and RDF/JS Sink interface; emits quads as data arrives.
- Writer:
  - new N3.Writer(outputStreamOrOptions?, options?) with { prefixes?: object, format?: string }
  - writer.addQuad(...) and writer.end((err, result) => { /* serialized */ }) or stream mode.
- Store (N3.Store): in-memory Dataset implementing RDF/JS Dataset interface:
  - addQuad(quad), addQuads(array), removeQuad, removeMatches(subject?, predicate?, object?, graph?), getQuads(...), match(...), createBlankNode(), size property.
- Streaming advice: use StreamParser / StreamWriter for files larger than memory and avoid buffering full dataset.

8) rdflib.js API surface (compact reference)
- graph(): IndexedFormula store (in-memory knowledge base).
- serialize(documentNode: NamedNode, kb: IndexedFormula, baseIRI: string, mimeType: string, callback?: (err: Error|null, result?: string) => void, options?: { flags?: string }): string | void
  - options.flags: serialization flags string controlling abbreviation/prefixing; examples: 'o', 'dr', 'p', combinations like 'o k'.
- sym(iri): NamedNode factory; fetcher: new Fetcher(store, options) with fetcher.load(uriOrNode, options) returning Promise for HTTP retrievals.
- UpdateManager(store): handles PUT/PATCH/POST updates; used for authenticated Linked Data writes.
- Serializer flags:
  - 'o' : do not abbreviate local parts containing dots
  - 'p' : disable prefix abbreviation (full IRIs)
  - 'dr' : flags for JSON-LD conversion and relative prefix handling

9) OWL 2 practical choices (syntax, profiles, mapping)
- Mandatory interchange syntax for OWL 2 conformance: RDF/XML (implementations must support it); optional but common: Turtle, OWL/XML, Functional-Style, Manchester Syntax.
- Mapping to RDF graphs is normative: always convert structural syntax to RDF triples per the OWL2 mapping for storage/processing in triple stores.
- Profiles and when to choose them:
  - OWL 2 EL: polynomial-time reasoning; choose for very large terminologies (medical/biomedical taxonomies).
  - OWL 2 QL: optimized for query answering via relational backends; choose when heavy conjunctive query workloads target SQL stores.
  - OWL 2 RL: rule-based processing on RDF triples; implement as rule set for RDF triple stores where soundness is prioritized and completeness is acceptable only under profile conformance.

---

Supplementary details

JsonLdOptions (fields, types and direct effects)
- base?: string — base IRI for resolving relative IRIs (default: document base).
- processingMode?: 'json-ld-1.1' | 'json-ld-1.0' — toggles algorithm variants; default: 'json-ld-1.1'.
- documentLoader?: (url: string, options?: any) => Promise<{ contextUrl: string | null; document: any; documentUrl: string }> — overrides remote retrieval behaviour.
- expandContext?: object | string — additional context applied during expansion.
- safe?: boolean — when true, fail on lossy operations (use for canonicalization/signing).
- compactArrays?: boolean — when true permit single-element arrays to be compacted to single values.
- skipExpansion?: boolean — non-normative performance hint to bypass expansion in optimized implementations.
- produceGeneralizedRdf?: boolean (toRDF) — when true, allow generalized RDF (e.g., multiple rdf:langString datatypes), otherwise restricted.

Document loader recommendations
- Production: implement custom documentLoader that:
  - caches contexts by URL with TTL and ETag support
  - sets an identifiable user-agent and timeouts
  - retries transient failures with backoff
  - exposes final documentUrl after redirects
- Security: do not blindly load remote contexts from user-supplied URLs without vetting/caching; prefer local context bundles for mission-critical signing.

N3.Parser options (behavioral effects)
- format: force strict parsing of a chosen syntax (e.g., 'N-Triples', 'application/trig').
- baseIRI: base IRI used for relative IRI resolution in the parser.
- blankNodePrefix: change blank node prefix to avoid collisions across parallel parses; empty string disables prefixing.
- isImpliedBy: controls how implication rules are represented in output.

rdflib serialize flags (practical effects)
- supply flags via options.flags to control prefix abbreviation; combine flags (space-separated) to compose behaviours; user-provided flags are merged with defaults.

---

Reference details (precise signatures, parameter lists and return types)

JSON-LD API (TypeScript-like signatures)
- compact(input: object | string, context: object | string, options?: JsonLdOptions): Promise<object>
- expand(input: object | string, options?: JsonLdOptions): Promise<Array<object>>
- flatten(input: object | string, context?: object | string, options?: JsonLdOptions): Promise<Array<object>>
- frame(input: object | string, frame: object | string, options?: JsonLdOptions & { embed?: boolean; explicit?: boolean; requireAll?: boolean }): Promise<object>
- toRDF(input: object | string, options?: JsonLdOptions & { format?: string; produceGeneralizedRdf?: boolean }): Promise<string | RDFDataset>
- fromRDF(input: string | RDFDataset, options?: JsonLdOptions & { format?: string; useNativeTypes?: boolean }): Promise<object>
- canonize(input: object | string, options?: { algorithm?: 'URDNA2015' | string; format?: 'application/n-quads' | string }): Promise<string>
- registerRDFParser(contentType: string, parser: (input: string) => RDFDataset | Promise<RDFDataset>): void

N3.js key signatures
- DataFactory.namedNode(iri: string): NamedNode
- DataFactory.literal(value: string, languageOrDatatype?: string): Literal
- DataFactory.blankNode(id?: string): BlankNode
- DataFactory.quad(subject: Term, predicate: Term, object: Term, graph?: Term): Quad
- new N3.Parser(options?): parser.parse(input, callback?) => Quad[] | void
- new N3.Writer(options?): writer.addQuad(...); writer.end(callback)
- new N3.Store([...quads], options?): store.addQuad(quad); store.getQuads(s,p,o,g); store.match(s,p,o,g)

rdflib.js serialize signature
- serialize(documentNode: NamedNode, kb: IndexedFormula, baseIRI: string, mimeType: string, callback?: (err: Error|null, result?: string) => void, options?: { flags?: string }): string | void

RDF MIME types and typical usage
- text/turtle — human-editable Turtle, good for authoring
- application/trig — TriG for datasets with named graphs
- application/n-quads — canonical machine format for datasets; recommended for canonicalization and signing
- application/ld+json — JSON-LD payloads served over HTTP
- application/rdf+xml — mandatory OWL2 interchange format for conformance testing

OWL 2 profile guarantees (concise)
- EL: polynomial-time reasoning for classification; prefer for very large taxonomies
- QL: query rewriting to SQL (AC0 data complexity); prefer for relational-backed query answering
- RL: rule-backed triple-store reasoning; implementers should provide the profile rule set to guarantee soundness; completeness only if ontology adheres to RL syntactic restrictions

---

Troubleshooting procedures (step-by-step)

A) Symptom: "term not defined" during compaction
1. Inspect active context (explicitly pass expandContext) for missing mapping.
2. If context is remote, validate documentLoader(url) returns the proper document and documentUrl; check for HTTP errors or redirects.
3. Add explicit @context mapping in the request or bundle the context locally and pass a custom documentLoader to return it.

B) Symptom: "lossy compaction" or missing triples after round-trip
1. Run expand() to view fully expanded node objects and identify missing fields.
2. Use canonize(toRDF(expanded), { algorithm: 'URDNA2015', format: 'application/n-quads' }) to produce deterministic RDF for comparison.
3. Enable safe: true to force errors where compaction would drop information and adjust context/terms to preserve types/containers.

C) Symptom: "failed to load remote context"
1. Check network reachability, DNS and HTTP status codes.
2. Ensure documentLoader follows redirects and returns documentUrl; if necessary add timeouts and retries.
3. Provide a cached local context or mapping as a fallback to avoid runtime failures.

D) Symptom: canonicalization mismatch between signer and verifier
1. Confirm both use algorithm: 'URDNA2015' and format: 'application/n-quads'.
2. Confirm both use identical documentLoader behaviour for remote contexts (same documentUrl and resolved contexts).
3. Re-run expand() and toRDF() steps deterministically and compare canonicalized outputs byte-for-byte before hashing/signing.

Best practices (concrete)
- Always use a custom documentLoader in server environments to control caching, timeouts and UA; avoid unbounded remote context loading.
- For signing, do not sign compacted JSON-LD; instead expand -> toRDF(format: application/n-quads) -> canonize(URDNA2015) -> sign canonical string.
- Use safe: true for cryptographic workflows.
- For large RDF data, use N3.StreamParser and StreamWriter to process data incrementally and avoid materializing full N-Quads strings.
- When targeting modern browsers, prefer jsonld.esm.min.js; include polyfills for React Native (crypto.subtle, TextEncoder) before importing jsonld.
- Choose OWL2 profile according to compute/query workload: EL for classification at scale, QL for SQL-backed query answering, RL for rule/triple-store based inference.

---

Detailed digest
- Sources processed (from repository SOURCES.md) and retrieval date: 2026-03-14
  - https://www.w3.org/TR/json-ld11/  (JSON-LD 1.1 Syntax) — fetched (truncated where noted)
  - https://json-ld.org/  (JSON-LD community site, playground) — fetched
  - https://www.w3.org/TR/json-ld11-api/  (JSON-LD 1.1 Processing Algorithms and API) — fetched (truncated where noted)
  - https://github.com/digitalbazaar/jsonld.js  (jsonld.js implementation) — fetched
  - https://www.w3.org/TR/owl2-overview/  (OWL 2 overview) — fetched (truncated where noted)
  - https://www.w3.org/TR/rdf11-primer/  (RDF 1.1 Primer) — fetched (truncated where noted)
  - https://github.com/rdfjs/N3.js  (N3.js repository) — fetched
  - https://github.com/linkeddata/rdflib.js  (rdflib.js repository) — fetched
- Fetch method constraints and data sizes: pages were retrieved with web_fetch limits (per-run max_length parameters between 15k and 20k characters); several long normative pages were truncated and contain a note indicating truncation. Where truncation occurred, a second fetch with a start_index is required to retrieve remainder; summary entries above include the portions used for extraction.

Attribution and crawl data size
- Attribution: material extracted directly from the W3C specifications (JSON-LD 1.1, JSON-LD API, OWL2 overview, RDF Primer) and from open-source library repositories (digitalbazaar/jsonld.js, rdfjs/N3.js, linkeddata/rdflib.js) retrieved on 2026-03-14.
- Data size obtained: web_fetch calls returned up to the configured max_length per page (15k–20k characters per fetch) and indicated where content was truncated. Aggregate extracted text used to build this document is a condensed selection drawn from those fetches; for full normative text consult the original URLs listed above.

---

End of SOURCES_DIGEST
