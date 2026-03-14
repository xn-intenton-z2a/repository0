# PERSISTENCE

# Summary

Provide a stable JSON-LD persistence feature for the ontology library. Implement save(dir?) and load(dir?) semantics that persist the in-memory model to disk and restore it, using a deterministic, testable file layout under the data/ directory by default.

# Motivation

Persisting the ontology as JSON-LD enables long-term storage, reproducible example data for the website, and reliable transform cycles required by the mission. A canonical on-disk layout simplifies unit tests and example generation.

# Specification

API

- save(dir?, opts?)
  - Writes an on-disk representation of the current ontology into dir (defaults to data/).
  - Creates a context file named context.jsonld at dir/ containing the shared JSON-LD context.
  - For each defined class, creates a file named Class-{kebab-case-classname}.jsonld containing a JSON-LD graph that includes the class declaration, relevant property definitions, and the individuals belonging to that class.
  - If opts.validate is true, runs validate() before writing and fails with a descriptive error if validation issues are found.
  - Returns a summary object describing counts of classes, properties, and individuals and a list of files written.

- load(dir?)
  - Loads JSON-LD files from dir (defaults to data/) and restores classes, properties, and individuals into the in-memory model.
  - Supports both the one-file-per-class layout and a single graph file named graph.jsonld if present.
  - Returns a summary object describing counts and a list of files read, plus a details array for any per-file parse or validation errors.

File format

- All produced files are valid JSON-LD and include an @context that matches or references context.jsonld.
- Individuals reference their class using the same short names or IRIs as used by the model so load can resolve references deterministically.

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
  - Does not throw on non-fatal issues; it reports them via the issues array. Fatal problems (for example, inability to read persistence files during load) are surfaced by load/save as appropriate.

Checks performed (minimum set)

- Missing class references: properties that reference domain or range classes that are not defined.
- Individual-type consistency: individuals assigned to undefined classes.
- Duplicate IDs: individuals with the same id within the same class.
- Broken references: property values that reference individual ids that do not exist.
- Context sanity: saved JSON-LD context keys are present and do not contain unexpected top-level values.

Behavior

- validate is fast and deterministic given the same in-memory state.
- save(dir, { validate: true }) runs validate and fails the save if any issues with level error are reported.

# Acceptance Criteria (added)

- validate is exported as a named function from src/lib/main.js.
- validate returns { valid: true, issues: [] } for a known-good seeded model (for example the deterministic animal taxonomy provided by SEED_DATA).
- validate returns a non-empty issues array when a model contains one of the checked problems (for example an individual referencing a non-existent class).
- A unit test creates a small invalid model to demonstrate at least one error-level issue and asserts validate reports it; another test runs the seeded model and asserts validate reports valid: true.
- When save is invoked with opts.validate true on an invalid model, save rejects or throws a descriptive error and does not write files.

# Acceptance Criteria (persistence, repeated)

- Calling save(dir) when N classes, M properties, and K individuals are present produces a context.jsonld and one Class-{kebab}.jsonld file per class under dir.
- All files produced by save parse as JSON and include an @context key.
- Calling load(dir) on the saved output restores the same counts for classes, properties, and individuals as reported by stats().
- A round-trip unit test defines two classes, one property, and two individuals, calls save(tempDir), loads the data into a fresh model using load(tempDir), and asserts that stats() match the original values.
- save returns a summary that matches stats() and lists files written; load returns a summary that lists files read and any per-file errors.

# Testing Recommendations (repeated)

- Add tests in tests/unit/persistence.test.js that perform the round-trip save/load and assert file existence and content keys.
- Use a temporary directory for each test and clean up artifacts after assertions complete.
- Keep file naming deterministic (Class-{kebab}.jsonld) to make existence assertions stable.

# Implementation Notes (repeated)

- Export save and load as named exports from src/lib/main.js to satisfy the public API requirement.
- Prefer one-file-per-class layout for ease of incremental writes; support a single graph.jsonld as a convenience for imports.
- Maintain a minimal, stable @context to reduce unrelated diffs in example data across transform cycles.

# Related features

- SEED_DATA should use the persistence API to write example ontology into data/ during pipeline runs so documentation and website examples are populated automatically.
- CONTEXT management responsibilities are part of the persistence contract and should be verified by persistence tests.
