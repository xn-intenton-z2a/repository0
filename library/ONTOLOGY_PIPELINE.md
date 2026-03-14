ONTOLOGY_PIPELINE

Table of Contents
- Normalised extract
  - Pipeline overview
  - Ingest and normalization
  - JSON-LD -> RDF conversion
  - Canonicalization (deterministic N-Quads)
  - Load and storage
  - Reasoning strategy (OWL 2 RL vs OWL 2 DL)
  - Querying and evaluation
- Supplementary details
  - Document loader contract and recommended options
  - Caching and provenance
  - Streaming and large-dataset patterns
- Reference details
  - JsonLd API signatures and exact option values
  - N3.js and RDF/JS primitives and method signatures
  - rdflib.js core signatures and serializer flags
  - Essential OWL 2 RL rule subset (operational rules)
  - Configuration examples and recommended values
- Troubleshooting procedures (step-by-step)
- Detailed digest
  - Sources processed and retrieval date
  - Crawl data size notes
- Attribution and data size


NORMALISED EXTRACT

Pipeline overview
- Goal: deterministic, reproducible ingestion of ontology inputs (JSON-LD, Turtle, RDF/XML, N-Quads), conversion to an RDF dataset, canonicalization for reproducible signatures, loading into a triple/quad store and execution of reasoning and queries to evaluate ontology properties (consistency, subclass relations, instance classification, etc.).
- Required capabilities: JSON-LD processing (expand, toRDF, canonize), RDF parsing/serialization (N3.js or rdflib), RDF dataset storage (RDF/JS Store), optional external DL reasoner for Direct Semantics.

Ingest and normalization
- Accept formats: application/ld+json (JSON-LD), text/turtle (Turtle), application/rdf+xml (RDF/XML), application/n-quads (N-Quads), application/n-triples.
- For JSON-LD inputs perform context-aware normalization first (use controlled documentLoader): expand(input, {documentLoader, processingMode: 'json-ld-1.1', safe: true}) => expanded nodes array. Expanded form ensures all property names are absolute IRIs and values are normalized into value objects or node objects.
- For Turtle/RDF/XML use an RDF/JS parser (N3.Parser or rdflib parser) to produce quads, resolving relative IRIs with a base IRI.

JSON-LD -> RDF conversion
- Use the processor's toRDF operation to convert expanded JSON-LD to an RDF dataset. Recommended options: toRDF(expanded, {format: 'application/n-quads', produceGeneralizedRdf: false}) => N-Quads string or RDF dataset object.
- Mapping rules to follow exactly: property IRIs -> predicates; node @id -> IRIs; value objects {"@value": v, "@type": t} -> typed literals (datatype IRI t); {"@value": v, "@language": lang} -> language-tagged literals; @list -> RDF collection using rdf:first/rdf:rest/rdf:nil; @type entries -> rdf:type triples; blank nodes generated for nodes without @id.

Canonicalization (deterministic N-Quads)
- Use RDF Dataset Canonicalization algorithm URDNA2015 to produce deterministic N-Quads suitable for hashing/signing.
- Exact sequence for canonical string generation (option values are normative here):
  1. expanded = expand(input, {documentLoader: loader, processingMode: 'json-ld-1.1', safe: true})
  2. nquads = toRDF(expanded, {format: 'application/n-quads', produceGeneralizedRdf: false})
  3. canonical = canonize(nquads, {algorithm: 'URDNA2015', format: 'application/n-quads'})
- Use canonical (UTF-8 bytes) as the input to cryptographic hash (e.g., SHA-256) and signing primitive.
- Set safe: true during expansion/compaction when canonicalization or signing is required to force errors on lossy operations.

Load and storage
- For in-process evaluations load quads into an RDF/JS-compatible store such as N3.Store or rdflib IndexedFormula.
- Use streaming ingestion for large inputs: N3.StreamParser -> push quads into N3.Store or a streaming rule engine rather than materializing N-Quads string.
- Store API minimal expectations:
  - addQuad(quad), addQuads(array)
  - getQuads(subject?, predicate?, object?, graph?) => array
  - match(s?, p?, o?, g?) => iterable of quads
  - removeMatches(s?, p?, o?, g?)

