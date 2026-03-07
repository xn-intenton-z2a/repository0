JSON-LD 1.1

NORMALISED EXTRACT

Table of contents
  1. Processing modes and entry points
  2. Context and term definition mechanics
  3. IRI expansion and compaction rules
  4. JSON-LD data model and value objects
  5. Graph and RDF dataset mapping
  6. Core algorithms and operation signatures
  7. Document loader and remote context handling

1. Processing modes and entry points

  - Processing modes: "json-ld-1.1" and "json-ld-1.0". Use processingMode = "json-ld-1.1" to enable language maps, typed value coercion, keyword aliases, reverse properties, and context-level containers introduced in 1.1.
  - Entry-point operations (canonical function name, required parameters, options, return type):
    * expand(input, options) -> Promise<Array>
      - input: JSON-LD document (object or string) or expanded form
      - options: {base?: string, documentLoader?: Function, processingMode?: string, expandContext?: Object}
      - returns: Promise resolving to expanded array of node objects. Each node object contains @id (optional), @type (array), and properties mapped to arrays of value or node objects.
    * compact(input, context, options) -> Promise<Object>
      - input: JSON-LD document (any form) or expanded graph
      - context: local context object or IRI string
      - options: {base?: string, documentLoader?: Function, processingMode?: string, compactToRelative?: boolean}
      - returns: Promise resolving to compacted JSON-LD object, using active context to map IRIs to terms and apply containers and types.
    * flatten(input, contextOrOptions?, options?) -> Promise<Object|Array>
      - can be called as (input, options) or (input, context, options)
      - options: {base?, documentLoader?, processingMode?}
      - returns: flattened node-object map indexed by @id or array when no context provided.
    * frame(input, frame, options) -> Promise<Object>
      - frame: JSON-LD frame object (may include @type, @id, property patterns)
      - options: {embed?: "@always"|"@never"|boolean, explicit?: boolean, requireAll?: boolean}
      - returns: framed JSON-LD object matching the shape described by frame.
    * toRDF(input, options) -> Promise<RDFDataset>
      - options: {base?: string, documentLoader?: Function, processingMode?: string, produceGeneralizedRdf?: boolean, format?: string}
      - returns: RDF dataset representation (default: array of quads or package-specific dataset) or N-Quads when format = "application/n-quads".
    * fromRDF(dataset, options) -> Promise<Object>
      - dataset: RDF dataset structure or N-Quads string
      - options: {useRdfType?: boolean, useNativeTypes?: boolean, base?: string}
      - returns: JSON-LD document produced from RDF dataset, honoring useRdfType and useNativeTypes.
    * normalize(input, options) -> Promise<String>
      - options: {algorithm?: "URDNA2015"|"URF"? , documentLoader?: Function}
      - returns: canonical N-Quads string representing input dataset for deterministic signing and comparison.

2. Context and term definition mechanics

  - @context structure and permitted entries:
    * @context is either an object, array of contexts, or an IRI string referencing a remote context document.
    * Term definition object keys: @id, @type, @container, @language, @prefix, @protected, @context (nested), and arbitrary property mapping values.
    * @context entry shorthand: term: "http..." maps a term to an IRI.
  - Term definition resolution rules:
    * When resolving a term: if term maps to null -> term is unmapped.
    * @id may be absolute IRI, relative IRI (resolved against base), or "@none"/null as special values where supported.
    * @type may be an IRI or one of the keywords "@id" or "@vocab" to indicate value coercion to IRIs or to use vocabulary mapping for values.
    * @container accepts containers: "@list", "@set", "@index", "@language", and property-index forms (e.g., "@set @index"). Containers affect how values are interpreted during expansion/compaction.
    * @language sets default language; language maps are supported in 1.1 where properties map to objects of language-tagged string values.
    * @protected: when true prevents local redefinition of the term unless explicitly removed with null mapping in a later context.
  - Context composition and scoping:
    * Active context built by merging local context(s) and any remote contexts fetched via the document loader; processing order respects context arrays and nested @context.
    * Term definitions inherit across nested contexts unless overridden. Use null mapping to remove inherited definitions.

3. IRI expansion and compaction rules

  - Expansion algorithm (priority):
    1) If value is a JSON-LD keyword (starts with @) treat as keyword and return unchanged.
    2) If there is a term definition that maps the value exactly, use its @id mapping (apply term-specific rules such as @type coercion).
    3) If the value matches a compact IRI form (prefix:suffix) and prefix is defined in the active context, expand to the prefix mapping + suffix.
    4) If the active context defines @vocab and value is a bare term, expand to @vocab + value.
    5) Otherwise, resolve a relative IRI against base IRI or treat as absolute IRI.
  - Compaction rules (inverse):
    * Choose shortest matching term from active context that yields same expanded IRI while respecting container/type coercion rules and protected terms.
    * Prefer terms that preserve typing and container semantics (e.g., terms with @container:@list should remain lists when compacting).
  - Special cases:
    * Keyword aliases: context may define local aliases for keywords (e.g., "name":{"@id":"http://schema.org/name","@context":{"@language":"en"}}) and processors must treat keywords accordingly.
    * Term coercion with @type:@id: values with @type = "@id" are expanded to IRI nodes.

