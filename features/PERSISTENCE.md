# PERSISTENCE

# Summary

Provide a stable JSON-LD persistence feature for the ontology library. Implement save(dir?) and load(dir?) semantics that persist the in-memory model to disk and restore it, using a deterministic, testable file layout under the data/ directory by default.

# Motivation

Persisting the ontology as JSON-LD enables long-term storage, reproducible example data for the website, and reliable transform cycles required by the mission. A canonical on-disk layout simplifies unit tests and example generation and makes it feasible to evolve seed data across successive transform cycles without creating noisy diffs.

# Specification

API

- save(dir?, opts?)
  - Writes an on-disk representation of the current ontology into dir (defaults to data/).
  - Creates a context file named context.jsonld at dir/ containing the shared JSON-LD context.
  - For each defined class, creates a file named Class-{kebab-case-classname}.jsonld containing a JSON-LD graph that includes the class declaration, relevant property definitions, and the individuals belonging to that class.
  - If opts.validate is true, runs validate() before writing and fails with a descriptive error if validation issues are found.
  - If opts.version is provided, save records the model version in each written file or in a manifest (see Versioning section below).
  - Returns a summary object describing counts of classes, properties, and individuals and a list of files written.

- load(dir?)
  - Loads JSON-LD files from dir (defaults to data/) and restores classes, properties, and individuals into the in-memory model.
  - Supports both the one-file-per-class layout and a single graph file named graph.jsonld if present.
  - When files include a modelVersion, load attempts to detect mismatches with the library's current modelVersion and returns a migration plan in the summary when versions differ.
  - Returns a summary object describing counts and a list of files read, plus a details array for any per-file parse or validation errors.

File format

- All produced files are valid JSON-LD and include an @context that matches or references context.jsonld.
- Individuals reference their class using the same short names or IRIs as used by the model so load can resolve references deterministically.
- Written files may include a top-level modelVersion key or the repository may include a manifest.json listing files and the current modelVersion; either approach is accepted but must be deterministic and machine-readable.

JSON-LD CANONICALIZATION

# Summary

Provide an explicit, testable canonicalization contract so saved JSON-LD outputs are bit-for-bit deterministic when requested. Canonicalization ensures stable blank node identifiers, consistent ordering and reproducible byte-for-byte output to make diffs, automated migrations and CI comparisons reliable.

# Motivation

Even with stable key ordering, JSON-LD graphs may contain blank nodes and structural variations that produce non-deterministic serialisations. A canonicalisation step removes this variability so the same in-memory model always writes identical files when canonicalization is enabled.

# Specification

API

- canonicalize(docOrDataset, opts?)
  - Accepts a JSON-LD document or an array of JSON-LD graphs and returns a canonicalised representation suitable for deterministic serialisation.
  - opts may include algorithm: "urdna2015" | "fallback" (default: prefer urdna2015 when available, fallback to deterministic hashing otherwise), and produceNormalized: boolean (when true, return a normalized N-Quads style string; when false, return a JSON-LD object with deterministic blank node ids and sorted keys).
  - canonicalize is exposed as a named export and used internally by save() when opts.canonicalize is true.

Behavior

- When save(dir, { canonicalize: true }) is invoked the library canonicalizes each class graph before serialising to disk, producing deterministic blank node ids and stable key/value ordering so repeated saves are bit-for-bit identical for the same model state.
- Preferred algorithm: use an established RDF dataset normalisation algorithm (URDNA2015) if the environment has a suitable implementation available (for example via an optional dependency such as rdf-canonize or jsonld.js normalization API). When not available, fall back to a deterministic algorithm implemented in the library:
  - Create a canonical string for each node by sorting property keys and canonicalising referenced nodes recursively.
  - Compute a stable hash of the sorted canonical representation to derive deterministic blank node labels.
  - Use stable array ordering policies (sort arrays of literals and objects by canonical string) to avoid nondeterministic iteration differences.
- Canonicalisation must preserve JSON-LD semantics: round-tripping canonicalize -> serialise -> load must produce an equivalent graph (isomorphic as RDF), and load should accept canonicalised outputs.

Error handling and fallbacks

- If canonicalize requests urdna2015 but no library is available, canonicalize should fall back to the deterministic algorithm and log a warning in the summary returned by save().
- canonicalize should be deterministic across Node versions and OSes; avoid using non-deterministic object iteration or system-specific metadata.

Acceptance Criteria (canonicalization)

