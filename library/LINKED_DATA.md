LINKED_DATA

Table of Contents
- Normalised extract
  - JSON-LD core: contexts, terms, keywords, IRI expansion, forms, datasets
  - JSON-LD API: JsonLdProcessor methods and JsonLdOptions
  - Document loader contract
  - Canonicalization and signing (URDNA2015, N-Quads) and safe mode
  - jsonld.js implementation notes (bundles, loaders, RN polyfills)
  - RDF fundamentals required for implementers (triples, IRIs, literals, datasets)
  - N3.js (DataFactory, Parser, Writer, Store) key API and options
  - rdflib.js (graph, serialize, fetcher, UpdateManager) key API and flags
  - OWL 2 practical guidance (syntaxes, semantics, profiles)
- Supplementary details
  - JsonLdOptions enumerated with types and effects
  - Document loader production recommendations (caching, UA, redirects)
  - Parser/writer options for N3 and rdflib
- Reference details
  - Full method signatures and parameter/return types for JSON-LD API
  - Document loader exact contract
  - Canonicalization step-by-step with exact option values
  - N3.js factory/parser/writer/store signatures and options
  - rdflib.serialize signature and flags list
  - RDF MIME types and mapping rules (JSON-LD -> RDF specifics)
- Troubleshooting and step-by-step procedures
  - "term not defined", "lossy compaction", "failed to load remote context", canonicalization mismatch
- Detailed digest (sources + retrieval date)
- Attribution and crawl data size

---

NORMALISED EXTRACT

1) JSON-LD core (implementation-ready points)
- Contexts and term definitions
  - A context maps terms to IRIs or to term-definition objects. Term-definition object fields and semantics:
    - @id: absolute or relative IRI resolved per base/vocab rules; resolves to the property/class IRI.
    - @type: IRI or "@id" indicating value coercion to an IRI or datatype coercion.
    - @container: one of null, "@list", "@set", "@index", "@language", "@id", "@graph"; controls container interpretation.
    - @language: language tag for strings when no @type present.
    - @reverse: boolean to mark reverse properties.
    - @prefix: boolean to allow use as a CURIE prefix.
    - @context: nested scoped context object.
    - @protected: boolean to prevent redefinition when merging contexts.
- Keywords: reserved tokens that must be handled as operators: @context, @id, @type, @value, @language, @list, @set, @container, @graph, @reverse, @index, @direction, @base, @vocab, @protected.

- IRI expansion algorithm (concise actionable rules)
  1. If the input is a JSON-LD keyword, treat as keyword semantics.
  2. If the term has a term-definition with an absolute @id, use that absolute IRI.
  3. If relative and @vocab exists, resolve relative to @vocab.
  4. If term is CURIE-like (prefix:suffix) and prefix defined, expand using prefix mapping.
  5. Otherwise resolve relative to document base IRI per RFC3987.
  - Implementations must apply @base when present, otherwise use the HTTP/HTML base.

- Forms and mapping
  - Expanded form: all property names and types are absolute IRIs; values are normalized into value objects and node objects.
  - Compacted form: uses inverse context to select short terms; may produce arrays or scalars based on compactArrays option.
  - Flattened form: node map keyed by @id; useful for merging and indexing operations.
  - Framed form: uses a frame to select and shape nodes into trees; options include embed, explicit and requireAll.

- JSON-LD <-> RDF mapping (concrete)
  - A property IRI maps to an RDF predicate.
  - {"@id": IRI} entries map to RDF subject/object IRIs.
  - {"@value": v, "@type": t} -> RDF literal with datatype t.
  - {"@value": v, "@language": lang} -> RDF literal with language tag (rdf:langString semantics may be used by consumers).
  - @type entries -> rdf:type triples.
  - @list arrays -> RDF collection constructed via rdf:first / rdf:rest / rdf:nil.
  - Blank nodes: generate scoped blank node identifiers; use canonicalization when stable labels are required.

2) JSON-LD Processing API (exact I/O and method contracts)
- JsonLdProcessor canonical method signatures (TypeScript-like):
  - compact(input: object | string, context: object | string, options?: JsonLdOptions): Promise<object>
  - expand(input: object | string, options?: JsonLdOptions): Promise<Array<object>>
  - flatten(input: object | string, context?: object | string, options?: JsonLdOptions): Promise<Array<object>>
  - frame(input: object | string, frame: object | string, options?: JsonLdOptions & FrameOptions): Promise<object>
  - toRDF(input: object | string, options?: JsonLdOptions & {format?: string, produceGeneralizedRdf?: boolean}): Promise<string | RDFDataset>
    - options.format: 'application/n-quads' -> returns N-Quads string; else an RDF dataset object.
  - fromRDF(input: string | RDFDataset, options?: JsonLdOptions & {format?: string, useNativeTypes?: boolean}): Promise<object>
  - canonize(input: object | string, options?: {algorithm?: 'URDNA2015' | string, format?: 'application/n-quads' | string}): Promise<string>
  - registerRDFParser(contentType: string, parser: (input: string) => RDFDataset | Promise<RDFDataset>): void

