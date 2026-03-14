# QUERY_INFERENCE

Summary

Provide a deterministic, easy-to-test query API with a small, auditable inference layer that supports transitive subclass reasoning and property-availability inheritance. The feature enhances the existing query() API exported from src/lib/main.js so website demos, CLI and unit tests can rely on intuitive OWL-like behaviour without a full reasoner.

Motivation

A lightweight inference layer makes queries more useful for common ontology tasks (for example: querying for all Animals should return instances of Mammal). Keeping inference simple and deterministic keeps tests stable and execution fast on the seed datasets used by the mission.

Specification

API surface

- query(pattern, opts?)
  - pattern is an object with optional keys: class, property, value, target.
  - opts supports:
    - includeSubclasses: boolean (default true) — include instances of subclasses when matching a class.
    - reasonLevel: none | simple (default simple) — none disables inference, simple applies subclass closure and property-availability inheritance only.
    - explain: boolean (default false) — when true, results include matchedBy and inferenceChain fields explaining inferred matches.
  - Returns an array of result objects. When explain is false each result is the matched individual object; when explain is true each result is extended with matchedBy: "direct" | "inferred" and inferenceChain: an array of concise human-readable steps.

Pattern behaviour

- class: short name or IRI of a class. When present, candidate instances are those whose declared class equals the class or (when includeSubclasses true) any subclass transitively.
- property: short name or IRI of a property. Matches individuals that have the named property with a value matching value (when value provided) or that reference target (when target provided).
- value: literal to match against property values.
- target: an individual id for reference-style property matching.

Determinism and ordering

- Results must be deterministic. The implementation sorts results by a stable key (preferably individual id) before returning so tests and UI remain stable across runs.

Inference semantics

- Subclass closure: classes are treated transitively. A query for class C matches any individual whose declared class is C or any subclass of C.
- Property-availability inheritance: a property declared with a domain that includes class C is considered applicable to instances of subclasses of C. Querying for class C and property P must consider property declarations on C and its superclasses.
- Explanation: when explain is true, inferred matches include inferenceChain entries such as "Mammal rdfs:subClassOf Animal" or "property hasHabitat declared on Animal, applied to Mammal" to make reasoning steps auditable.

Performance

- The inference layer must be lightweight. Implementations should precompute or memoise subclass closure and property-availability maps on schema mutation (defineClass/defineProperty) and reuse them for queries to avoid repeated traversal.
- The design must be efficient for small seed datasets (tens of classes and hundreds of individuals) and must not attempt full OWL reasoning.

Acceptance Criteria

- API: query is exported as a named function from src/lib/main.js and supports query(pattern, opts?).
- Basic pattern support: query({ class: "Animal" }), query({ property: "hasName", value: "Fido" }), query({ property: "friendOf", target: "dog1" }) work as described.
- Subclass inference: a unit test creates classes Animal and Mammal (Mammal subclass of Animal), adds an individual of class Mammal, and asserts query({ class: "Animal" }) returns the Mammal instance when includeSubclasses is true (default).
- Property inheritance: a unit test defines property hasHabitat with domain Animal, adds a Mammal instance with hasHabitat = "forest", and asserts query({ property: "hasHabitat", value: "forest" }) returns that instance; combined query({ class: "Animal", property: "hasHabitat", value: "forest" }) also returns it.
- Explainable matches: when opts.explain = true, inferred results include matchedBy: "inferred" and inferenceChain arrays describing inference steps; direct matches include matchedBy: "direct".
- Disabling inference: when opts.reasonLevel = "none" or includeSubclasses = false the tests verify only direct matches are returned.
- Deterministic ordering: tests assert query results are returned in stable order (sorted by id).
- Tests: tests/unit/query.test.js contains the tests above and they pass deterministically.

Testing recommendations

- Implement tests that build the model in-memory using defineClass, defineProperty, addIndividual and avoid disk IO unless explicitly testing persistence interaction.
- Recommended test cases:
  - subclass closure test: define Animal/Mammal, add Mammal instance, assert Animal query returns it
  - property inheritance test: define property on Animal, add Mammal instance with the property, assert queries find it
  - explain test: assert matchedBy and inferenceChain for inferred matches
  - no-inference test: verify reasonLevel none prevents inferred matches
  - deterministic ordering: run the same query multiple times and assert stable order

Implementation notes

- Maintain a class -> superclasses map and compute transitive subclass closure on mutation or lazily with caching.
- Maintain a property domain map and compute property-availability per class (including subclasses) when classes or properties change.
- At query time translate the pattern into candidate classes and properties then filter individuals accordingly; gather explanation steps when explain is true.
- Always sort final result set by individual id before returning.
- Keep inference code in a small internal helper to keep surface API code clear and simple to test.

Compatibility and migration

- Default reasonLevel is simple to give users the benefit of intuitive inference; an opt-out via reasonLevel = none preserves previous behaviour for consumers needing exact-match semantics.
- Implement new behaviour behind unit tests incrementally: add failing tests first and then implement property-availability mapping and query changes.

# End of spec


# HTTP_SERVER

Summary

Provide a minimal, Node-friendly HTTP JSON REST API that exposes core library operations for programmatic access, integration testing, and simple automation. The server is intended for development, CI, demos and lightweight service usage and must be easy to start/stop programmatically from tests.

Motivation