Reasoning strategy (OWL 2 RL vs OWL 2 DL)
- OWL 2 RL (recommended for in-process JS implementations): implement as a forward-chaining rule set operating on RDF triples. RL is designed for rule-based engines and can be implemented entirely over triples for sound inferences within profile constraints.
- OWL 2 DL (full DL semantics): requires Direct Semantics; use an external DL reasoner (Java/Prolog-based tool). For DL-level entailments export RDF mapping and submit to a DL reasoner that supports SROIQ.
- Practical rule subset (essential, operational) for RL-style reasoning is included in Reference details below.

Querying and evaluation
- After inference run queries to evaluate ontology tasks. Use SPARQL (if store supports it) or pattern matching over quads for:
  - Class subsumption and inferred subclass hierarchies
  - Instance classification (rdf:type assertions after inference)
  - Consistency checks (unsatisfiable classes via inferred contradictions)
- For deterministic reports capture canonical provenance: include documentUrl and ETag/Last-Modified of contexts used to derive triples.


SUPPLEMENTARY DETAILS

Document loader contract and recommended options
- Exact loader signature: async function documentLoader(url: string, options?: any) => Promise<{ contextUrl: string | null; document: any; documentUrl: string }>
  - contextUrl: string | null — value of HTTP Link: rel="context" header if present
  - document: any — parsed response body (JSON object for JSON-LD contexts)
  - documentUrl: string — final resolved URL after redirects (MUST be provided for provenance and canonicalization)
- Recommended loader options and defaults for production evaluation:
  - timeout: 5000 (milliseconds)
  - retry: {retries: 3, factor: 2}
  - cache: 'validate' (use ETag/Last-Modified conditional requests)
  - headers: include User-Agent: 'agentic-lib/1.0 jsonld-loader'
- Deterministic signing recommendation: pin context by documentUrl+ETag or use a local bundled context to ensure identical context bytes across signer and verifier.

Caching and provenance
- Cache keys must be documentUrl (final URL) combined with Content-Type and ETag to avoid provenance drift.
- For canonical signing workflows, prefer local bundles or immutable pinned documentUrl+ETag values rather than live remote contexts.

Streaming and large-dataset patterns
- For inputs > memory, use streaming parse: N3.StreamParser => incremental ingestion into store or stream-based rule engine.
- Avoid converting very large expanded forms into single N-Quads strings in memory; instead stream N-Quads to canonicalization if the canonicalizer supports streaming, else use chunked processing and external tools.


REFERENCE DETAILS

JsonLd API signatures and exact option values (TypeScript-like)
- expand(input: object | string, options?: { base?: string; documentLoader?: Function; processingMode?: 'json-ld-1.1'|'json-ld-1.0'; safe?: boolean; expandContext?: object | string }): Promise<Array<object>>
- toRDF(input: object | string | Array<object>, options?: { format?: string; documentLoader?: Function; produceGeneralizedRdf?: boolean }): Promise<string | RDFDataset>
- canonize(input: string | object | Array<object>, options?: { algorithm?: 'URDNA2015' | string; format?: 'application/n-quads' | string }): Promise<string>
- registerRDFParser(contentType: string, parser: (input: string) => RDFDataset | Promise<RDFDataset>): void

Key option values used in the pipeline (normative)
- processingMode: 'json-ld-1.1'
- safe: true
- toRDF format: 'application/n-quads'
- canonize algorithm: 'URDNA2015', format: 'application/n-quads'
- produceGeneralizedRdf: false (avoid generalized RDF when canonicalizing for signatures)

N3.js and RDF/JS primitives and method signatures (concise)
- DataFactory.namedNode(iri: string) => NamedNode
- DataFactory.literal(value: string, languageOrDatatype?: string) => Literal
- DataFactory.blankNode([id?]) => BlankNode
- DataFactory.quad(subject, predicate, object, graph?) => Quad
- new N3.Parser(options?)
  - parser.parse(inputString, (err, quad, prefixes) => { /* quad null-termination */ })
- new N3.StreamParser() => Node stream emitting quads
- new N3.Writer(options?) => writer.addQuad(...); writer.end((err,result)=>{})
- N3.Store API: addQuad(quad), addQuads(array), getQuads(s,p,o,g), match(s,p,o,g), removeMatches(s,p,o,g), size

rdflib.js core signatures and serializer flags
- graph(): creates in-memory store (IndexedFormula)
- serialize(documentNode, kb, baseIRI, mimeType, callback?, options?) => string | callback
- Fetcher(store) for HTTP retrieval; UpdateManager(store) for update operations
- serializer flags (options.flags) affect abbreviation: examples 'o' (dont abbreviate dotted local parts), 'p' (disable prefix abbreviation), 'dr' (JSON-LD conversion-related flags)

