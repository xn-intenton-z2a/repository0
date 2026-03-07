# JSONLD_PERSISTENCE

Summary

Provide clear, testable JSON-LD persistence behavior for the ontology library so that ontology graphs can be saved to and loaded from the data/ directory in a predictable, documented format.

Rationale

Persistence is core to the mission: the library must reliably export and import ontology state across transform cycles and example runs. Offering two supported persistence modes — per-class files and a single graph file — makes the library flexible for users and compatible with existing JSON-LD tools.

Design

- API surface: add or refine save(dir?, mode?) and load(dir?) behaviors in src/lib/main.js. mode is either per-class or graph. Default: per-class.
- File layout (per-class): data/ClassName.jsonld for each defined class containing the class definition and its individuals. Files must be valid JSON-LD with an @context and @graph.
- File layout (graph): data/ontology.jsonld containing a single JSON-LD graph with all classes, properties, and individuals.
- Implementation details: save should produce deterministic output (sorted keys and stable ordering of arrays where possible) so tests can assert exact file contents. load should accept either layout and merge into runtime graph, preserving ids and class relationships.
- CLI: start script or an exported function should allow invoking save and load programmatically; README must show the command-line usage example.

Tests

- Unit tests verify round-trip: create classes, properties, and individuals, save, clear in-memory data, then load and assert that stats() and query() return the same results.
- Tests for both per-class and graph modes, and for deterministic ordering to enable snapshot-like assertions.

Acceptance Criteria

- save(dir, mode) writes JSON-LD files in the chosen layout under the given directory.
- load(dir) correctly reads either per-class layout or graph layout and reconstructs classes, properties, and individuals.
- Deterministic output such that tests can assert exact file contents for a known ontology.
- README contains a short persistence usage example and documents the two layout modes.