- The library exposes canonicalize as a named export from src/lib/main.js.
- Calling save(dir, { canonicalize: true }) twice on the same in-memory model produces file contents that are byte-for-byte identical.
- Unit tests exist in tests/unit/canonicalization.test.js that:
  - Create an in-memory model containing blank nodes (for example nested anonymous nodes or nodes created without stable IRIs), call save(tempDir, { canonicalize: true }) twice and assert all files in tempDir have identical checksums or identical contents.
  - Verify that outputs produced by canonicalize() round-trip through load() and produce equivalent stats() and validate() results (isomorphism assertion).
  - If URDNA2015 is available in the environment, verify canonicalize("urdna2015") returns a normalized string and that save uses that by default.
- save returns a summary that includes canonicalization: { canonicalized: boolean, algorithm: string, warning?: string } when opts.canonicalize is used.

Context management

- Provide a deterministic, canonical context.jsonld at the root of the saved data dir that defines the prefix aliases, datatype and vocabulary mappings used by the ontology.
- The library exposes helpers to read and write the context: getContext() returns the in-memory context object, setContext(context) replaces it, and mergeContext(partial) merges provided prefix mappings deterministically.
- When saving, save writes context.jsonld with stable key ordering and minimal formatting to reduce unrelated diffs; timestamps or non-deterministic metadata must be avoided in the canonical context file.
- Prefix aliases defined in context.jsonld must be honoured when serialising IRIs in class/property/individual files: short prefixed names are allowed where unambiguous, otherwise full IRIs should be emitted.
- load(dir) should prefer an explicit context.jsonld when present; if absent, the loader should accept an inline @context in graph files but log a warning and normalise the combined context into the in-memory context for later save operations.
- The persistence API should surface a machine-friendly summary of context differences when loading an ontology produced by a different context (for example, mismatched prefix expansions) so tools can programmatically decide to accept or normalise contexts.

Error handling

- save should create dir if it does not exist and report a descriptive error if writing fails.
- load should attempt to process all files and return per-file errors rather than aborting on the first parse failure; the returned summary includes a details array with file-level errors.

# MODEL_VALIDATION

# Summary

Provide a lightweight, deterministic validation API to detect common model inconsistencies before persisting or serving data. The validation API helps keep saved JSON-LD stable and reduces noisy diffs by detecting issues early in the pipeline.

# Specification

API

- validate()
  - Runs a set of deterministic checks against the in-memory model and returns a result object of the shape:
    - valid: boolean
    - issues: array of issue objects where each issue includes { level: "error" | "warning", code: string, message: string, context?: object }
  - Does not throw on non-fatal issues; it reports them via the issues array. Fatal problems (for example, inability to write persistence files during save) are surfaced by save/load as appropriate.

Checks performed (minimum set)

- Missing class references: properties that reference domain or range classes that are not defined.
- Individual-type consistency: individuals assigned to undefined classes.
- Duplicate IDs: individuals with the same id within the same class.
- Broken references: property values that reference individual ids that do not exist.
- Context sanity: saved JSON-LD context keys are present and do not contain unexpected top-level values.

Behavior

- validate is fast and deterministic given the same in-memory state.
- save(dir, { validate: true }) runs validate and fails the save if any issues with level error are reported.

# MODEL_VERSIONING AND MIGRATION

# Summary

Provide a minimal model versioning and migration contract so seed data and persisted JSON-LD can evolve across transform cycles without introducing noisy diffs or requiring human intervention for simple, well-scoped changes.

# Motivation

The mission requires the pipeline to populate example ontology data over successive transform cycles. As the library evolves, the persisted format, context, or canonical file layout may need small, deterministic migrations. A versioning and migration contract lets the repository evolve the seed data while providing repeatable automated transforms.

# Specification

- modelVersion semantics
  - Each saved dataset should include a modelVersion identifier (string or semver-style) either at the file-level or as part of a manifest.json in the data dir.
  - The library's current model version is available as getModelVersion() and save may accept an explicit version via opts.version.

- Migration API
  - Expose a migrate(summaryOrFiles, targetVersion) helper that accepts either a loaded summary or the path to an on-disk dataset and returns an object { migrated: boolean, summary: object, actions: [] } describing the actions taken.
  - Built-in migrations should be small, deterministic functions that transform the on-disk JSON objects (for example: rename a property key, move a property from file A to file B, normalise context prefixes).
  - Migrations MUST be idempotent (reapplying the same migration produces no further changes) and deterministic.
  - For complex migrations that cannot be performed automatically, migrate should surface a plan that includes human-review recommendations rather than failing silently.

