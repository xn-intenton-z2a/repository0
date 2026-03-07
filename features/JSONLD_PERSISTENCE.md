# JSONLD_PERSISTENCE

Summary

Provide clear, testable JSON-LD persistence behaviour for the ontology library and include a canonical example animal seed within the same feature so the repository ships with demonstrable data. This feature specifies deterministic per-class and single-graph save/load layouts, the JSON-LD file structure, and the animal taxonomy seed content and loading procedure.

Rationale

Persistence and a working seed are core to the mission: library users and automated workflows must be able to save, load and inspect ontology data across transform cycles. Combining the seed and persistence guidance keeps related concerns in one place, reduces duplication in tests and documentation, and ensures the example data follows the persistence layout exactly.

Design

- API surface: implement save(dir?, mode?) and load(dir?) in src/lib/main.js; export named functions save and load. mode is either "per-class" or "graph" (default: "per-class").

- File layout (per-class): write data/ClassName.jsonld for each defined class. Each file is valid JSON-LD with an @context and @graph containing the class declaration, related property declarations (where convenient) and the individuals of that class. Example layout:
  - data/Animal.jsonld
  - data/Mammal.jsonld
  - data/Dog.jsonld
  Files must include @context at the top and deterministic ordering of keys and arrays.

- File layout (graph): write data/ontology.jsonld containing a single JSON-LD graph with all classes, properties and individuals under @graph and an @context at the root.

- Determinism: save must produce deterministic output for stable tests: sort object keys, order arrays by stable criteria (e.g., alphabetical by @id), and normalise numeric/boolean literal forms. This allows tests to assert exact file contents when required.

- Load behaviour: load(dir) must accept either layout and merge the contents into the runtime graph. When loading per-class files, the loader reads all .jsonld files under the directory; when loading a single graph file it reads ontology.jsonld. Loading must preserve @id values and subclass relationships and avoid duplicating individuals when the same @id is present in multiple files.

- Small, dependency-free JSON-LD handling: implement basic JSON-LD handling without heavy external dependencies; using lightweight JSON processing and stable key ordering is sufficient for the repository's acceptance tests. The implementation must be contained in src/lib/main.js so it is easy to import in the web example and CLI.

Seed data: Animal taxonomy

Include a canonical animal seed in data/ consistent with the per-class layout that demonstrates classes, properties and individuals.

Content (per-class representation):

- Classes:
  - Animal (base)
  - Mammal (rdfs:subClassOf Animal)
  - Bird (rdfs:subClassOf Animal)
  - Dog (rdfs:subClassOf Mammal)
  - Cat (rdfs:subClassOf Mammal)

- Properties:
  - hasName (datatype property, literal)
  - hasColor (datatype property, literal)
  - eats (object property, domain: Animal, range: Animal)

- Individuals:
  - ex:Fido  -> type: Dog, hasName: "Fido", hasColor: "brown"
  - ex:Whiskers -> type: Cat, hasName: "Whiskers", hasColor: "black"
  - ex:Tweety -> type: Bird, hasName: "Tweety", hasColor: "yellow"

Seed storage guidance

- Place seed files under data/ following the per-class layout. Each file must include an @context that maps local terms to compact IRIs used by the library (e.g., hasName => http://example.org/hasName). Example file names: data/Animal.jsonld, data/Mammal.jsonld, data/Dog.jsonld. The repository should already include these files; tests will reference the seed in data/.

- Provide a minimal README snippet in README.md (or the main README) that shows how to call load() to import the seed into memory.

Implementation notes

- save(dir, mode): synchronous or promise-returning function that writes files to the provided directory. It should create the directory if missing and write files with stable formatting (2-space JSON indentation) and deterministic ordering.

- load(dir): synchronous or promise-returning function that reads files and constructs in-memory structures for classes, properties and individuals, merging duplicates by @id and preserving subclass relations.

- The implementation must be self-contained in src/lib/main.js so the web example (src/web/) and CLI (src/cli/) can import it without extra dependencies.

Tests

- Round-trip tests: create an in-memory ontology (define classes, properties, add individuals), call save(dir, 'per-class'), clear in-memory graph, call load(dir) and assert stats() and query() results match pre-save state.

- Graph mode tests: same as above but save/load with mode 'graph' using data/ontology.jsonld.

- Deterministic output tests: given a known ontology, call save() and assert exact file contents (string equality) for at least one class file and the graph file (snapshot-style assertions).

- Seed tests: assert that loading the included animal seed produces:
  - classes: 5
  - properties: 3
  - individuals: 3
  And that findInstances('Dog') returns ex:Fido and findByProperty('hasColor','brown') returns ex:Fido.

- Edge cases: loading should ignore non-jsonld files, tolerate extra keys in files, and report errors when JSON is malformed.

Acceptance Criteria

- save(dir, mode) writes JSON-LD files in per-class or graph layout under the given directory and with deterministic ordering.
- load(dir) reads either per-class or graph layout and reconstructs classes, properties and individuals in memory without duplicating resources with the same @id.
- The repository includes the animal seed files under data/ following the per-class layout and load() can import them.
- Unit tests cover round-trip persistence for both modes and deterministic output assertions; seed load tests assert the example counts and basic queries.
- README contains a short persistence usage example showing load() and save() usage with the included seed.

Compatibility Notes

- Keep JSON-LD handling lightweight and implement behaviour within src/lib/main.js to ensure the library can be imported by the web example and CLI without adding heavy dependencies.
- Determinism is required for tests; when exact ordering cannot be guaranteed for complex nested structures, tests should assert key aspects and one deterministic snapshot per layout to validate output.
