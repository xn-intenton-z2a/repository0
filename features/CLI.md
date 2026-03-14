# CLI

# Summary

Provide a lightweight command-line interface that exposes basic operations for rapid experimentation and data interchange: define classes, define properties, add individuals, list stats, save, load, import, and export. The CLI should be built from the library and export a program entrypoint at src/lib/main.js when run as a script.

# Motivation

A CLI enables manual exploration, quick reproduction of examples, easier debugging during development and in CI, and simple data interchange for importing and exporting example ontology fragments used by the website and other tools.

# Specification

Behavior

- The CLI supports commands: define-class, define-property, add-individual, stats, save, load, import, export.
- import and export accept a --format option to indicate the file format. Supported formats at minimum: jsonld. Optional formats: turtle (if the n3 dependency is installed).
- import reads one or more files and merges their contents into the in-memory model, returning a JSON summary of items imported and any per-file errors.
- export writes ontology content to a target file or directory in the requested format and returns a JSON summary listing files written.
- Each command accepts simple arguments and prints machine-friendly JSON summary output to stdout for use in tests and scripting.
- The CLI returns non-zero exit codes for errors and sets exit code zero for successful operations.

User-facing flags

- --dir or -d: directory to read/write persisted data for save/load operations (defaults to data/).
- --format or -f: format for import/export operations (default jsonld).
- --validate: when used with save or import, run the library validate() function and fail on error-level issues.
- --quiet: suppress non-JSON logging for use in scripting.

# Acceptance Criteria

- src/lib/main.js can be executed as a Node CLI and accepts the commands listed above.
- The CLI implements import and export for JSON-LD files and returns machine-friendly JSON summaries describing action results.
- When invoked with --format turtle and the implementation provides the required dependency, export produces a valid Turtle file; tests may mock or skip Turtle behavior if dependency absent.
- A unit or integration test programmatically runs the CLI to perform: run seed, save to a temp dir, export the saved data as jsonld into a temp file, import that file into a fresh model, and assert that stats match the original model.
- CLI exit codes reflect success (0) and failure (non-zero) scenarios, and CLI JSON output includes at least keys: { ok: boolean, summary: object, errors?: [] }.

# Testing Recommendations

- Add tests in tests/unit/cli.test.js that spawn the CLI programmatically to run a seed sequence and assert JSON output and exit codes.
- Add an import/export round-trip test that writes exported JSON-LD to a temporary file, runs import against it in a fresh process, and asserts stats() equivalence.
- When testing format-specific behavior (e.g., Turtle), conditionally run the test only if the optional dependency is present or provide a mocked implementation to avoid brittle CI failures.

# Implementation Notes

- Keep the CLI minimal and use the same public API used by programmatic consumers to avoid duplication of logic.
- Implement import/export as thin wrappers around load/save plus format translators where necessary. Prefer supporting JSON-LD first and adding format translators later.
- If adding Turtle support, consider adding the n3 library as an optional dependency and keep the CLI capable of reporting a clear error when the requested format is not available.
- Ensure JSON summaries are stable and machine-friendly for use in tests and automation.

# Related features

- SEED_DATA
- PERSISTENCE
- STATS
- QUERY

# Implementation

- Status: Implemented in src/lib/main.js (exported main() function and CLI command handlers).
- Implemented commands observed: define-class, define-property, add-individual, seed, stats, save, load, export, import; the Node CLI prints machine-friendly JSON and uses exit codes as described in acceptance criteria.
- Notes: save/load/write operations are implemented for Node environments; browser usage returns summaries without file writes.
- Tests: a dedicated tests/unit/cli.test.js is recommended to assert CLI JSON outputs and exit codes; the repository contains unit test scaffolding but may not include a full CLI integration test yet.


# HTTP_SERVER

# Summary

Provide a minimal, Node-friendly HTTP JSON REST API that exposes core library operations for programmatic access, integration testing, and simple automation. The server is intended for development, CI, demos and lightweight service usage and must be easy to start and stop programmatically from tests.

# Motivation

An HTTP API makes the ontology library accessible over the network for integration tests, small services, and demos without requiring direct imports. It enables the web demo and CLI-driven automation to interact with the same public API over HTTP and provides a stable surface for behaviour tests and external tooling.

# Specification

API surface