An HTTP API makes the ontology library accessible over the network for integration tests, small services, and demos without requiring direct imports. A single-file, dependency-free server keeps the runtime footprint small and is easy to exercise from unit and behaviour tests.

Specification

Public API

- The library exports a startServer(opts?) named function from src/lib/main.js that starts the HTTP server and returns an object { port, url, close() }.
  - opts may include: port (0 for ephemeral), host (default 127.0.0.1), basePath (default /), and nodeOnly: boolean to indicate save/load endpoints will be enabled only when true.
  - When port: 0 is used the server binds to an available ephemeral port and the returned object contains the resolved port.

HTTP endpoints

All endpoints return application/json and a top-level { ok: boolean, result?: any, error?: string } wrapper for machine-friendly assertions.

- GET /health
  - Returns { ok: true, uptime: seconds, timestamp: ISO } to allow basic readiness checks.

- GET /stats
  - Returns the stats() object.

- GET /classes
  - Returns an array of class descriptors sorted by name.

- GET /classes/:className
  - Returns the class descriptor with properties and individuals belonging to the class.

- GET /properties
  - Returns an array of property descriptors sorted by name.

- GET /individuals
  - Accepts optional query string parameters: class, property, value, target.
  - Performs a query equivalent to query(pattern) and returns matched individuals sorted by id.

- GET /individuals/:id
  - Returns the individual object or 404-like { ok: false, error: 'not found' } when missing.

- POST /individuals
  - Body: { class: string, id?: string, properties: object }
  - Adds an individual via addIndividual; when id omitted the server generates a unique id.
  - Returns the created individual object.

- PUT /individuals/:id
  - Body: { properties: object, merge?: boolean }
  - Updates the individual using updateIndividual semantics and returns the updated individual.

- DELETE /individuals/:id
  - Removes the individual and returns { ok: true, removed: boolean }.

- POST /query
  - Body: { pattern: object, opts?: object }
  - Runs query(pattern, opts) and returns an array of results; supports opts.explain = true.

- POST /seed
  - Triggers seedOntology(dir?, opts?) and returns the summary. Node-only: when server is running in non-Node or nodeOnly=false the endpoint must return a friendly message explaining that filesystem writes are disabled.

- POST /save and POST /load
  - Node-only endpoints that call save(dir, opts) and load(dir) respectively and return their summaries. When not available they return { ok: false, error: 'node-only' }.

Security and environment

- The server is intended for development and test-only usage; it is not hardened for production use.
- No authentication is required by default to simplify test harness use; tests needing isolation should bind to 127.0.0.1 and ephemeral ports.
- The server must detect runtime environment and safely disable file-system endpoints when running in restricted environments.

Behavioral details

- Determinism: results from list endpoints and query endpoints are sorted deterministically (classes, properties and individuals by id/name) to make tests stable.
- Error handling: validation errors return HTTP 400 with { ok: false, error: string } and non-recoverable server errors return HTTP 500.
- Programmatic shutdown: the object returned by startServer includes a close() method that stops listening and releases the port; tests must call close() to avoid port leakage.
- Minimal dependencies: prefer Node built-in http module to avoid adding runtime dependencies. If express or a framework is chosen, add it to package.json and document it in README.

Acceptance Criteria

- startServer(opts?) is exported from src/lib/main.js and starts a local HTTP server bound to the requested host/port.
- All endpoints listed above are implemented and return machine-friendly JSON wrappers with ok/result/error keys and deterministic ordering where applicable.
- Node-only endpoints (save/load/seed) return a descriptive node-only response when filesystem writes are disabled.
- Server can be started programmatically in tests on an ephemeral port and cleanly closed via close(); tests that start the server must reliably shut it down.
- A unit test exists at tests/unit/http-server.test.js that starts the server, exercises at least these flows: health -> seed -> stats -> add individual -> query -> get individual -> delete -> close, asserting JSON shapes and HTTP status codes.
- Tests use temporary directories for any save/load operations and bind to host 127.0.0.1 with port 0 to avoid collisions in CI.

Testing recommendations

- Use a small helper in tests to start the server with port: 0 and await the resolved port before HTTP requests begin.
- Use a minimal HTTP client such as fetch (node 18+) or a tiny helper based on http.request to avoid adding test-time dependencies.
- Tests should not depend on side effects from previous tests: use resetModel() or start a fresh server instance with a clean in-memory model between tests.
- For integration tests that exercise save/load, use mkdtempSync to create a temporary directory and pass that to seed/save/load; clean up the directory after the test.

Implementation notes

- Implement server using Node's http module and a small router helper to keep footprint minimal and avoid adding dependencies.
- Keep request/response bodies JSON and small; implement basic input validation and return clear error messages for invalid payloads.
- Provide convenience helpers to serialize and sort results deterministically and to catch and translate library errors into HTTP responses.
- Export startServer and ensure it returns an object with { port, url, close } to make test harnesses simple.
- If an external library is chosen (express/fastify), add it to package.json and keep the server file small and reversible.

Related features

- CLI (consistent behaviour with REST endpoints)
- WEB_DEMO (the demo can call the HTTP API when running on the same host)
- PERSISTENCE (save/load endpoints are node-only wrappers around persistence API)
- SEED_DATA (seed endpoint delegates to seedOntology)
- QUERY (query endpoint delegates to query())

# End of HTTP_SERVER
