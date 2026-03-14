JSON_LD

Table of Contents
- Normalised extract
  - Context and term-definition
  - Keywords and tokens
  - IRI expansion and base/vocab rules
  - Forms: Expanded, Compacted, Flattened, Framed
  - Mapping to RDF (lists, literals, language, datatypes, @type/@id)
  - Processing algorithms (Context Processing, Expansion, Compaction, Flattening, Framing, RDF Serialization/Deserialization)
- Supplementary details
  - Term definition object fields and semantics
  - Context processing steps and edge cases
  - IRI resolution rules and prefix handling
  - Lists, sets and blank node generation rules
- Reference details (API, SDK signatures, configuration, best practices, troubleshooting)
  - JsonLdProcessor method signatures and return types
  - JsonLdOptions fields, types and defaults
  - Document loader contract and custom loader example (shape)
  - RDF parser registration signature
  - Canonicalization and safe mode options
  - Implementation patterns and troubleshooting steps
- Detailed digest
  - SOURCES.md entries and retrieval date: 2026-03-14
- Attribution and crawl data size
  - All source URLs from SOURCES.md fetched with up to 20,000 characters each; pages truncated where noted

Normalised extract

Context and term-definition
- A context is a JSON object mapping local terms to IRIs or term-definition objects. A term-definition object may contain the following keys and semantics:
  - @id: absolute IRI string or relative IRI resolved per base/vocab rules; when present the term maps to this IRI
  - @type: IRI (or @id) indicating datatype coercion for values or indicating that values are to be interpreted as IRIs
  - @container: one of null, "@list", "@set", "@index", "@language", "@id", "@graph" controlling container interpretation
  - @language: a language tag applied to string values when no @type is present
  - @reverse: boolean; if true, the property is a reverse property
  - @prefix: boolean; when true the term can be used as a prefix for compact IRIs
  - @context: nested context (for scoped contexts)
  - @protected: boolean; prevents redefinition in imported contexts

Keywords and tokens
- Reserved keywords: @context, @id, @type, @value, @language, @list, @set, @container, @graph, @reverse, @index, @direction, @base, @vocab, @protected
- Implementations must treat these tokens as operators of the data model rather than user terms unless explicitly redefined (and redefinition follows context rules)

IRI expansion rules (implementation-ready)
- When expanding a term:
  1. If the term is exactly a keyword, it is left as keyword semantics.
  2. If the term has a term-definition with @id that is an absolute IRI, use the absolute @id.
  3. If the term has a term-definition with @id that is a relative IRI and @vocab is set, resolve relative to @vocab as if it were a base for vocabulary mapping.
  4. If the term contains a colon (prefix:suffix) and the prefix is defined in context as a @prefix (or term mapping whose @id ends with a separator), expand as prefix expansion: prefix mapping + suffix.
  5. If none of the above, resolve relative to the document base IRI per RFC3987 rules.
- Base IRI rules: the @base keyword in context or document base/HTML base element is used to resolve relative IRIs.

Forms and Data Model
- Expanded form: every property name is an absolute IRI; values are normalized into value objects: either {"@value":..., "@type":...} or {"@id":...} or node objects.
- Compacted form: algorithm chooses short terms from an inverse context, and produces a compact representation using term aliases and @context entries.
- Flattened form: merges nested node structures into a flat list of node objects keyed by @id
- Framed form: applies a frame pattern to reshape data into a tree structure per framing rules

Mapping to RDF (concrete rules)
- Property -> RDF predicate (IRI)
- Value objects with @value map to RDF literal; when @type present use that IRI as datatype; when @language present use rdf:langString with language tag
- @id values map to RDF subjects or object IRIs
- Lists: JSON-LD lists map to RDF collections via rdf:first / rdf:rest / rdf:nil
- @type maps to rdf:type triples
- Blank nodes: generated blank node identifiers are used when nodes have no @id
- Data round-tripping: use canonicalization (URDNA2015) and safe processing when cryptographic signing or exact round-trip is required

Processing algorithms (names and I/O)
- Context Processing Algorithm
  - Input: context object(s), base IRI
  - Output: term definitions and inverse context used by compaction
- Expansion Algorithm (Section 5.1)
  - Input: JSON-LD document + active context
  - Output: expanded array of node objects (fully expanded IRIs, normalized values)
- Compaction Algorithm (Section 6.1)
  - Input: expanded form + context
  - Output: compacted document using term selections from inverse context
- Flattening Algorithm (Section 7.1)
  - Input: expanded form
  - Output: node map representing flattened nodes
- RDF Serialization / Deserialization (Section 8)
  - toRDF: JSON-LD -> RDF dataset (n-quads or dataset object)
  - fromRDF: RDF dataset -> JSON-LD document

Supplementary details (implementation specifics)

Term definition object fields (explicit semantics)
- @id: when absent, a term with @container '@id' and/or '@type' must be treated as mapping to a vocabulary term or generate error if ambiguous.
- @container: '@list' enforces list wrapping in compaction/expansion; '@index' and '@graph' encode indexing and named graph containers respectively.
- Protected terms: implementations must honor @protected and raise or ignore redefinition attempts depending on processingMode.

