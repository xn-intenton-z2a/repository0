OWL_CHECKLIST

TABLE OF CONTENTS
- Normalised extract
  - Quick evaluation checklist
  - Input normalization and canonicalization
  - Loader and provenance requirements
  - Profile and reasoner selection
  - Concrete detectors (SPARQL/patterns)
- Supplementary details
  - Document loader options and caching
  - Parser/serializer options (N3.js, rdflib.js)
  - Processing flags and safe-mode recommendations
- Reference details
  - JSON-LD API method signatures and JsonLdOptions
  - Canonicalization exact sequence and option values
  - N3.js and rdflib.js API signatures and effects
  - SPARQL detector queries (explicit)
- Detailed digest
  - Sources list and retrieval date
  - Crawl size note
- Attribution and data size

NORMALISED EXTRACT

Quick evaluation checklist (actionable steps)
1. Determine input format. If JSON-LD, use JSON-LD expansion pipeline; if Turtle/TriG/N-Quads, parse with N3.Parser or rdflib parser. If RDF/XML or OWL/XML prefer rdflib for robust XML parsing.
2. Normalize to RDF N-Quads deterministically for comparison and signing using the canonical flow: expand -> toRDF(format: application/n-quads) -> canonize(algorithm: URDNA2015, format: application/n-quads).
3. Load N-Quads into an RDF/JS store (N3.Store or rdflib IndexedFormula) using streaming ingestion for large inputs.
4. Run syntactic profile checks and SPARQL/pattern detectors for OWL 2 DL violations and profile membership (EL/QL/RL). Produce a report of offending axioms with triple locations.
5. Select reasoning approach: prefer OWL 2 RL (rule-based) for in-process JS reasoning; export to an external DL reasoner for Direct Semantics (SROIQ) when full DL inferences are required.
6. For deterministic signing or byte-level comparisons always pin or vet remote contexts by documentUrl+ETag or use local context bundles; ensure documentLoader returns identical documentUrl and document bytes across environments.

Input normalization and canonicalization (exact actionable rules)
- JSON-LD input sequence (normative):
  1. expanded = expand(input, { documentLoader: loader, processingMode: 'json-ld-1.1', safe: true })
  2. nquads = toRDF(expanded, { format: 'application/n-quads', produceGeneralizedRdf: false })
  3. canonical = canonize(nquads, { algorithm: 'URDNA2015', format: 'application/n-quads' })
  4. Use canonical (UTF-8 bytes) as input to hashing (e.g., SHA-256) for signing or deterministic diffs.
- For non-JSON-LD RDF, parse to quads and write application/n-quads via N3.Writer (streaming if large). Do not sign compacted or framed JSON-LD; sign canonical N-Quads from expanded form.

Loader and provenance requirements (must-haves)
- Document loader contract: async documentLoader(url, options?) => Promise({ contextUrl: string|null, document: any, documentUrl: string }). documentUrl must be the final resolved URL after redirects and is authoritative for provenance.
- Cache keyed by documentUrl and ETag; use conditional requests (ETag/Last-Modified). For signing workflows pin contexts to documentUrl+ETag or supply local bundles.
- Set an explicit User-Agent and provide configurable timeouts and retry/backoff. Fail fast in signing paths if remote contexts are not deterministically resolvable.

Profile and reasoner selection (practical guidance)
- If ontology conforms to OWL 2 EL: choose EL toolchain (ELK or EL-specific engines) for scalable classification.
- If annotation/query workload suits QL: use query-rewriting approaches to SQL for data-heavy datasets.
- For in-process JS evaluation prefer OWL 2 RL: implement a forward-chaining rule set over triples (sound, may be incomplete outside profile).
- For complete DL inferences use an external DL reasoner (HermiT, Pellet) that supports Direct Semantics after mapping ontology to structural form or RDF.