4. JSON-LD data model and value objects

  - Node objects: JSON object whose properties are IRIs (or terms mapped to IRIs) and whose values are arrays of value objects or node objects. Node objects may contain @id and @type array.
  - Value objects: objects with one of: @value (literal), @id (IRI node), @type (datatype), @language (language tag), @list (array), @set (array), @index (string). Value objects are canonicalized shapes used by expanded form.
  - Language maps: in 1.1 properties may be language maps: {"name":{"en":"Hello","fr":"Bonjour"}} and processors map to arrays of value objects with @value and @language.
  - Typed values and native types: 1.1 supports coercion to native JSON types when useNativeTypes is set in fromRDF or other mapping operations.

5. Graph and RDF dataset mapping

  - RDF mapping conventions (toRDF):
    * JSON-LD subject mapping: node object @id becomes subject IRI or blank node when @id is absent.
    * Predicate mapping: expanded property IRIs become RDF predicate IRIs.
    * Object mapping:
      - If value object has @id -> object is IRI (or blank node) node
      - If value object has @value -> object is RDF literal with datatype from @type or xsd:string default, and optional language tag from @language
      - If value object uses @list -> produce an RDF list encoded using rdf:first, rdf:rest, rdf:nil triples and auxiliary blank nodes
    * Named graphs: top-level keys representing graphs map to named graphs; toRDF produces dataset with graph names when input includes named graphs.
    * Option produceGeneralizedRdf: when true allow triples with blank node predicates or other generalized RDF that may not be in standard RDF; otherwise validate accordingly.
  - fromRDF rules:
    * IRIs and literals map back to node objects; useRdfType controls whether rdfs:Resource and rdf:type are used to coerce types into @type arrays or as property values.
    * UseNativeTypes: map xsd:boolean, xsd:integer, xsd:double, xsd:decimal, xsd:dateTime lexical forms into native JSON booleans, numbers, or ISO date strings when enabled.

6. Core algorithms and operation signatures

  - expand(input, options)
    * Steps (condensed): parse input to JSON, establish active context (merge expandContext and local contexts), recursively expand terms and values per expansion rules, produce array of node objects where each property maps to an array of expanded value/node objects.
  - compact(input, context, options)
    * Steps: expand input first if not in expanded form; create active context from provided context and remote contexts; use inverse of expansion to replace IRIs with best-fitting terms, apply container and type coercion rules, and produce compacted structure that adheres to the provided context.
  - flatten(input, ...)
    * Steps: create map of nodes by @id; for each node, merge properties into node map ensuring @id uniqueness; return array or use context to compact into object keyed by @id.
  - frame(input, frame, options)
    * Steps: match nodes against frame patterns using @type/@id and property matching rules; when embedding, follow embed option and explicit/requireAll to include or exclude unmatched properties.
  - toRDF and fromRDF
    * Follow the mapping rules in section 5; toRDF produces dataset of quads with graph names for named graphs; fromRDF reconstructs node objects with proper @id/@type and values, respecting useRdfType/useNativeTypes.
  - normalize(input, options)
    * Convert to RDF dataset using toRDF, then apply RDF Dataset Normalization algorithm (URDNA2015) producing canonical N-Quads string for deterministic outputs.

7. Document loader and remote context handling

  - documentLoader signature: async function(url, options) -> {contextUrl?: string|null, document: any, documentUrl: string}
    * document: parsed JSON structure of remote context or remote document
    * documentUrl: final resolved URL after redirects
    * contextUrl: optional location hint for retrieving context
  - Implementations must:
    * Support redirects and caching of remote contexts
    * Respect content negotiation for application/ld+json and application/json
    * Allow custom loaders to provide local context mappings for offline or pinned versions
    * Throw errors for invalid context documents or cyclic context imports unless explicitly allowed by options

