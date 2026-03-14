OWL_EVALUATION

Table of Contents
- Normalised extract
  - Evaluation objective
  - Input normalisation to RDF (N-Quads)
  - OWL 2 conformance checks (syntax and DL restrictions)
  - Profile membership checks (EL, QL, RL)
  - Reasoner-suitability detection (feature presence)
  - Provenance and canonicalisation for deterministic comparison
- Supplementary details
  - SPARQL/triple-pattern checks (explicit queries to detect problematic constructs)
  - Parser/serializer recommendations and exact API call patterns
- Reference details
  - jsonld.js method signatures and options
  - N3.js DataFactory / Parser / Writer / Store signatures
  - rdflib.js core signatures and serializer flags
  - Document loader contract (exact return shape)
- Step-by-step evaluation pipeline (concrete)
- Troubleshooting and remediation procedures (step-by-step)
- Detailed digest (sources + retrieval date)
- Attribution and crawl size

Normalised extract

Evaluation objective
- Assess an OWL 2 ontology for: 1) syntactic well-formedness as an RDF graph, 2) OWL 2 DL compliance (global syntactic restrictions), 3) OWL 2 profile membership (EL / QL / RL), 4) detection of features that require specific reasoners (SROIQ constructs), and 5) deterministic comparability / provenance when exchanging artifacts across environments.

Input normalisation to RDF (N-Quads)
- Canonical, deterministic RDF dataset representation recommended: application/n-quads (N-Quads) with URDNA2015 canonicalization when byte-for-byte comparison or signing is required.
- JSON-LD input normalisation (implementation-ready sequence):
  - expanded = expand(input, { documentLoader, processingMode: 'json-ld-1.1', safe: true }) => Promise<Array<object>>
  - nquads = toRDF(expanded, { format: 'application/n-quads', produceGeneralizedRdf: false }) => Promise<string>
  - canonical = canonize(nquads, { algorithm: 'URDNA2015', format: 'application/n-quads' }) => Promise<string>
  - Use canonical (UTF-8 bytes) as input to hashing (e.g., SHA-256) or deterministic diffs.
- Turtle / TriG / N-Triples / N-Quads: parse with N3.StreamParser / N3.Parser into an N3.Store and write application/n-quads via N3.Writer for canonical processing.
- RDF/XML / OWL/XML: parse using rdflib.js fetcher / parser into an rdflib store, then iterate triples into an N3.Store for N-Quads output if needed.

OWL 2 conformance checks (syntax and DL restrictions)
- Mandatory exchange format for conformance tests: RDF/XML; however tools should accept and convert from Turtle, OWL/XML, Manchester, and JSON-LD into RDF graph form first.
- Key DL syntactic violation to detect (explicit triple-pattern rule): transitive properties appearing in cardinality restrictions are forbidden for OWL 2 DL. Detect by finding pairs of triples where:
  - ?p rdf:type owl:TransitiveProperty .
  - ?r rdf:type owl:Restriction ; owl:onProperty ?p ; owl:cardinality ?n .
  - If such a match exists, mark as OWL 2 DL violation.
- Additional feature detections that require DL support or restrict profile membership: presence of owl:propertyChainAxiom, owl:qualifiedCardinality (owl:onClass / owl:onDataRange), owl:hasKey, usage of nominals (owl:oneOf) and inverse properties (owl:inverseOf). These are use-cases for DL-capable reasoners.

Profile membership checks (EL, QL, RL)
- Profiles are syntactic subsets; membership can be determined via either: (A) OWL API profile checkers (recommended when Java/OWL API available) or (B) a set of syntactic scans over the RDF graph that look for constructs disallowed by the profile.
- Practical approach when OWL API not available:
  - EL: check absence of disallowed constructs such as universal restrictions on datatypes, full negation, nominals and certain complex property operators; focus on detecting use of owl:oneOf, owl:complementOf, owl:hasValue, and complex cardinalities with qualifiers.
  - QL: detect constructs that prevent rewriting-to-SQL: complex class expressions using arbitrary property chains and certain qualified cardinalities.
  - RL: detect uses of constructs outside the RL rule subset; rule-based membership requires ensuring axioms map to the RL rule set.
- For each profile, implement SPARQL-style detectors (examples provided below) to flag potential violations; produce a report listing offending triples and example axioms.

Reasoner-suitability detection (feature presence)
- Identify features that mandate specific reasoners:
  - SROIQ / full OWL 2 DL features: qualified cardinality (owl:onClass, owl:onDataRange), keys (owl:hasKey), property chains (owl:propertyChainAxiom), nominals (owl:oneOf) — use DL reasoners (HermiT, Pellet) for full semantics.
  - EL profile features: simple subclassing and existential restrictions; use EL reasoners (e.g., ELK) for scalable classification.
  - RL profile: rule-engines or forward-chaining triple-store implementations.