Concrete detectors (explicit SPARQL/patterns to run)
- Transitive property in cardinality restriction (OWL 2 DL violation):
  SELECT ?p ?r ?n WHERE {
    ?p a <http://www.w3.org/2002/07/owl#TransitiveProperty> .
    ?r a <http://www.w3.org/2002/07/owl#Restriction> ;
       <http://www.w3.org/2002/07/owl#onProperty> ?p ;
       <http://www.w3.org/2002/07/owl#cardinality> ?n .
  }
- Detect property chains: SELECT ?s WHERE { ?s <http://www.w3.org/2002/07/owl#propertyChainAxiom> ?chain . }
- Detect qualified cardinality restrictions: SELECT ?r WHERE { ?r a <http://www.w3.org/2002/07/owl#Restriction> ; ( <http://www.w3.org/2002/07/owl#onClass> | <http://www.w3.org/2002/07/owl#onDataRange> ) ?x . }
- Detect nominals (oneOf): SELECT ?c WHERE { ?c <http://www.w3.org/2002/07/owl#oneOf> ?list . }
- Feature inventory query: SELECT DISTINCT ?p WHERE { ?s ?p ?o . FILTER (?p IN ( <http://www.w3.org/2002/07/owl#propertyChainAxiom>, <http://www.w3.org/2002/07/owl#onClass>, <http://www.w3.org/2002/07/owl#onDataRange>, <http://www.w3.org/2002/07/owl#oneOf>, <http://www.w3.org/2002/07/owl#hasKey>, <http://www.w3.org/2002/07/owl#inverseOf>, <http://www.w3.org/2002/07/owl#cardinality>, <http://www.w3.org/2002/07/owl#minQualifiedCardinality>, <http://www.w3.org/2002/07/owl#maxQualifiedCardinality>)) }

SUPPLEMENTARY DETAILS

Document loader options and caching (recommended values)
- options.timeout: 5000 ms
- options.retry: { retries: 3, factor: 2 }
- options.cache: 'validate' (use ETag/Last-Modified), for signing prefer pinned 'force' local bundle
- Use documentUrl as cache key. Store Content-Type and ETag alongside cached content.
- Explicit User-Agent: 'agentic-lib/1.0 jsonld-loader' or similar.

Parser and serializer options (N3.js and rdflib.js)
- N3.Parser options: format (e.g., 'N-Triples', 'text/turtle'), baseIRI, blankNodePrefix ('' to disable prefixing), isImpliedBy boolean.
- N3.Writer options: prefixes map, format: 'application/n-quads' for canonical output; stream writer for large datasets.
- rdflib.serialize options: flags string (e.g., 'o' prevents dotted local-part abbreviation; 'p' disables prefixing). Use flags to control deterministic IRIs in serialization for comparison.

Processing flags and safe-mode recommendations
- JsonLdOptions for canonical flows: processingMode: 'json-ld-1.1', safe: true, expandContext as needed, base optionally set.
- toRDF options: format: 'application/n-quads', produceGeneralizedRdf: false.
- canonize options: algorithm: 'URDNA2015', format: 'application/n-quads'.
- For signing use safe: true to make processors fail on lossy conversions.

REFERENCE DETAILS

JSON-LD API method signatures (TypeScript-like)
- compact(input: object|string, context: object|string, options?: JsonLdOptions): Promise<object>
- expand(input: object|string, options?: JsonLdOptions): Promise<Array<object>>
- flatten(input: object|string, context?: object|string, options?: JsonLdOptions): Promise<Array<object>>
- frame(input: object|string, frame: object|string, options?: JsonLdOptions & {embed?: boolean; explicit?: boolean; requireAll?: boolean}): Promise<object>
- toRDF(input: object|string|Array<object>, options?: JsonLdOptions & {format?: string; produceGeneralizedRdf?: boolean}): Promise<string|RDFDataset>
- fromRDF(input: string|RDFDataset, options?: JsonLdOptions & {format?: string; useNativeTypes?: boolean}): Promise<object>
- canonize(input: string|object|Array<object>, options?: {algorithm?: 'URDNA2015'|string; format?: 'application/n-quads'|string}): Promise<string>
- registerRDFParser(contentType: string, parser: (input: string) => RDFDataset | Promise<RDFDataset>): void

Canonicalization exact sequence and values (normative)
1. expanded = expand(input, { documentLoader: loader, processingMode: 'json-ld-1.1', safe: true })
2. nquads = toRDF(expanded, { format: 'application/n-quads', produceGeneralizedRdf: false })
3. canonical = canonize(nquads, { algorithm: 'URDNA2015', format: 'application/n-quads' })
4. signature_input = canonical (UTF-8 bytes) -> hash (SHA-256 recommended) -> sign

N3.js core signatures and effects
- DataFactory.namedNode(iri), literal(value, languageOrDatatype?), blankNode([id?]), quad(s,p,o,g?)
- new N3.Parser({ format?, baseIRI?, blankNodePrefix?, isImpliedBy? }).parse(input, callback(err, quad|null, prefixes)) or parse(input) returns array
- new N3.StreamParser() and N3.StreamWriter() for streaming IO
- new N3.Writer({ prefixes?, format? }).addQuad(...); .end((err,result)=>{})
- new N3.Store(quads?, options?) => store.addQuad, store.match(s,p,o,g), getQuads(...), removeMatches(...)

rdflib.js core signatures and serializer flags
- graph() => IndexedFormula (in-memory store)
- serialize(documentNode, kb, baseIRI, mimeType, callback?, options?) => string or callback invoked
- new Fetcher(store, options).load(uriOrNode, options) => Promise (records provenance)
- options.flags controls abbreviation; common flags: 'o', 'p', 'dr'

SPARQL detector queries (explicit examples)
- Transitive-in-cardinality detector (see above in Concrete detectors)
- Property chain detection: SELECT ?s WHERE { ?s <http://www.w3.org/2002/07/owl#propertyChainAxiom> ?chain . }
- Qualified cardinality detection: SELECT ?r WHERE { ?r a <http://www.w3.org/2002/07/owl#Restriction> ; ( <http://www.w3.org/2002/07/owl#onClass> | <http://www.w3.org/2002/07/owl#onDataRange> ) ?x . }

DETAILED DIGEST

Sources used (from repository SOURCES.md) and retrieval date
- https://www.w3.org/TR/json-ld11/  (JSON-LD 1.1 Syntax) — retrieved 2026-03-14
- https://json-ld.org/  (JSON-LD community site and playground) — retrieved 2026-03-14
- https://www.w3.org/TR/json-ld11-api/  (JSON-LD 1.1 Processing Algorithms and API) — retrieved 2026-03-14
- https://github.com/digitalbazaar/jsonld.js  (jsonld.js README and docs) — retrieved 2026-03-14
- https://www.w3.org/TR/owl2-overview/  (OWL 2 Overview) — retrieved 2026-03-14
- https://www.w3.org/TR/rdf11-primer/  (RDF 1.1 Primer) — retrieved 2026-03-14
- https://github.com/rdfjs/N3.js  (N3.js README/docs) — retrieved 2026-03-14
- https://github.com/linkeddata/rdflib.js  (rdflib.js README/docs) — retrieved 2026-03-14

Crawl size note
- Web fetches limited to 20,000 characters per URL during this extraction; longer normative pages were truncated where indicated. Local library documents were read in full.

ATTRIBUTION AND DATA SIZE

Attribution
- Technical material condensed from W3C JSON-LD 1.1 syntax and API, json-ld.org guidance, digitalbazaar/jsonld.js README, W3C OWL 2 Overview, RDF 1.1 Primer, N3.js and rdflib.js documentation.

Data size obtained during crawl
- Each source was requested with max_length=20000 characters; returned content truncated when exceeding this limit. Use the original URLs above for full normative text.

END OF OWL_CHECKLIST