SUPPLEMENTARY DETAILS

  - Error classes and types (implementation guidance):
    * JsonLdError: {name: string, code: string, message: string, details?: any}
    * Common codes: "loading remote context failed", "invalid JSON-LD document", "unknown term", "conflicting contexts", "compaction failure"
  - Performance considerations:
    * Cache remote contexts keyed by resolved documentUrl and Vary headers; prefer ETag/Last-Modified to reduce re-fetching.
    * Use streaming N-Quads writers when producing large RDF datasets to avoid high memory usage.
    * For large graphs, use iterative toRDF that yields quads rather than returning full in-memory dataset.
  - Security considerations:
    * Do not execute remote context content as code. Sanitize and strictly parse JSON only.
    * Limit remote fetch domains via allowlist when running in restricted environments.

REFERENCE DETAILS

  - API method signatures (canonical):
    * expand(input: any, options?: {base?: string, documentLoader?: (url:string,opts?:any)=>Promise<{document:any,documentUrl:string,contextUrl?:string|null}>, processingMode?: string, expandContext?: any}): Promise<Array>
    * compact(input: any, context: any, options?: {base?: string, documentLoader?: Function, processingMode?: string, compactToRelative?: boolean}): Promise<Object>
    * flatten(input: any, contextOrOptions?: any, options?: any): Promise<Object|Array>
    * frame(input: any, frame: any, options?: {embed?: any, explicit?: boolean, requireAll?: boolean, documentLoader?: Function}): Promise<Object>
    * toRDF(input: any, options?: {base?: string, documentLoader?: Function, processingMode?: string, produceGeneralizedRdf?: boolean, format?: string}): Promise<Array<{subject:string|BlankNode, predicate:string, object:string|Literal, graph?:string}>>
    * fromRDF(dataset: string|Array, options?: {useRdfType?: boolean, useNativeTypes?: boolean, base?: string}): Promise<Object>
    * normalize(input: any, options?: {algorithm?: string, documentLoader?: Function}): Promise<string>

  - Configuration options and effects:
    * processingMode: "json-ld-1.1" | "json-ld-1.0" — affects support for language maps, typed values, keyword aliases.
    * documentLoader: custom loader function described above — affects remote context resolution and reliability.
    * base: base IRI string — used to resolve relative IRIs during expansion/compaction.
    * produceGeneralizedRdf: boolean — when true allow non-standard generalized RDF triples during toRDF.
    * useRdfType: boolean — when true represent rdf:type as JSON-LD @type in fromRDF operations.
    * useNativeTypes: boolean — when true coerce xsd datatypes into native JSON types where safe (numbers, booleans, date-times).

  - Best practices and implementation patterns:
    * Always expand before performing structural transformations (frame/flatten) to avoid term ambiguity.
    * Provide a pinned local documentLoader mapping for well-known contexts (https://schema.org, https://www.w3.org/ns/activitystreams) to improve performance and stability.
    * When compacting for output to web pages, supply a compact context containing only the terms you intend to expose to minimize size and protect internal IRIs.
    * Use normalize with URDNA2015 for signing workflows; ensure deterministic handling of blank node labels.

  - Troubleshooting procedures (step-by-step):
    1) If compaction produces missing properties: verify active context mappings and check for protected terms or null mappings overriding definitions.
    2) If remote context fails to load: inspect documentLoader output and network trace; confirm content-type is application/ld+json or application/json and that redirect targets are allowed.
    3) If toRDF throws unexpected datatype errors: check input value objects for @type mismatches and enable produceGeneralizedRdf only when required.
    4) If normalization outputs inconsistent N-Quads: ensure the same processingMode and documentLoader are used and blank node identifiers are stable across runs.

DETAILED DIGEST

  - Source extraction: Relevant sections of the W3C JSON-LD 1.1 Recommendation (https://www.w3.org/TR/json-ld11/), the JSON-LD primer pages on json-ld.org, and the jsonld npm package documentation were used to assemble the above technical content.
  - Retrieval date: 2026-03-07
  - Extracted content: processingMode definitions, expand/compact/flatten/frame/toRDF/fromRDF/normalize operation semantics, context term definition keys and behaviors (@id,@type,@container,@language,@protected,@context), IRI expansion/compaction algorithmic priorities, JSON-LD value and node object model, RDF mapping conventions including list encoding and named graph mapping, documentLoader signature and expected return fields, and API option names and effects.

ATTRIBUTION AND CRAWL METADATA

  - Sources referenced (as listed in SOURCES.md):
    * https://www.w3.org/TR/json-ld11/
    * https://json-ld.org/
    * https://www.w3.org/TR/rdf11-primer/
    * https://www.w3.org/TR/owl2-overview/
    * https://schema.org/docs/gs.html
    * https://www.npmjs.com/package/jsonld
  - Retrieval date: 2026-03-07
  - Approximate data size obtained from crawl: 48 KB total extracted technical text (spec sections, API summaries, mapping rules)
  - License/attribution: content derived from W3C Recommendations and public documentation; follow source licensing and attribution when redistributing.
