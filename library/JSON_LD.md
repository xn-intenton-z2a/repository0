JSON_LD

NORMALISED EXTRACT
Table of contents
  1. Context and term definitions
  2. IRI expansion and compaction rules
  3. JSON-LD keywords and value objects
  4. Document forms: expanded, compacted, flattened, framed
  5. Embedding, named graphs, and graph containers
  6. Mapping to RDF and RDF round-tripping
  7. Core processing algorithms (names and behavior)

1. Context and term definitions
  - @context is a map associating local terms to IRIs, datatypes, language, containers, and keyword aliases.
  - Context entry forms:
    * term: string — interpreted as an IRI mapping (shorthand).
    * term: object — may contain exact keys: @id (IRI or null), @type (IRI or "@id"/"@vocab"), @container ("@list", "@set", "@index", "@language", or property-index forms), @language (default language tag), @prefix (true/false), @protected (true/false), @context (nested context object) and custom container directives.
    * @context may be a remote URL (string) — processors must fetch via document loader and process included context.
  - Protected term definitions: if @protected true then local redefinition is disallowed unless explicitly removed with null mapping.

2. IRI expansion and compaction rules
  - Keyword test: if value is a JSON-LD keyword (starts with @), treat as keyword.
  - Compact IRI test: if value contains ':' and prefix defined in active context, expand to prefix IRI + suffix; if prefix is @vocab or undefined, follow vocabulary/base rules.
  - Vocabulary mapping: if a term has a vocabulary mapping (@vocab) and value is a bare term, resolve as vocabulary mapping + term.
  - Base IRI resolution: when no vocab mapping applies and value is a relative IRI, resolve against base IRI of document.
  - Term-defined @id null unmaps the term from any IRI (used to remove inherited mappings).
  - Algorithmic expansion priority (high-level): check if value is a keyword -> check term definition -> compact IRI -> vocab mapping -> base IRI -> absolute IRI.

3. JSON-LD keywords and value objects
  - Primary keywords and their canonical meanings:
    * @context — context map
    * @id — node identifier (IRI or blank node identifier)
    * @type — IRI(s) identifying node type(s)
    * @value — literal value wrapper
    * @language — language tag for string values
    * @list — ordered list container when using RDF lists
    * @set — set container to indicate unordered grouping
    * @graph — named graph or graph container
    * @reverse — reverse properties map
    * @index — grouping index value for indexing
    * @included — nodes included from other documents (processing)
  - Value object forms: When a property value is an object with @value and optionally @type/@language, it denotes a typed literal.
  - JSON-LD distinguishes JSON-native strings/numbers/booleans and typed/language-annotated values; use @type to coerce.

4. Document forms: expanded, compacted, flattened, framed
  - Expanded form:
    * All terms expanded to full IRIs; no term shortcuts; value objects standardized (use @id, @type, @value, etc.).
    * Arrays normalized: multi-valued properties always arrays; singletons may be arrays in expanded form.
  - Compacted form:
    * Uses the active context (local or provided) to shorten IRIs to terms or compact IRIs; prefers terms when available based on inverse context and term selection rules.
    * Can represent values as strings when allowed by context (@type or @language coercion rules).
  - Flattened form:
    * Produces an array of node objects where all nodes are directly present with their properties, enabling simpler node-based access and merges.
  - Framed form:
    * Restructures data to match a frame template: selects nodes with specific properties/types and shapes output using framing rules including embed, omitDefault, and explicit @graph behavior.

5. Embedding, named graphs, and graph containers
  - Embedding:
    * When a property value is itself an object with @id or blank node id, embedding rules determine whether that object is represented inline (embedded) or by reference.
    * Identifying blank nodes: processors generate consistent blank node identifiers when producing expanded/flattened graphs.
  - Named graphs / graph containers:
    * JSON-LD supports representing datasets with multiple graphs using @graph and graph containers in expanded form; graph names are IRIs.
    * Use @graph inside objects to denote the default graph contents or named graphs when paired with @id.