- Implementation: gather a feature inventory by scanning the RDF graph for the set of predicate IRIs listed above and produce a feature matrix report.

Provenance and canonicalisation for deterministic comparison
- When ontologies include or import remote resources (contexts, imports), record documentUrl (final resolved URL after redirects) and preserve that provenance in any canonicalization flow.
- Use the JSON-LD canonicalisation flow only for JSON-LD artifacts; for RDF-only artifacts use N-Quads canonicalization. Ensure document loader behavior is reproducible between signer and verifier (same final documentUrl and identical document content) to avoid canonicalisation mismatches.

Supplementary details

SPARQL / triple-pattern checks (implementation-ready)
- Detect transitive property used in cardinality restriction (OWL 2 DL violation):
  SELECT ?p ?restriction ?n WHERE {
    ?p a <http://www.w3.org/2002/07/owl#TransitiveProperty> .
    ?restriction a <http://www.w3.org/2002/07/owl#Restriction> ;
                 <http://www.w3.org/2002/07/owl#onProperty> ?p ;
                 <http://www.w3.org/2002/07/owl#cardinality> ?n .
  }
- Detect property chains: SELECT ?s WHERE { ?s <http://www.w3.org/2002/07/owl#propertyChainAxiom> ?chain . }
- Detect qualified cardinality restrictions: SELECT ?r WHERE { ?r a <http://www.w3.org/2002/07/owl#Restriction> ; ( <http://www.w3.org/2002/07/owl#onClass> | <http://www.w3.org/2002/07/owl#onDataRange> ) ?x . }
- Detect nominals (oneOf): SELECT ?c WHERE { ?c <http://www.w3.org/2002/07/owl#oneOf> ?list . }
- Feature inventory query (list presence of key OWL predicates): SELECT DISTINCT ?p WHERE { ?s ?p ?o . FILTER (?p IN (owl:propertyChainAxiom, owl:onClass, owl:onDataRange, owl:oneOf, owl:hasKey, owl:inverseOf, owl:cardinality, owl:minQualifiedCardinality, owl:maxQualifiedCardinality)) }

Parser / serializer recommendations and exact API call patterns
- JSON-LD (jsonld.js): use expand -> toRDF -> canonize for canonical N-Quads. Method signatures:
  - expand(input: object|string, options?: { documentLoader?: Function; processingMode?: 'json-ld-1.1'|'json-ld-1.0'; safe?: boolean; expandContext?: object|string }): Promise<Array<object>>
  - toRDF(input: object|string|Array<object>, options?: { format?: string; produceGeneralizedRdf?: boolean }): Promise<string|RDFDataset>
  - canonize(input: string|object|Array<object>, options?: { algorithm?: 'URDNA2015'|string; format?: 'application/n-quads'|string }): Promise<string>
- N3.js (parsing/writing large files): core signatures:
  - DataFactory.namedNode(iri: string), .literal(value:string, languageOrDatatype?:string), .blankNode([id?]), .quad(s,p,o,g?)
  - new N3.Parser({ format?, baseIRI?, blankNodePrefix? }).parse(input, callback?(err, quad|null, prefixes?) )
  - new N3.StreamParser() for streaming input; new N3.StreamWriter() for streaming output
  - const store = new N3.Store(); store.addQuad(quad); store.match(s,p,o,g) -> generator/array
  - new N3.Writer({ prefixes?, format? }).addQuad(...); end((err,result)=>{}) to obtain N-Quads when format is 'N-Quads' or 'application/n-quads'
- rdflib.js (RDF/XML and higher-level store): key signatures and effects:
  - graph() => IndexedFormula (in-memory store)
  - new Fetcher(store, options) and fetcher.load(uriOrNode, options) => Promise; records provenance
  - serialize(documentNode: NamedNode, kb: IndexedFormula, baseIRI: string, mimeType: string, callback?: (err, result)=>void, options?: { flags?: string }) => string|void
  - serializer flags via options.flags: e.g., 'o' avoids dotted local-part prefixing, 'p' disables prefix abbreviations, 'dr' influences JSON-LD conversion
- Document loader contract (exact return object):
  - async function documentLoader(url: string, options?: any) => Promise<{ contextUrl: string | null; document: any; documentUrl: string }>
  - documentUrl must be the final resolved URL after redirects; contextUrl is URL from Link: rel="context" when present; document is parsed response content.

Reference details

Actionable SPARQL detectors, parser calls and expected outputs
- Parse input, materialize to N-Quads, then run the SPARQL detectors above against an in-memory SPARQL engine or execute equivalent pattern scans over an RDF/JS store (N3.Store or rdflib store). For example, using a SPARQL engine: load N-Quads into the engine, run the transitive-cardinality query, and if results non-empty mark DL violation.

Step-by-step evaluation pipeline (concrete)
1. Detect input format. If JSON-LD: run jsonld.expand -> jsonld.toRDF(format: 'application/n-quads') -> jsonld.canonize(algorithm: 'URDNA2015') to obtain canonical N-Quads; else parse native syntax to N-Quads using N3.Parser (Turtle/TriG/N-Triples) or rdflib.parse (RDF/XML).
2. Load N-Quads into an in-memory RDF store (N3.Store or rdflib IndexedFormula) for scanning and SPARQL checks.
3. Run SPARQL detectors: transitive-in-cardinality, propertyChain, qualifiedCardinality, nominals, hasKey, inverseOf. Record offending triples/blank-node identifiers.
4. If OWL API is available (Java): run profile checks and OWL 2 DL structural checks via OWL API profile checkers (recommended for comprehensive, normative checks). Otherwise, produce a syntactic report from step 3 and map reported violations to profile rules.
5. Produce a feature inventory and reasoner recommendation: if only EL constructs present -> EL reasoner (ELK); if RL constructs dominate -> rule engine; else DL reasoner required.
6. If deterministic comparison across environments needed: ensure documentLoader behaviour is reproducible, then compare canonical N-Quads byte-for-byte.

Troubleshooting and remediation procedures
- Symptom: parser rejects input (syntax error)
  1. Identify content type mismatch; re-run parser with explicit format hint (e.g., N-Triples vs Turtle vs RDF/XML).
  2. If RDF/XML fails, try rdflib.js which has broader XML support; if still fails, apply permissive parsing to identify error tokens, then fix syntax.
- Symptom: DL checker flags transitive-in-cardinality violations
  1. Locate offending restriction blank node and its owl:onProperty; if the property must be transitive, refactor the ontology to remove the cardinality restriction over that property or use alternative modeling (e.g., convert cardinality requirement to existential patterns and downstream constraints).
- Symptom: profile membership ambiguous or false positives
  1. Use OWL API profile checkers for normative verification; if OWL API not available, expand SPARQL detectors and verify each flagged axiom in source syntax to confirm true violation.
- Symptom: canonicalisation mismatch between environments
  1. Verify both environments use algorithm: 'URDNA2015' and format: 'application/n-quads'.
  2. Verify documentLoader yields identical documentUrl and document content for any remote imports or contexts; differences there are the most common cause of mismatch.

Detailed digest
- Sources used to construct this document (retrieved 2026-03-14):
  - JSON-LD 1.1 Syntax: https://www.w3.org/TR/json-ld11/
  - JSON-LD 1.1 Processing Algorithms and API: https://www.w3.org/TR/json-ld11-api/
  - jsonld.js (digitalbazaar): https://github.com/digitalbazaar/jsonld.js
  - OWL 2 Overview: https://www.w3.org/TR/owl2-overview/
  - RDF 1.1 Primer: https://www.w3.org/TR/rdf11-primer/
  - N3.js: https://github.com/rdfjs/N3.js
  - rdflib.js: https://github.com/linkeddata/rdflib.js
- Retrieval and crawl notes: web fetches were limited to 20,000 characters per URL during extraction; longer normative pages were truncated where indicated. Local library documents were read and consolidated.

Attribution and crawl snapshot
- Retrieval timestamp: 2026-03-14T10:39:31.306Z
- Fetch parameters: web_fetch was invoked with max_length=20000 characters per URL; responses that exceeded this limit are marked below as Content truncated.
- Per-URL results (note: 'Content truncated' indicates the returned page reached the fetch limit):
  - https://www.w3.org/TR/json-ld11/ — fetched up to 20000 chars; Content truncated: YES
  - https://json-ld.org/ — fetched within limit; Content truncated: NO
  - https://www.w3.org/TR/json-ld11-api/ — fetched up to 20000 chars; Content truncated: YES
  - https://github.com/digitalbazaar/jsonld.js — fetched within limit; Content truncated: NO
  - https://www.w3.org/TR/owl2-overview/ — fetched up to 20000 chars; Content truncated: YES
  - https://www.w3.org/TR/rdf11-primer/ — fetched up to 20000 chars; Content truncated: YES
  - https://github.com/rdfjs/N3.js — fetched within limit; Content truncated: NO
  - https://github.com/linkeddata/rdflib.js — fetched within limit; Content truncated: NO

Notes:
- For full normative definitions consult the original W3C and project URLs listed in the SOURCES.md file. Truncated pages should be re-fetched with a start_index to obtain the remaining content if exact normative text is required.
- Attribution: condensed and adapted from the W3C JSON-LD 1.1 documents, OWL 2 Overview, RDF 1.1 Primer, and the jsonld.js, N3.js and rdflib.js project READMEs; retrieval date: 2026-03-14.

End of OWL_EVALUATION
