# PERSISTENCE

# Summary

Provide a stable JSON-LD persistence feature for the ontology library. Implement save(dir?) and load(dir?) semantics that persist the in-memory model to disk and restore it, using a deterministic, testable file layout under the data/ directory by default.

# Motivation

Persisting the ontology as JSON-LD enables long-term storage, reproducible example data for the website, and reliable transform cycles required by the mission. A canonical on-disk layout simplifies unit tests and example generation.

# Specification

API

- save(dir?)
  - Writes an on-disk representation of the current ontology into dir (defaults to data/).
  - Creates a context file named context.jsonld at dir/ containing the shared JSON-LD context.
  - For each defined class, creates a file named Class-{kebab-case-classname}.jsonld containing a JSON-LD graph that includes the class declaration, relevant property definitions, and the individuals belonging to that class.
  - Returns a summary object describing counts of classes, properties, and individuals and a list of files written.

- load(dir?)
  - Loads JSON-LD files from dir (defaults to data/) and restores classes, properties, and individuals into the in-memory model.
  - Supports both the one-file-per-class layout and a single graph file named graph.jsonld if present.
  - Returns a summary object describing counts and a list of files read, plus a details array for any per-file parse or validation errors.

File format

- All produced files are valid JSON-LD and include an @context that matches or references context.jsonld.
- Individuals reference their class using the same short names or IRIs as used by the model so load can resolve references deterministically.

Error handling

- save should create dir if it does not exist and report a descriptive error if writing fails.
- load should attempt to process all files and return per-file errors rather than aborting on the first parse failure; the returned summary includes a details array with file-level errors.

# Acceptance Criteria

- Calling save(dir) when N classes, M properties, and K individuals are present produces a context.jsonld and one Class-{kebab}.jsonld file per class under dir.
- All files produced by save parse as JSON and include an @context key.
- Calling load(dir) on the saved output restores the same counts for classes, properties, and individuals as reported by stats().
- A round-trip unit test defines two classes, one property, and two individuals, calls save(tempDir), loads the data into a fresh model using load(tempDir), and asserts that stats() match the original values.
- save returns a summary that matches stats() and lists files written; load returns a summary that lists files read and any per-file errors.

# Testing Recommendations

- Add tests in tests/unit/persistence.test.js that perform the round-trip save/load and assert file existence and content keys.
- Use a temporary directory for each test and clean up artifacts after assertions complete.
- Keep file naming deterministic (Class-{kebab}.jsonld) to make existence assertions stable.

# Implementation Notes

- Export save and load as named exports from src/lib/main.js to satisfy the public API requirement.
- Prefer one-file-per-class layout for ease of incremental writes; support a single graph.jsonld as a convenience for imports.
- Maintain a minimal, stable @context to reduce unrelated diffs in example data across transform cycles.

# Related features

- SEED_DATA should use the persistence API to write example ontology into data/ during pipeline runs so documentation and website examples are populated automatically.