6. Mapping to RDF and RDF round-tripping
  - toRDF (serialize JSON-LD to RDF): follow the RDF Serialization algorithms: object-to-RDF, list-to-RDF, value-to-literal mapping rules; produce triples/quads with subjects, predicates, objects, and graph names.
  - fromRDF (parse RDF to JSON-LD): convert triples/quads into JSON-LD structures using identifiers, reified list handling, and avoid introducing unnecessary @id collisions.
  - Data types: JSON-LD maps JSON native types and explicit @type values to XSD datatypes when serializing to RDF (numbers, booleans, date/time must be typed or use native coercion rules).

7. Core processing algorithms (names and behavior)
  - Context processing algorithms
    * Create term definition: construct term entries based on @context entries, detect cycles and illegal redefinitions.
    * Inverse context creation: build reverse lookup for term selection for compaction (term selection table keyed by IRI, type/ language/ container options).
  - Expansion algorithm: produce expanded form, including IRI expansion, value object normalization, and array normalization.
  - Compaction algorithm: using inverse context select best terms for IRIs, apply type/language coercion, compact values to strings when permitted.
  - Flattening algorithm: generate node map then return list of nodes with canonical properties; steps include node map generation, merging, blank node id generation.
  - RDF serialization/deserialization algorithms: detailed deterministic conversions to/from RDF datasets; handle lists and containers per RDF spec.

SUPPLEMENTARY DETAILS (SPECIFICATIONS & IMPLEMENTATION NOTES)
  - Context entry fields (explicit): @id: IRI or null — sets IRI mapping for term; @type: IRI or "@id"/"@vocab" — indicates how values are interpreted or coerced; @container: one of null, "@list", "@set", "@index", "@language", or property-index forms like "@language@type" — controls value container handling; @prefix: boolean — if true, term acts as prefix for compact IRI generation; @language: default language tag for string coercion.
  - Term selection for compaction: when multiple terms map to same IRI, the inverse context algorithm ranks candidate terms by container, type/language preference, and length (shorter preferred) and returns the most specific matching term.
  - Document loader behaviors: processors must implement a document loader hook that accepts an IRI and returns a RemoteDocument record with document content, context, and a final IRI (after redirects); options must allow caching and custom resolvers; loaders must honor same-origin/ security policy in host environment.
  - Processing modes and backward compatibility: JSON-LD 1.1 supports processingMode values (e.g., "json-ld-1.1") to select algorithm variants; processors should support legacy 1.0 mode optionally.

REFERENCE DETAILS — ALGORITHMS, API SIGNATURES, TYPES, AND EFFECTS
  - Core algorithm names (implementation must provide callable equivalents):
    * expand(input, options) -> Promise/Result: returns expanded JSON-LD (array of node objects)
    * compact(input, context, options) -> Promise/Result: returns compacted JSON-LD using provided context
    * flatten(input, context?, options) -> Promise/Result: returns flattened array of node objects
    * frame(input, frame, options) -> Promise/Result: returns framed JSON-LD matching frame template
    * toRDF(input, options) -> Promise<RDFDataset>: serialize JSON-LD to RDF dataset (quads)
    * fromRDF(dataset, options) -> Promise<Result>: produce JSON-LD document from RDF dataset
    * normalize(input, options) -> Promise<string>: produce canonicalized N-Quads or RDF canonical form (e.g., for canonicalization)
  - JsonLdProcessor interface (WebIDL-like canonical signatures and parameter effects):
    interface JsonLdProcessor {
      Promise<any> expand(any input, JsonLdOptions options = {});
      Promise<any> compact(any input, any context, JsonLdOptions options = {});
      Promise<any> flatten(any input, any context = null, JsonLdOptions options = {});
      Promise<any> frame(any input, any frame, JsonLdOptions options = {});
      Promise<RDFDataset> toRDF(any input, JsonLdOptions options = {});
      Promise<any> fromRDF(RDFDataset dataset, JsonLdOptions options = {});
      Promise<string> normalize(any input, JsonLdOptions options = {});
    }
  - JsonLdOptions type (keys, types, and effects):
    * base: IRI string — sets the document base IRI for relative resolution.
    * documentLoader: function(iri)->Promise<RemoteDocument> — custom loader hook for fetching remote documents/contexts.
    * expandContext: context (object or IRI) — applied during expand/compaction when provided.
    * processingMode: string (e.g., "json-ld-1.1") — selects algorithm variants and feature set.
    * compactArrays: boolean — when compacting, whether singletons are represented as arrays (false collapses to single value where allowed).
    * produceGeneralizedRdf: boolean — when serializing to RDF, allow generalized RDF (triples with blank nodes as predicates) — rarely used; default false.
    * useNativeTypes: boolean — when true, map JSON native numbers/booleans to XSD datatypes in some serializations.
    * frameExpansion: boolean/options — affects framing algorithm expansion behavior (controls embedded/explicit behavior).
    * skipContextProcessing: boolean — allow bypassing local context resolution (advanced use only).
  - RDF dataset interface (RDFDataset): collection of named graphs and default graph containing quads; quads represented as {subject, predicate, object, graph} where nodes are IRIs, blank node identifiers, or RDF literals with datatype and language.

