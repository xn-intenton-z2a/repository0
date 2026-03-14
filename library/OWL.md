OWL

Table of Contents
- Normalised extract
  - OWL 2 core concepts and structures
  - Syntaxes and interchange formats
  - Semantics: Direct and RDF-Based
  - OWL 2 Profiles and computational properties
- Supplementary details
  - Structural specification and mapping to RDF graphs
  - When to choose profiles EL / QL / RL
  - OWL 2 DL syntactic conditions and constraints
- Reference details
  - Mandatory interchange syntax for conformance
  - Profile guarantees and implementation patterns
- Detailed digest and attribution

Normalised extract

OWL 2 core concepts
- OWL 2 ontologies provide classes, properties, individuals and datavalues; ontologies can be viewed either as abstract structural descriptions or as RDF graphs via a mapping
- Key constructs added in OWL 2: keys, property chains, qualified cardinality restrictions, richer datatypes/data ranges, asymmetric/reflexive/disjoint properties, enhanced annotations

Syntaxes and interchange formats
- Mandatory interchange syntax for conformance: RDF/XML
- Optional syntaxes: Turtle, OWL/XML, Functional-Style Syntax, Manchester Syntax
- Mapping to RDF graphs is normative: the OWL 2 RDF Mapping document defines how structural constructs are represented as RDF triples

Semantics
- Direct Semantics: assigns meaning to OWL structural constructs (compatible with SROIQ description logic); used by DL reasoners
- RDF-Based Semantics: assigns meaning directly to RDF graphs; applicable to any OWL 2 ontology
- Correspondence theorem: for OWL 2 DL ontologies the Direct Semantics and RDF-Based Semantics yield compatible inferences after mapping

OWL 2 Profiles and computational trade-offs
- OWL 2 EL: designed for very large ontologies where polynomial-time reasoning for standard tasks is required; supports scalable classification
- OWL 2 QL: designed for ontology-driven query answering where conjunctive queries can be answered via relational technology with low data complexity (AC0)
- OWL 2 RL: designed for rule-based implementations operating directly on RDF triples; enables polynomial-time reasoning using rule engines; implementations are typically sound but may be incomplete unless ontology meets structural restrictions

Supplementary details

Structural specification and RDF mapping
- The structural specification defines the conceptual elements (classes, properties, restrictions, axioms) and a functional syntax; the Mapping to RDF Graphs document gives a deterministic translation from structural syntax to RDF triples
- Implementations that target RDF triple stores should rely on the RDF mapping as the canonical exchange format and must ensure that any syntactic variants (e.g., Manchester) are converted to the RDF form before storage or reasoning

When to choose a profile
- Use OWL 2 EL for large terminologies/classifications (e.g., medical ontologies, taxonomies) where expressivity can be limited to attain performance
- Use OWL 2 QL when the primary workload is conjunctive queries and data is stored in relational databases
- Use OWL 2 RL when rule engines and triple-store-based processing are preferred and when a rule-based approximation is acceptable

OWL 2 DL syntactic conditions and common pitfalls
- Some constructs (e.g., using transitive properties inside cardinality restrictions) are forbidden in OWL 2 DL; confirm ontology conforms to OWL 2 DL restrictions before using DL reasoners
- When converting legacy OWL1 ontologies, verify that new OWL2 features introduced (e.g., keys) do not violate DL global restrictions

Reference details

Conformance and mandatory syntax
- All OWL 2 tools must support RDF/XML as the primary exchange format for conformance testing; other syntaxes are optional but commonly supported (Turtle, Manchester)

Profiles guarantees and implementation patterns
- EL: reasoning tasks are polynomial; choose EL if large terminologies and classification are primary
- QL: query rewriting and database-backed query evaluation; implementers should provide canonical mappings to SQL
- RL: implement as rule set; ensure rule engine supports the profile's rule subset

Detailed digest
- Source: https://www.w3.org/TR/owl2-overview/ (retrieved 2026-03-14) and related OWL 2 normative documents
- Data size: fetched via web-fetch up to 20,000 characters per page; larger documents truncated where indicated

Attribution
- Extracted from W3C OWL 2 Overview and OWL 2 normative documents, retrieved 2026-03-14

End of OWL document