Essential OWL 2 RL rule subset (operational forms)
- RDFS/OWL rules expressed as triple-pattern implications (prefer forward-chaining):
  - Subclass: if (C rdfs:subClassOf D) and (x rdf:type C) then infer (x rdf:type D).
  - Subproperty: if (P rdfs:subPropertyOf Q) and (s P o) then infer (s Q o).
  - Domain: if (P rdfs:domain C) and (s P o) then infer (s rdf:type C).
  - Range: if (P rdfs:range C) and (s P o) then infer (o rdf:type C).
  - Transitive property: if (P rdf:type owl:TransitiveProperty) and (s P m) and (m P o) then infer (s P o).
  - Equivalence: if (C owl:equivalentClass D) then treat as mutual subclass (infer both directions) or unify classes for classification.
  - Inverse properties: if (P owl:inverseOf Q) and (s P o) then infer (o Q s).
  - Functional property: if (P rdf:type owl:FunctionalProperty) and (s P o1) and (s P o2) and o1 != o2 then infer inconsistency indicator (application-specific handling).
- Implementation note: RL rule set is larger; include these core rules first and extend with remaining OWL RL rule templates as needed.

Configuration examples and recommended values
- documentLoader timeout: 5000ms
- documentLoader retry: retries=3, factor=2
- cache strategy: 'validate' using ETag/Last-Modified
- safe: true when canonicalizing/signing
- toRDF format: 'application/n-quads'
- canonize algorithm: 'URDNA2015'
- use streaming parser for inputs > 50MB (heuristic)


TROUBLESHOOTING PROCEDURES (STEP-BY-STEP)

1) Symptom: term not defined during compaction or framing
- Check active context; if context is remote, call documentLoader(url) and inspect returned {contextUrl, document, documentUrl} for expected mappings.
- If missing, provide explicit local @context mapping or pass expandContext in API call.

2) Symptom: lossy compaction or missing triples after round-trip
- Run expand(input) and inspect the expanded nodes to find dropped properties or coerced types.
- Convert expanded -> toRDF and compare N-Quads before/after compaction using canonize; enable safe: true to raise errors on lossy operations.

3) Symptom: failed to load remote context intermittently
- Verify network connectivity and HTTP status codes; inspect ETag and caching headers.
- Confirm documentLoader follows redirects and returns documentUrl; add retries/backoff and a cached local fallback for critical contexts.

4) Symptom: canonicalization mismatch between signer and verifier
- Confirm identical options: processingMode, safe, toRDF format, canonize algorithm and loader behavior (documentUrl and document bytes). Pin contexts or use local bundles to prevent divergence.


DETAILED DIGEST

Sources processed (from repository SOURCES.md):
- https://www.w3.org/TR/json-ld11/  (JSON-LD 1.1 Syntax)
- https://json-ld.org/  (JSON-LD community site)
- https://www.w3.org/TR/json-ld11-api/  (JSON-LD 1.1 Processing Algorithms and API)
- https://github.com/digitalbazaar/jsonld.js  (jsonld.js implementation and README)
- https://www.w3.org/TR/owl2-overview/  (OWL 2 Overview)
- https://www.w3.org/TR/rdf11-primer/  (RDF 1.1 Primer)
- https://github.com/rdfjs/N3.js  (N3.js library)
- https://github.com/linkeddata/rdflib.js  (rdflib.js library)

Retrieval date: 2026-03-14
Crawl/data size notes: web fetches in this extraction used a per-page max_length limit (15k–20k characters); longer normative pages were truncated where noted. Aggregate extracted text used to construct this document is condensed from the retrieved segments and existing library documents.


ATTRIBUTION AND DATA SIZE

- Attribution: extracts and technical content condensed from W3C JSON-LD 1.1 (syntax and API), JSON-LD community resources, digitalbazaar/jsonld.js README, W3C OWL 2 Overview, W3C RDF Primer, rdfjs/N3.js and linkeddata/rdflib.js repositories.
- Approximate fetched data per source during extraction: up to 20,000 characters per URL; where content exceeded this limit the fetch was truncated and flagged in the digest.

End of ONTOLOGY_PIPELINE
