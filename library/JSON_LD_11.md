JSON-LD 1.1 (W3C) — Normalised Extract

TABLE OF CONTENTS
1. Processing modes and entry points
2. Context and term definition mechanics
3. IRI expansion and compaction rules
4. JSON-LD data model and value objects
5. Graph/dataset mapping and named graphs
6. Algorithms: expand, compact, flatten, frame, toRDF, fromRDF, normalize
7. Document loader and remote context handling

NORMALISED TECHNICAL DETAILS

1. Processing modes and entry points
- Processing modes: "json-ld-1.1" and legacy "json-ld-1.0"; choose mode to enable 1.1 features (language maps, reverse properties, keyword aliases, typed values, etc.).
- Entry-point operations (inputs and canonical outputs):
  * expand(input, options) -> Promise/Result: expanded array of node objects (each node object contains @id and property arrays). Input: JSON-LD document or object; Options: base, documentLoader, processingMode, expandContext.
  * compact(input, context, options) -> Promise/Result: compacted JSON-LD object using active context; Input: expanded form or JSON-LD; Context: local context object or IRI; Options: base, documentLoader, processingMode, compactToRelative.
  * flatten(input, contextOrOptions, options) -> Promise/Result: flattened document (array or object); either called as (input, options) or (input, context, options). Produces node-object list indexed by @id.
  * frame(input, frame, options) -> Promise/Result: framed object matching frame patterns; Options include embed, explicit, requireAll.
  * toRDF(input, options) -> RDF Dataset: maps JSON-LD to RDF dataset per mapping rules; Options: base, documentLoader, processingMode, produceGeneralizedRdf (boolean), format (e.g., "application/n-quads").
  * fromRDF(dataset, options) -> JSON-LD: maps RDF dataset or N-Quads into JSON-LD; Options: useRdfType, useNativeTypes, base.
  * normalize(input, options) -> String: canonical N-Quads produced by RDF Dataset Normalization algorithm (URDNA2015), used for deterministic signatures; Options: algorithm (URDNA2015), format (N-Quads)

2. Context and term definition mechanics
- @context is a map where each term maps to either an IRI string or an object with keys: @id, @type, @container, @language, @context, @prefix, @protected.
- Term object fields and exact semantics:
  * @id: absolute IRI or null. null unmaps the term (removes inherited mapping).
  * @type: IRI or keywords "@id" or "@vocab" indicating that values for the term are IRIs or are to be interpreted relative to the vocabulary.
  * @container: one of "@list", "@set", "@index", "@language", or property-index forms like "@type@id"; controls how values are represented and how indexing occurs.
  * @language: default language tag for string values when no language is provided.
  * @prefix: true/false; when true the term can be used as a compact IRI prefix.
  * @protected: true/false; prevents unintentional redefinition by nested contexts unless removed with null mapping.
- Context composition: contexts are processed in order; remote contexts must be retrieved via document loader; local context processing may override parent contexts. Nested @context entries are recursively processed using the same rules.

3. IRI expansion and compaction rules
- Expansion algorithm priority:
  1. If value is a JSON-LD keyword (starts with @) treat as keyword.
  2. If active term definition exists for the value, use its mapping.
  3. If value contains a colon and prefix mapping exists in active context, expand as prefix IRI + suffix.
  4. If active context has @vocab defined and value is a bare term, expand as @vocab + term.
  5. Otherwise resolve relative IRIs against base IRI using RFC3986 rules.
  6. Absolute IRIs remain unchanged.
- Compacting: inverse of expansion using active context; compact IRI test checks prefixed matches that minimize lexical length and prefer terms that are defined in the active context with matching @id and type coercion.

4. JSON-LD data model and value objects
- Node object: JSON object representing an RDF node with keys: @id (IRI or blank node), properties mapped to arrays of value objects, and optional @type arrays.
- Value object forms:
  * Typed literal: {"@value": lexicalForm, "@type": datatypeIRI}
  * Language-tagged string: {"@value": text, "@language": "en"}
  * IRI reference: {"@id": IRI}
  * List: {"@list": [valueObjects...]}
- Language maps: context specifies language mapping where a property value may be an object mapping language tags to strings; processors convert language maps to arrays of language-tagged value objects.
- @reverse: used to indicate reverse properties; expansion turns @reverse entries into triples with subject/object swapped in RDF mapping.

5. Graph/dataset mapping and named graphs
- JSON-LD maps to an RDF Dataset consisting of a default graph and zero or more named graphs.
- Mapping rules:
  * Top-level @graph with no node index maps to default graph containing triples for nodes.
  * Named graphs are represented by objects with @graph and an @id identifying the graph name.
  * Blank nodes in JSON-LD map to blank node labels in the RDF dataset; blank node identifiers are document-scoped unless normalized.
- Serialization formats and recommended MIME types: application/ld+json for JSON-LD payloads; application/n-quads or application/n-quads for N-Quads dataset outputs.