Context processing (practical steps)
1. Merge remote contexts (respecting import order). If remote context retrieval fails, implementations must follow application-configured document loader behavior (fallback, error, cache).
2. For each map entry, run Create Term Definition algorithm to compute resolved @id and other computed properties.
3. Build inverse context mapping for compaction: for each term and possible type/container combination record preferred term.

IRI resolution nuances
- When expanding CURIEs (prefix:suffix) the prefix is looked up in the active context; if absent, resolve using base IRI with colon preserved only if valid per IRI grammar.
- Compact IRI selection prefers term definitions marked with @prefix: true to be used as prefix expansions.

Lists, sets and ordering
- Normal JSON arrays are unordered by default for JSON-LD processing; preserve order only if @list is used or when compaction frames expect arrays to remain ordered.
- Implementations that preserve array order by default may break interoperability; use explicit @list when order matters.

Reference details (API-level specifications and method signatures)

JsonLdProcessor (TypeScript-like signatures)
- compact(input: object | string, context: object | string, options?: JsonLdOptions): Promise<object>
- expand(input: object | string, options?: JsonLdOptions): Promise<object[]>
- flatten(input: object | string, context?: object | string, options?: JsonLdOptions): Promise<object[]>
- frame(input: object | string, frame: object | string, options?: JsonLdOptions): Promise<object>
- toRDF(input: object | string, options?: JsonLdOptions & {format?: string}): Promise<string | RDFDataset>
- fromRDF(input: string | RDFDataset, options?: JsonLdOptions): Promise<object>
- canonize(input: object | string, options?: {algorithm?: string, format?: string}): Promise<string>
- registerRDFParser(contentType: string, parser: (input: string) => RDFDataset | Promise<RDFDataset>): void

JsonLdOptions (fields and effects)
- base?: string — base IRI used for resolving relative IRIs; default: document base
- documentLoader?: (url: string, options?: any) => Promise<{contextUrl: string|null, document: any, documentUrl: string}> — custom loader; must return document and documentUrl; used for remote @context and linked documents
- expandContext?: object — additional context to apply during expansion
- processingMode?: 'json-ld-1.1' | 'json-ld-1.0' — behavior toggles for edge-case handling
- safe?: boolean — when true, enable strict checks and fail on lossy operations (recommended for digital signing/canonicalization)
- skipExpansion?: boolean — implementation optimization hint; not normative

Document loader contract (shape)
- Input: url string, options (optional)
- Returns Promise resolved with an object: { contextUrl: string | null, document: any, documentUrl: string }
- When used by a fetcher that follows redirects, documentUrl must reflect the final URL after redirects

RDF parser registration
- registerRDFParser(contentType: string, parser: (input: string) => RDFDataset | Promise<RDFDataset>)
- Parser may be synchronous (returns RDFDataset) or asynchronous (returns Promise<RDFDataset>)

Canonicalization and safe mode
- Use canonize(input, {algorithm: 'URDNA2015', format: 'application/n-quads'}) to produce deterministic N-Quads for signing and comparison
- Enable safe: true during expand/compact when preparing data for cryptographic operations to prevent silent data loss

Implementation patterns and best practices
- Cache remote contexts and use a custom documentLoader to control timeouts, retries and offline contexts
- Use compact() for producing compact API-friendly payloads; use expand() + toRDF() for conversion to RDF graphs
- For large RDF datasets prefer streaming RDF writer (library-dependent) rather than materializing full N-Quads in memory
- When framing, precompute necessary @context entries to ensure deterministic property ordering in outputs

Troubleshooting (step-by-step)
- Symptom: "term not defined" during compaction
  1. Inspect active context for missing term mapping
  2. If context is remote, verify documentLoader is resolving and returning the remote context correctly
  3. Add explicit @context mapping or adjust processingMode if safe defaults prohibit implicit behavior
- Symptom: "lossy compaction" or missing triples after round-trip
  1. Run expand() and inspect expanded form; check for missing or coerced values
  2. Use canonize() to normalize and compare pre/post forms when troubleshooting signing
  3. Enable safe: true to force errors where compaction would lose information

Detailed digest
- Sources processed (from SOURCES.md) with retrieval date 2026-03-14:
  - https://www.w3.org/TR/json-ld11/  (JSON-LD 1.1 Syntax) – fetched up to 20k characters (truncated where noted)
  - https://json-ld.org/  (JSON-LD community site and playground) – fetched up to 20k characters
  - https://www.w3.org/TR/json-ld11-api/  (JSON-LD 1.1 Processing Algorithms and API) – fetched up to 20k characters

Attribution and crawl data size
- Attribution: Content extracted from W3C JSON-LD recommendations and the JSON-LD community site, retrieved 2026-03-14
- Data size: sources fetched in this pass with a web-fetch max_length=20000 parameter; returned content truncated when longer than 20,000 characters

End of JSON_LD document
