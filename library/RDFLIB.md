RDFLIB

Table of Contents
- Implementation extract (rdflib.js)
  - Supported formats and APIs
  - Serializer flags and effects
  - High-level modules: graph, serialize, fetcher, UpdateManager
- Supplementary details
  - Installation and bundling notes
  - Serializer flags reference and behavior
  - Fetcher and update patterns for Linked Data clients
- Reference details (API signatures, flags, examples)
- Detailed digest and attribution

Implementation extract
- rdflib.js is a JavaScript RDF library for browsers and Node.js providing parsing, serializing, fetching, local store API and SPARQL-like graph matching
- Supported input/output: RDF/XML, Turtle, N3, JSON-LD, RDFa reading support
- Key high-level functions and objects exposed:
  - graph() => creates an in-memory graph/store
  - serialize(doc, kb, base, mimeType, callbackOrUndefined, options?) => serializes a graph into given mimeType
  - sym(iri) => NamedNode construction
  - fetcher: HTTP fetch utility that records provenance and metadata
  - UpdateManager: handles authenticated updates (PUT/PATCH/POST)

Serializer flags and behavior
- Serializer accepts optional flags string merged with defaults; flags alter abbreviation and prefixing behavior
- Common flags and effects (library-specific):
  - 's' 'i' — defaults for Turtle to suppress certain abbreviations
  - 'dr' — JSON-LD conversion flag (no default, avoid relative prefixing)
  - 'o' — do not abbreviate prefixed names when local part contains a dot
  - 'p' — disable prefix abbreviations entirely (write full IRIs)
- Flags passed via options argument to serialize(...) are merged with defaults and influence output terseness and IRIs abbreviation

High-level usage patterns
- For Linked Data clients, use fetcher to read remote graphs, store provenance metadata in RDF, and use UpdateManager for authenticated updates
- Smushing and owl:sameAs handling: store can be configured to smush nodes using sameAs or functional properties

Reference details (API signatures and examples)
- Installation: npm install rdflib
- Example:
  - import { graph, serialize, sym } from 'rdflib'
  - const kb = graph()
  - const doc = sym('http://example.com/doc')
  - populate kb with statements
  - const turtle = serialize(doc, kb, doc.value, 'text/turtle', undefined, {flags: 'o'})
- Serializer signature (practical): serialize(documentNode, graphStore, baseIRI, mimeType, callback?, options?) => string | invokes callback with result
- Flags: supply options.flags string; common values described above
- Fetcher/custom fetch: see "Using authenticated & alternate fetch methods" docs for integrating different HTTP clients or auth providers

Detailed digest
- Source: https://github.com/linkeddata/rdflib.js (retrieved 2026-03-14)
- Data size: docs and README content fetched up to 20k characters each; documentation pages truncated where indicated

Attribution
- Extracted from rdflib.js repository and documentation pages

End of RDFLIB document