- startServer(opts?)
  - Exposed as a named export from src/lib/main.js so tests and consumers can start and stop the server programmatically.
  - opts may include: port (0 for ephemeral), host (default 127.0.0.1), basePath (default /), and nodeOnly: boolean to indicate whether filesystem endpoints (save/load/seed) are enabled.
  - Returns an object { port, url, close } where close() stops the server and releases the port.

Server behaviour

- The server returns application/json for all endpoints with a stable wrapper: { ok: boolean, result?: any, error?: string } to simplify assertions in tests.
- Deterministic ordering: list results for classes, properties and individuals are sorted by id or name before being returned to ensure tests are stable.
- Node-only endpoints: save/load/seed endpoints are available only when the runtime supports filesystem writes (or when nodeOnly is true); otherwise they return a machine-friendly error message explaining their absence.
- No authentication: the server is for development and CI; do not gate endpoints behind auth by default. Tests needing isolation should bind to 127.0.0.1 and ephemeral ports.

HTTP endpoints

- GET /health
  - Returns { ok: true, uptime: number, timestamp: ISO } for simple readiness checks.

- GET /stats
  - Returns stats() from the library as result.

- GET /classes
  - Returns an array of class descriptors sorted by name.

- GET /classes/:className
  - Returns the class descriptor including properties and the list of individuals belonging to the class.

- GET /properties
  - Returns an array of property descriptors sorted by name.

- GET /individuals
  - Query string parameters: class, property, value, target
  - Delegates to query(pattern) and returns matched individuals sorted by id.

- GET /individuals/:id
  - Returns the individual object or a not-found wrapper when missing.

- POST /individuals
  - Body: { class: string, id?: string, properties: object }
  - Adds an individual using addIndividual; when id is omitted the server generates a stable id or sequential id for demos.

- PUT /individuals/:id
  - Body: { properties: object, merge?: boolean }
  - Updates the individual via updateIndividual semantics and returns the updated individual.

- DELETE /individuals/:id
  - Removes the individual and returns { ok: true, removed: boolean }.

- POST /query
  - Body: { pattern: object, opts?: object }
  - Runs query(pattern, opts) and returns the results; supports explain: true in opts.

- POST /seed
  - Triggers seedOntology(dir?, opts?) and returns the summary. When filesystem write is not available return a clear node-only message.

- POST /save and POST /load
  - Node-only endpoints wrapping save(dir, opts) and load(dir) respectively, returning their summaries or a node-only error.

Determinism and error handling

- All list and query responses must be sorted deterministically to make tests stable across runs.
- Validation and error responses use HTTP 400 for client errors and 500 for server errors, while always returning the JSON wrapper.
- The server should catch library exceptions and translate them to the wrapper { ok: false, error: message } rather than crashing.

Acceptance Criteria

- startServer is exported as a named function from src/lib/main.js and starts a local HTTP server bound to the requested host/port.
- The listed endpoints are implemented and return deterministic, machine-friendly JSON wrappers.
- Node-only endpoints are disabled in restricted environments and return a clear node-only response when unavailable.
- The server can be started in tests on an ephemeral port and closed via the returned close() method to avoid resource leakage.
- Unit tests exercise the primary flows: health -> seed -> stats -> add individual -> query -> get individual -> delete -> close, asserting JSON shapes and HTTP status codes.

Testing recommendations

- Use port 0 to bind to an ephemeral port in tests and await the resolved port before calling endpoints.
- Use native fetch or a minimal HTTP helper to avoid adding test-only dependencies.
- Isolate tests by resetting the in-memory model between tests or starting a fresh server instance with a clean model.
- Use temporary directories for save/load tests and ensure cleanup after tests.

Implementation notes

- Prefer Node's built-in http module for a minimal dependency footprint; expose a tiny routing helper to map endpoints to handlers.
- Convert library errors into JSON wrapper responses and ensure stable ordering of list results.
- Make the server easy to start and stop programmatically in tests by returning a close() method; ensure close() resolves when the server stops listening.
- Document the server API in README and include an example for starting the server in tests.

# Status

- Status: PROPOSED — HTTP server behaviour is specified and recommended tests are provided; the repository contains partial server code in earlier commits but a dedicated startServer export and integration tests are recommended to satisfy the acceptance criteria and make the server reliable for CI and demos.