3) Document loader contract (exact shape)
- Signature: async function documentLoader(url: string, options?: any) => Promise<{ contextUrl: string | null; document: any; documentUrl: string }>
  - contextUrl: value from Link header referencing a context document, or null.
  - document: parsed response body (for contexts, the JSON object).
  - documentUrl: final resolved URL after redirects; must be returned for provenance and canonicalization.
- Implementation notes: follow redirects, return documentUrl equal to final URL, set appropriate user-agent header, support caching (ETag/Last-Modified), and provide predictable errors on failures.

4) Canonicalization & safe mode (precise steps)
- Recommended canonicalization flow for signing:
  1. expanded = await expand(input, {documentLoader, processingMode: 'json-ld-1.1'})
  2. nquads = await toRDF(expanded, {format: 'application/n-quads', produceGeneralizedRdf: false})
  3. canonical = await canonize(nquads, {algorithm: 'URDNA2015', format: 'application/n-quads'})
  4. signature_input = canonical (UTF-8 bytes) -> hash (e.g., SHA-256) -> sign.
- Use safe: true for expand/compact when preparing for canonicalization; safe mode causes the processor to fail when data would be lost.
- Do not sign compacted JSON-LD; sign canonicalized N-Quads derived from expanded form.

5) jsonld.js implementation notes (deployment specifics)
- Bundles: dist/jsonld.min.js (compat), dist/jsonld.esm.min.js (ES module optimized for modern browsers).
- Node usage: import jsonld from 'jsonld' or require('jsonld'); default Node document loader user-agent: 'jsonld.js'.
- Custom documentLoader: override jsonld.documentLoader or pass documentLoader in options per-call.
- React Native: require polyfills for global.crypto.subtle and TextEncoder before importing jsonld to enable canonicalization and signature operations.
- registerRDFParser: register custom RDF parsers by content-type to support toRDF/fromRDF flows for non-default formats.

6) RDF fundamentals for implementers (practical rules)
- Triples: subject = IRI | blank node; predicate = IRI; object = IRI | blank node | literal.
- IRIs resolved per RFC3987; JSON-LD uses @base or HTML base element to resolve relative IRIs.
- Literal mapping: numeric JSON -> xsd:integer or xsd:double, boolean -> xsd:boolean, language tags -> rdf:langString.
- Datasets: default graph + named graphs; use application/n-quads for dataset exchange and canonicalization.

7) N3.js actionable API (core signatures and options)
- DataFactory constructors: namedNode(iri), literal(value, languageOrDatatype?), blankNode([id?]), defaultGraph(), quad(s,p,o,g?).
- Parser: new N3.Parser({ format?: string, baseIRI?: string, blankNodePrefix?: string, isImpliedBy?: boolean })
  - parse(input, callback?) -> per-quad callback signature (error, quad|null, prefixes).
  - Streaming: N3.StreamParser implements Node.js stream & RDF/JS Sink.
- Writer: new N3.Writer({prefixes?: object, format?: string})
  - addQuad(...); end((err,result) => {}) or stream mode.
- Store: new N3.Store([...quads], options?) supporting addQuad, removeMatches, match, getQuads, createBlankNode, size property.
- Use StreamParser/StreamWriter for files larger than memory.

8) rdflib.js actionable API (core signatures and flags)
- Graph creation: graph() -> in-memory IndexedFormula store.
- serialize(documentNode, kb, baseIRI, mimeType, callback?, options?) -> returns serialized string or calls callback; options.flags: serialization flags string.
- fetcher: new Fetcher(store, options) -> fetcher.load(uriOrNode, options) returns Promise; records provenance in RDF metadata.
- UpdateManager(store) handles PUT/PATCH/POST for authenticated Linked Data writes.
- Serializer flags: pass options.flags (e.g., 'o', 'dr', 'p'); flags merged with defaults; 'o' prevents dotted-local-part abbreviation, 'p' disables prefix abbreviation.

9) OWL 2 practical guidance (implementer-focused)
- Mandatory interchange syntax for OWL 2 conformance: RDF/XML; implementations must at least support RDF/XML for conformance testing.
- Semantics: Direct Semantics (SROIQ-compatible, used by DL reasoners) vs RDF-Based Semantics (applies to RDF graphs directly). For OWL2 DL ontologies, Direct and RDF-Based semantics correspond after mapping.
- Profiles: choose based on workload:
  - OWL 2 EL: polynomial-time classification for large terminologies.
  - OWL 2 QL: query rewriting to SQL for data-heavy, relational-backed applications.
  - OWL 2 RL: rule-based RDF triple processing; implement as rule set for triple stores; sound but completeness requires profile adherence.