BEST PRACTICES & EXAMPLES (PATTERNS)
  - Prefer local inline @context for predictable compacting/expansion across deployments; use remote contexts only when stable and versioned.
  - Use @id values that are dereferenceable IRIs when publishing Linked Data; for internal-only identifiers use blank nodes consistently and generate stable blank node identifiers only during a single process run.
  - For search SERP/ SEO microdata using schema.org, prefer JSON-LD script embedding (type=application/ld+json) placed in head to avoid DOM parsing issues; use explicit ISO-8601 for dates and use link/meta for canonical references.
  - For large datasets, use flatten() when you need node-centric processing and then toRDF() for bulk RDF ingestion.

TROUBLESHOOTING — step-by-step diagnostics
  1. Unexpected compacted term or missing property:
     - Verify active @context: check that term is defined and not shadowed by @vocab or @base rules.
     - Run expand() to see fully-expanded IRIs; missing expansion indicates wrong @context mapping.
  2. "Invalid IRI" or resolution failures when resolving remote contexts:
     - Ensure documentLoader is implemented and follows redirects; check that resolved document contains valid @context JSON.
  3. Duplicate nodes after flattening/merging:
     - Confirm @id values are consistent; use normalized blank node id generation during flattening; if merging across sources, normalize IDs first.
  4. Framing returns empty results:
     - Expand both input and frame then inspect types/@id used by the frame; adjust frame to match expanded IRIs or provide compact frame with matching context.

DETAILED DIGEST (SOURCE SECTIONS AND RETRIEVAL DATE)
  - Sources enumerated in repository SOURCES.md (as of retrieval):
    * https://www.w3.org/TR/json-ld11/  — JSON-LD 1.1 Syntax (retrieved 2026-03-07)
    * https://json-ld.org/             — JSON-LD community website and playground (retrieved 2026-03-07)
    * https://www.w3.org/TR/json-ld11-api/ — JSON-LD 1.1 Processing Algorithms and API (retrieved 2026-03-07)
    * https://www.w3.org/TR/rdf11-primer/ — RDF 1.1 Primer (retrieved 2026-03-07)
    * https://www.w3.org/TR/owl2-overview/ — OWL 2 Overview (retrieved 2026-03-07)
    * https://schema.org/docs/gs.html   — Schema.org Getting Started (retrieved 2026-03-07)
    * Attempted: https://www.npmjs.com/package/jsonld — request failed with HTTP 403; package registry access blocked (retrieved 2026-03-07)

ATTRIBUTION & CRAWL METADATA
  - All normative text and algorithm descriptions extracted from W3C Recommendations: JSON-LD 1.1 and JSON-LD 1.1 Processing Algorithms and API; RDF Primer; OWL 2 Overview; and Schema.org Getting Started guide.
  - Retrieval date: 2026-03-07 (UTC)
  - Notes on data size and truncation:
    * Several fetched pages exceeded the web_fetch max_length and were returned truncated by the fetch tool; full document bodies are available from the listed source URLs. The npmjs.org package page returned HTTP 403 and was not retrieved.
    * fetch results contained full document headings, table-of-contents, and top sections used to extract the above technical details; where the web fetch indicated truncation, the primary normative algorithm names, keywords, and context rules were still present and used.

REFERENCE: SOURCES LIST (verbatim from repository SOURCES.md)
  - https://www.w3.org/TR/json-ld11/
  - https://json-ld.org/
  - https://www.w3.org/TR/rdf11-primer/
  - https://www.w3.org/TR/owl2-overview/
  - https://schema.org/docs/gs.html
  - https://www.npmjs.com/package/jsonld

END OF DOCUMENT
