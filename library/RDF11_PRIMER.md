RDF11_PRIMER

NORMALISED EXTRACT
Table of contents
  1. RDF graph model and triple structure
  2. IRIs, literals, blank nodes, datatypes
  3. Named graphs and RDF datasets
  4. Serialization formats and MIME types
  5. IRI resolution and base handling
  6. SPARQL query and update essentials
  7. Mapping to JSON-LD and JSON-LD interop points

1. RDF graph model and triple structure
  - RDF is a directed, labeled graph consisting of triples (subject, predicate, object).
  - Triples: subject is an IRI or blank node; predicate is an IRI; object is an IRI, blank node or literal.
  - Graph identity and merging: two graphs are merged by union of their triples; blank node identifiers are document-scoped and must be treated as anonymous when merging unless canonicalized.

2. IRIs, literals, blank nodes, datatypes
  - IRIs: absolute Unicode strings providing global identifiers; relative IRIs are resolved against a base IRI per RFC3986.
  - Literals: lexical form with optional language tag (e.g., "text"@en) or datatype IRI (e.g., "42"^^http://www.w3.org/2001/XMLSchema#integer).
  - Common datatypes: xsd:string, xsd:boolean, xsd:integer, xsd:decimal, xsd:double, xsd:dateTime; lexical forms must conform to XML Schema datatypes.
  - Blank nodes: represented as anonymous nodes; in RDF serializations they use local blank node labels (e.g., _:b0) and cannot be relied on for stable identification across documents without canonicalization.

3. Named graphs and RDF datasets
  - RDF Dataset: collection of one default graph and zero or more named graphs; each named graph consists of a graph name IRI and its triples.
  - Formats that support datasets: TriG, N-Quads, and application/trig and application/n-quads MIME types; JSON-LD maps datasets to top-level @graph and graph name contexts when using RDF dataset mappings.
  - Use-cases: provenance, quad stores, multi-graph updates and SPARQL dataset operations (using FROM and FROM NAMED clauses).

4. Serialization formats and MIME types
  - Common formats and mime types:
    * Turtle: text/turtle
    * N-Triples: application/n-triples
    * N-Quads: application/n-quads
    * RDF/XML: application/rdf+xml
    * TriG: application/trig
    * JSON-LD: application/ld+json or application/json+ld (application/ld+json preferred)
  - Processors must accept and produce these MIME types for content negotiation; servers should honor Accept and Content-Type headers.

5. IRI resolution and base handling
  - Relative IRIs are resolved against the document base IRI using RFC3986 rules (scheme, authority, path merging, query, fragment handling).
  - Terms and CURIEs in higher-level syntaxes (e.g., JSON-LD context) map to expanded IRIs using vocabulary and prefix rules; when serializing to RDF, ensure consistent base IRI and vocabulary expansion.

6. SPARQL query and update essentials
  - SPARQL query endpoint parameters:
    * query: SPARQL query string (GET with URL-encoding or POST form-encoded)
    * default-graph-uri: URL to use as default graph (can be repeated)
    * named-graph-uri: URL to include named graphs (can be repeated)
  - SPARQL update endpoint parameters:
    * update: SPARQL Update string (POST with application/sparql-update or form-encoded key 'update')
  - SPARQL result media types: application/sparql-results+json, application/sparql-results+xml for SELECT/ASK; application/ld+json or application/n-quads for CONSTRUCT/GRAPH results as supported.
  - Basic pattern: SELECT ?s ?p ?o WHERE { ?s ?p ?o } LIMIT n; use CONSTRUCT for graph construction and UPDATE with INSERT DATA/DELETE WHERE for modifications.

7. Mapping to JSON-LD and JSON-LD interop points
  - JSON-LD maps RDF triples to JSON objects using @id, @type, @value, @language, and @graph; datatypes map to typed value objects.
  - JSON-LD document-level @context controls IRI expansion, term-to-IRI mapping, default language and container mapping; when converting JSON-LD to RDF, processors follow the JSON-LD 1.1 algorithm.
  - Round-tripping considerations: blank nodes and ordering differences require normalization (e.g., URDNA2015) to reliably compare graphs across serializations.

SUPPLEMENTARY DETAILS
  - Content negotiation headers examples:
    * Request Accept: application/ld+json, text/turtle, application/rdf+xml;q=0.9
    * Response Content-Type: application/ld+json; charset=utf-8
  - RDF canonicalization and normalization:
    * Use URDNA2015 algorithm to produce deterministic N-Quads for signing or graph comparison.
  - SPARQL endpoint HTTP methods:
    * GET: for safe queries with 'query' parameter; URL length limits apply.
    * POST: for large queries or updates; use application/sparql-update for updates and application/x-www-form-urlencoded for older endpoints.
  - Named graph usage in SPARQL:
    * FROM <graphIRI> and FROM NAMED <graphIRI> to influence dataset used by a query; use GRAPH ?g { ... } to match named graph triples.

REFERENCE DETAILS
  - MIME types (exact strings):
    * text/turtle
    * application/n-triples
    * application/n-quads
    * application/rdf+xml
    * application/trig
    * application/ld+json
    * application/sparql-results+json
    * application/sparql-results+xml
    * application/sparql-update
  - SPARQL endpoint parameter names (HTTP form fields / query params): query, update, default-graph-uri, named-graph-uri
  - RDF term forms:
    * IRI: <absolute-IRI>
    * Blank node: _:label
    * Literal: "lexicalForm"@lang OR "lexicalForm"^^<datatypeIRI>
  - Datatypes (common IRIs):
    * http://www.w3.org/2001/XMLSchema#string
    * http://www.w3.org/2001/XMLSchema#boolean
    * http://www.w3.org/2001/XMLSchema#integer
    * http://www.w3.org/2001/XMLSchema#decimal
    * http://www.w3.org/2001/XMLSchema#double
    * http://www.w3.org/2001/XMLSchema#dateTime
  - Normalization algorithm name: URDNA2015 (use for deterministic canonicalization producing N-Quads string)
  - JSON-LD to RDF mapping rules: follow JSON-LD 1.1 Processing algorithms (compaction/expansion/flattening/framing) for term expansion and datatype/language handling.

DETAILED DIGEST
  - Source: https://www.w3.org/TR/rdf11-primer/
  - Retrieved: 2026-03-07
  - Content: technical reference material on RDF 1.1 graph model, serializations, and best-practice mapping to other formats.

ATTRIBUTION
  - Attribution: Source document listed in SOURCES.md (W3C RDF 1.1 Primer). Content synthesized and condensed from normative specification sections.
  - Crawl data size: source URL provided in SOURCES.md; no raw crawl bytes were fetched during this operation.
