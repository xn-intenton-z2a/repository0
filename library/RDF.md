RDF

Table of Contents
- Normalised extract
  - Triples and graph model
  - IRIs, Literals, Blank nodes
  - RDF Datasets and named graphs
  - RDF Schema modeling constructs
  - Serialization formats and MIME types
- Supplementary details
  - IRI resolution and base IRI rules
  - Literal datatypes and language-tag handling
  - Datasets: default graph vs named graphs
- Reference details
  - MIME types mapping
  - Minimal API contract for parsers/writers
  - JSON-LD to RDF mapping summary (concrete rules)
- Detailed digest and attribution

Normalised extract

Triples and graph model
- An RDF triple is a three-part statement: subject predicate object
  - Subject: IRI or blank node
  - Predicate: IRI (always)
  - Object: IRI, blank node, or literal
- An RDF Graph is a set of RDF triples; an RDF Dataset is a collection of one default graph and zero or more named graphs

IRIs
- IRIs (RFC3987) identify resources. They are used in subject, predicate and object positions as appropriate
- Relative IRIs are resolved against a base IRI per RFC3987; JSON-LD uses @base or document/HTML base to resolve

Literals
- Literals are typed values or language-tagged strings
  - Typed literal: value with datatype IRI (e.g., xsd:dateTime)
  - Language literal: value with language tag, typically represented as rdf:langString
- Implementations must map common JSON datatypes to XML Schema datatypes when serializing to RDF (numbers to xsd:integer/xsd:double, booleans to xsd:boolean) or preserve literal lexical form when consuming RDF

Blank nodes
- Blank nodes represent resources without a global IRI; they may appear in subject or object positions
- Blank node identifiers are local to the dataset and must not be treated as stable global identifiers; use canonicalization when serializing for comparison

RDF Datasets and named graphs
- An RDF Dataset contains a default graph and named graphs identified by graph-name IRIs
- Named graphs group triples and are often used to represent provenance, source separation, or multigraph datasets

RDF Schema constructs (practical)
- Class definition: rdf:type rdfs:Class
- Property definition: rdf:type rdf:Property
- Subclass/property hierarchies: rdfs:subClassOf, rdfs:subPropertyOf
- Domain/range: rdfs:domain, rdfs:range

Serialization formats and MIME types
- Turtle: text/turtle
- RDF/XML: application/rdf+xml
- N-Triples: application/n-triples
- N-Quads: application/n-quads
- TriG: application/trig
- JSON-LD: application/ld+json (or application/json with context link)

Supplementary details

IRI resolution and base rules
- Base IRI resolution follows RFC3987 and is applied when expanding relative IRIs; when multiple base declarations exist follow JSON-LD and HTML base rules for @base and HTML <base>

Literal datatypes mapping
- Recommended literal mapping to XSD:
  - integer-like numbers -> http://www.w3.org/2001/XMLSchema#integer
  - floating point numbers -> http://www.w3.org/2001/XMLSchema#double
  - booleans -> http://www.w3.org/2001/XMLSchema#boolean
  - strings with language tags -> rdf:langString

Datasets: default vs named graphs
- Default graph triples are considered the primary graph; named graphs are accessed by graph name in query languages such as SPARQL
- When serializing JSON-LD to a dataset, use named graph containers in context to preserve graph separation

Reference details

MIME types and example uses
- text/turtle — compact human-readable RDF serializations; use for config and authoring
- application/n-quads — canonical machine-friendly quad format suitable for canonicalization
- application/ld+json — JSON-LD documents; use when serving JSON-LD payloads via HTTP

Minimal parser/writer contract (for library implementers)
- Parser(inputStream, options?) => emits quads/triples asynchronously via a callback or stream interface; accepts format or MIME type hint
- Writer(options?) with methods addQuad(quad) and end(callback) where end returns serialized string or writes to stream

JSON-LD to RDF mapping summary (concrete rules)
- property IRI -> predicate
- node @id -> subject or object IRI
- {"@value": v, "@type": t} -> literal with datatype t
- {"@value": v, "@language": "en"} -> literal with language tag
- {@list: [...] } -> RDF collection compiled into rdf:first/rdf:rest chain
- @type entries -> rdf:type triples

Detailed digest
- Source: https://www.w3.org/TR/rdf11-primer/ (retrieved 2026-03-14), plus JSON-LD spec and library docs processed concurrently
- Data size: pages fetched with web-fetch max_length=20000; longer pages were truncated and noted

Attribution
- Extracted from W3C RDF 1.1 Primer and related W3C resources, retrieved on 2026-03-14

End of RDF document