- Manifest and atomic writes
  - When performing migrations or save operations that update many files, the library should write to a temporary directory and then atomically rename or write a manifest to indicate completion, to avoid half-written datasets being consumed by other processes.

# Acceptance Criteria (versioning)

- save writes a modelVersion marker in the saved dataset when opts.version is provided or when the library has a non-empty current model version.
- load detects modelVersion mismatches and returns a summary that includes a migrationRequired boolean and suggestedActions array when versions differ.
- migrate(tempDirPath, targetVersion) can automatically perform at least one non-trivial deterministic migration in tests (for example: rename property hasOldName -> hasNewName across saved class files) and reports migrated: true and a concise actions list.
- Unit tests demonstrate a migration round-trip: create an old-format dataset, run migrate to targetVersion, load the migrated dataset, and assert stats and validate() pass against the migrated model.
- Migrations are idempotent: running migrate twice has no further effect and the second run reports migrated: false.

# Acceptance Criteria (persistence, repeated)

- validate is exported as a named function from src/lib/main.js.
- validate returns { valid: true, issues: [] } for a known-good seeded model (for example the deterministic animal taxonomy provided by SEED_DATA).
- validate returns a non-empty issues array when a model contains one of the checked problems (for example an individual referencing a non-existent class).
- When save is invoked with opts.validate true on an invalid model, save rejects or throws a descriptive error and does not write files.
- Calling save(dir) when N classes, M properties, and K individuals are present produces a context.jsonld and one Class-{kebab}.jsonld file per class under dir.
- All files produced by save parse as JSON and include an @context key.
- Calling load(dir) on the saved output restores the same counts for classes, properties, and individuals as reported by stats().
- A round-trip unit test defines two classes, one property, and two individuals, calls save(tempDir), loads the data into a fresh model using load(tempDir), and asserts that stats() match the original values.
- save returns a summary that matches stats() and lists files written; load returns a summary that lists files read and any per-file errors.

# Testing Recommendations (repeated)

- Add tests in tests/unit/persistence.test.js that perform the round-trip save/load and assert file existence and content keys.
- Add tests in tests/unit/versioning.test.js that create a small old-format dataset, run migrate to the new version, and assert the migrated dataset loads and validates.
- Add tests in tests/unit/canonicalization.test.js that verify canonicalise behaviour and bit-for-bit identical outputs when opts.canonicalize is used.
- Use a temporary directory for each test and clean up artifacts after assertions complete.
- Keep file naming deterministic (Class-{kebab}.jsonld) to make existence assertions stable.

# Implementation Notes (repeated)

- Export save, load, validate, migrate, getContext, setContext, getModelVersion and canonicalize as named exports from src/lib/main.js to satisfy the public API requirement.
- Prefer one-file-per-class layout for ease of incremental writes; support a single graph.jsonld as a convenience for imports.
- Maintain a minimal, stable @context to reduce unrelated diffs in example data across transform cycles.
- Implement canonicalization as a small, testable module that uses a standard algorithm (URDNA2015) when available and otherwise falls back to a deterministic hashing strategy for blank nodes and stable key ordering.
- Implement migrations as small pure functions that transform loaded JSON objects and emit an actions list describing their changes; keep migrations local to the library to enable automated pipeline transforms.

# Related features

- SEED_DATA should use the persistence API to write example ontology into data/ during pipeline runs so documentation and website examples are populated automatically.
- CONTEXT management responsibilities are part of the persistence contract and should be verified by persistence tests.

# Implementation

- Status: Implemented in src/lib/main.js. The library exports save(), load(), validate(), migrate(), getContext(), setContext(), getModelVersion() and a canonicalize() helper via the default ontology wrappers.
- Behaviour implemented: save(dir) writes context.jsonld and Class-{kebab}.jsonld files for each class when run under Node; load(dir) reads JSON-LD files and restores classes/properties/individuals. validate() reports errors for unknown domains/ranges and unknown classes; migrate() supports a basic modelVersion set operation and reports actions.
- Canonicalisation: A canonicalization contract is specified; implementations should prefer URDNA2015 if the environment provides it and otherwise ensure deterministic fallback behaviour. Tests should verify bit-for-bit identity when opts.canonicalize is used.
- Notes: Persistence writes stable JSON (stringifySorted) and avoids non-deterministic metadata. Migration facility is minimal but present and can be extended to run deterministic transformations in future cycles.
- Tests: tests/unit/persistence.test.js, tests/unit/versioning.test.js and tests/unit/canonicalization.test.js are recommended to exercise round-trip save/load, migrate and canonicalization behaviours; ensure temporary directories are used to isolate test runs.