---

SUPPLEMENTARY DETAILS

JsonLdOptions (fields, types, explicit effects)
- base?: string — base IRI for resolving relative IRIs (default: document base).
- processingMode?: 'json-ld-1.1' | 'json-ld-1.0' — selects algorithm variants; default: 'json-ld-1.1'.
- documentLoader?: (url: string, options?: any) => Promise<{contextUrl: string | null, document: any, documentUrl: string}> — custom loader.
- expandContext?: object | string — extra context applied during expansion.
- safe?: boolean — when true, fail on lossy conversions; recommended for signing.
- compactArrays?: boolean — when true, single-element arrays may be compacted to scalars.
- skipExpansion?: boolean — non-normative performance hint.
- produceGeneralizedRdf?: boolean (toRDF) — allow generalized RDF (specialized use).

Document loader production recommendations
- Implement a local context cache keyed by documentUrl with ETag/Last-Modified verification; TTLs short by default.
- Set user-agent explicitly (Node default 'jsonld.js' is common); if auth required, implement a loader that adds Authorization headers.
- Ensure loader returns documentUrl final resolved URL after redirects and returns contextUrl if Link: <...>; rel="context" header present.
- For security, avoid accepting user-supplied remote context URLs without vetting; prefer local bundles in production signing scenarios.

N3.Parser options (effects)
- format: force strict parsing for a specific syntax (e.g., 'N-Triples', 'application/trig').
- baseIRI: string used to resolve relative IRIs.
- blankNodePrefix: string to prevent identifier collisions; set to '' to disable prefixing.
- isImpliedBy: boolean toggles representation of implication rules.

rdflib serializer flags (practical effects)
- options.flags is a space-separated string; flags control abbreviation and prefixing behavior. Examples: 'o' prevents dotted local part prefixing; 'p' disables prefixing resulting in full IRIs; 'dr' used for JSON-LD conversion behaviors.

---

REFERENCE DETAILS (exact signatures, config values, patterns)

JSON-LD API (TypeScript-like exact signatures)
- compact(input: object | string, context: object | string, options?: JsonLdOptions): Promise<object>
- expand(input: object | string, options?: JsonLdOptions): Promise<Array<object>>
- flatten(input: object | string, context?: object | string, options?: JsonLdOptions): Promise<Array<object>>
- frame(input: object | string, frame: object | string, options?: JsonLdOptions & {embed?: boolean; explicit?: boolean; requireAll?: boolean}): Promise<object>
- toRDF(input: object | string, options?: JsonLdOptions & {format?: string; produceGeneralizedRdf?: boolean}): Promise<string | RDFDataset>
- fromRDF(input: string | RDFDataset, options?: JsonLdOptions & {format?: string; useNativeTypes?: boolean}): Promise<object>
- canonize(input: object | string, options?: {algorithm?: 'URDNA2015' | string; format?: 'application/n-quads' | string}): Promise<string>
- registerRDFParser(contentType: string, parser: (input: string) => RDFDataset | Promise<RDFDataset>): void

Document loader contract (exact return object)
- { contextUrl: string | null; document: any; documentUrl: string }
- documentUrl must be the final resolved URL after redirects; contextUrl is non-null when the HTTP Link header provided a context location.

Canonicalization exact options
- algorithm: 'URDNA2015'
- format: 'application/n-quads'
- Steps: expand -> toRDF(format: application/n-quads) -> canonize({algorithm:'URDNA2015',format:'application/n-quads'}) -> hash/sign.
- safe: true during expand/compact to prevent lossy conversions prior to canonicalization.

N3.js precise signatures and option values
- DataFactory.namedNode(iri: string): NamedNode
- DataFactory.literal(value: string, languageOrDatatype?: string): Literal
- DataFactory.blankNode(id?: string): BlankNode
- DataFactory.quad(s: Term, p: Term, o: Term, g?: Term): Quad
- new N3.Parser({ format?: string, baseIRI?: string, blankNodePrefix?: string, isImpliedBy?: boolean, comments?: boolean })
  - parser.parse(input, (err, quad, prefixes) => {}) or parser.parse(input, {onQuad, onPrefix, onComment})
- new N3.Writer({ prefixes?: object, format?: string })
  - writer.addQuad(...); writer.end((err, result) => {})
- new N3.Store(quads?: Array<Quad>, options?: { entityIndex?: EntityIndex }): Store
  - store.addQuad(quad), store.match(s?,p?,o?,g?) -> generator/array/stream, store.getQuads(...)