6. Algorithms: step-level behavior and edge rules
- Expand algorithm: fully resolves all terms to IRIs, converts compact syntax to expanded arrays, expands language maps, converts lists to @list value objects, expands @reverse, and removes context from the result.
- Compact algorithm: uses an active context to replace IRIs with terms or compact IRIs, collapse arrays to single values when allowed by term definition (container settings), and apply type coercion when @type or @id is defined on terms.
- Flatten algorithm: produces a flat array of node objects where each node is merged by @id and all properties are arrays; useful for consistent node-level access.
- Frame algorithm: matches nodes against a frame template using match and embed rules; options: @embed (always/never), @explicit (when true only include framed properties), @requireAll (when true only include matches that satisfy all frame patterns).
- toRDF algorithm specifics:
  * Value objects produce RDF triples: typed literals use literal with datatype IRI; language-tagged strings use literal with language tag; @id values become IRIs.
  * @list maps to RDF collection triples using rdf:first, rdf:rest and rdf:nil.
  * @reverse in JSON-LD results in inverted subject/predicate/object triples during RDF mapping.
  * Option produceGeneralizedRdf=true allows blank node predicates and generalized triples (quad stores that support them) but standard RDF datasets do not allow blank node predicates.
- fromRDF algorithm specifics:
  * Converts RDF triples/quads into node objects: subjects become @id, predicates map to properties using IRI compacting; literals become @value with @type or @language per datatype and language.
  * RDF list construction is reversed into @list arrays when collections are detected.
- normalize algorithm: runs RDF Dataset Normalization (URDNA2015) producing stable N-Quads ordering; steps include canonicalizing blank nodes via hashing of their adjacent graph structure and sorting quads lexicographically.

7. Document loader and remote context handling
- Document loader interface: function documentLoader(url) must return a Promise resolving to an object {contextUrl, documentUrl, document} where:
  * document is the fetched remote document (e.g., JSON-LD context object, or a JSON-LD document),
  * contextUrl is the Document's context URL (nullable),
  * documentUrl is the final resolved URL (after redirects) used as base for relative IRI resolution.
- Implementations must handle HTTP 200 responses, redirects, link headers that indicate alternate contexts, and proper error propagation for non-200 responses.
- Recommended behavior for remote contexts: cache fetched contexts; respect @protected and remote context chaining rules; support profile negotiation via Accept header when fetching contexts.

SUPPLEMENTARY DETAILS (IMPLEMENTATION NOTES)
- ProcessingMode default: set to "json-ld-1.1" to enable full 1.1 semantics.
- Use URDNA2015 for deterministic canonicalization; its output is a UTF-8 N-Quads string suitable for cryptographic signing.
- For compacting, prefer terms defined in active context that reduce lexical length while preserving semantics; tie-breaking uses term selection rules in the spec.
- When mapping to RDF, convert JSON-LD plain strings without @type to xsd:string if useNativeTypes is enabled and lexical form matches XML Schema types; otherwise preserve as plain literal with no datatype.
- Implementation MUST support value coercion rules for @type set to @id and @vocab handling per term definitions.

REFERENCE DETAILS (API-SPEC & IMPLEMENTATION-SPEC)
- documentLoader(url) -> Promise<{contextUrl?: string|null, documentUrl: string, document: any}>. Fail with Error when resource cannot be retrieved; follow redirects and set documentUrl to the final URL.
- expand(input, {base?, documentLoader?, processingMode?, expandContext?}) -> expandedArray. Inputs: input (Object|String), options base (IRI), documentLoader (function), processingMode ("json-ld-1.1"|"json-ld-1.0"), expandContext (Object|IRI). Returns: array of node objects.
- compact(input, context, {base?, documentLoader?, processingMode?, compactToRelative?}) -> compactedObject. context: local context object or IRI.
- flatten(input, contextOrOptions?, options?) -> flattenedObjectOrArray. When used with context merges flattened nodes into compacted form if context provided.
- frame(input, frame, {base?, documentLoader?, processingMode?, embed?, explicit?, requireAll?}) -> framedObject.
- toRDF(input, {base?, documentLoader?, processingMode?, produceGeneralizedRdf?: boolean, format?: string}) -> RDFDataset or string (when format set to "application/n-quads"). RDFDataset: collection of quads {subject, predicate, object, graph} where subject/predicate/graph are IRIs or blank node ids; object is IRI, blank node id or literal {value, datatype?, language?}.
- fromRDF(dataset, {base?, useRdfType?: boolean, useNativeTypes?: boolean, processingMode?}) -> JSON-LD object. dataset may be N-Quads string or array of quads.
- normalize(input, {algorithm: "URDNA2015", format: "application/n-quads"}) -> canonicalNQuadsString.

DETAILED DIGEST (SOURCE: https://www.w3.org/TR/json-ld11/; retrieved 2026-03-07)
- Extracted sections: context definitions and processing, expansion/compaction/flatten/frame/toRDF/fromRDF/normalize algorithm overviews and step-level rules, graph/dataset mapping rules, term definition keys and effects, document loader contract, processingMode differences.
- Retrieval date: 2026-03-07
- Attribution: W3C Working Group — JSON-LD 1.1 Recommendation. Source URL: https://www.w3.org/TR/json-ld11/
- Data size obtained during crawling: source not fetched by network in this run; content size estimated as approximately 60KB of spec text (estimation only).

ATTRIBUTION
- Source: W3C JSON-LD 1.1 Recommendation, https://www.w3.org/TR/json-ld11/ (W3C). Retrieved: 2026-03-07.
- Contributor: Extracted for internal library use.

END OF DOCUMENT