rdflib.js exact serialize signature and flags
- serialize(documentNode: NamedNode, kb: IndexedFormula, baseIRI: string, mimeType: string, callback?: (err: Error|null, result?: string) => void, options?: { flags?: string }): string | void
- options.flags is a string; common flags include 'o', 'dr', 'p', 's' etc. Flags are merged with defaults; use 'p' to disable prefixing or 'o' to prevent dotted local part abbreviation.

RDF MIME types and mapping
- text/turtle — Turtle
- application/trig — TriG
- application/n-quads — N-Quads (quad datasets; recommended for canonicalization)
- application/n-triples — N-Triples
- application/ld+json — JSON-LD
- application/rdf+xml — RDF/XML (mandatory OWL 2 interchange format)

Best-practice patterns (concrete)
- Document loader: implement a TTL cache + ETag validation, set UA, implement retries with exponential backoff, and return documentUrl final URL.
- Signing: expand -> toRDF(format=application/n-quads) -> canonize(URDNA2015, application/n-quads) -> sign canonical string; verify the verifier uses identical loader behaviour.
- Browser bundling: use jsonld.esm.min.js for modern browsers; include RN polyfills (crypto.subtle, TextEncoder) prior to importing jsonld in React Native.
- Large RDF datasets: use N3.StreamParser and N3.StreamWriter to stream rather than materialize, and use N3.Store only for memory-fitting datasets.

---

TROUBLESHOOTING (step-by-step)

A) Symptom: "term not defined" during compaction
1. Inspect the active @context for term mapping; include expandContext if missing.
2. If context is remote, verify documentLoader(url) returns the expected object with documentUrl; check HTTP response codes and Link header contextUrl.
3. Provide local context bundle via a custom documentLoader to guarantee availability.

B) Symptom: "lossy compaction" or missing triples after round-trip
1. Run expand(input) to view expanded form and locate missing fields.
2. Convert expanded form to N-Quads via toRDF(..., {format:'application/n-quads'}) and canonize using URDNA2015 to compare canonical outputs.
3. Use safe: true to make processor throw on lossy operations and adjust context and term definitions to preserve types and containers.

C) Symptom: "failed to load remote context"
1. Check network/DNS and HTTP status; ensure the endpoint returns valid JSON-LD and Content-Type.
2. Ensure documentLoader follows redirects and returns documentUrl; add timeouts and retry logic.
3. Provide fallback local context in the documentLoader cache to continue processing when remote fails.

D) Symptom: canonicalization mismatch between signer and verifier
1. Confirm both use algorithm:'URDNA2015' and format:'application/n-quads'.
2. Confirm both use identical documentLoader behaviour (same resolved documentUrl and context content). If loaders differ, canonical outputs will differ.
3. Re-run expand -> toRDF -> canonize steps and compare canonical outputs byte-for-byte before hashing/signing.

---

DETAILED DIGEST (sources and retrieval)
- SOURCES processed (as listed in repository SOURCES.md) and retrieval date: 2026-03-14
  - https://www.w3.org/TR/json-ld11/  (JSON-LD 1.1 Syntax) — fetched (web_fetch max_length=20000; content truncated where noted)
  - https://json-ld.org/  (JSON-LD community site / playground) — fetched (max_length=20000)
  - https://www.w3.org/TR/json-ld11-api/  (JSON-LD 1.1 Processing Algorithms and API) — fetched (max_length=20000; truncated where indicated)
  - https://github.com/digitalbazaar/jsonld.js  (jsonld.js README and docs) — fetched (max_length=20000)
  - https://www.w3.org/TR/owl2-overview/  (OWL 2 Overview) — fetched (max_length=20000; truncated)
  - https://www.w3.org/TR/rdf11-primer/  (RDF 1.1 Primer) — fetched (max_length=20000; truncated)
  - https://github.com/rdfjs/N3.js  (N3.js repository README/docs) — fetched (max_length=20000)
  - https://github.com/linkeddata/rdflib.js  (rdflib.js README/docs) — fetched (max_length=20000)
- Retrieval notes: each web_fetch used max_length=20000 characters; long normative pages were truncated and flagged in fetch outputs; existing library documents were read and used to consolidate technical specifics.

DATA SIZE OBTAINED DURING CRAWL
- Each web fetch requested up to 20,000 characters; returned content was truncated where noted. Existing local library files were read in full. The consolidated content in this document is a condensed synthesis of the fetched pages and repository READMEs; for full normative text refer to the original URLs above.

ATTRIBUTION
- Extracted and condensed from W3C JSON-LD 1.1 (syntax and API), JSON-LD community site, digitalbazaar/jsonld.js README, RDF 1.1 Primer, OWL 2 Overview, rdfjs/N3.js README, linkeddata/rdflib.js README; retrieval date: 2026-03-14.

---

END OF LINKED_DATA
