# SEED_DATA

# Summary

Provide a deterministic, programmatic seed generator for the repository that builds a minimal example ontology (animal taxonomy) using the public library API and persists it to disk as JSON-LD. The seed generator must be usable programmatically and via the CLI and website build so example data is always reproducible across transform cycles.

# Motivation

Seed data demonstrates the library in action, powers the website demo, and enables reproducible unit and behaviour tests. Making seed generation a testable, exported API reduces duplication, makes CI deterministic, and enables automated data upgrades via migrations.

# Specification

Behavior

- Expose a named function seedOntology(dir?, opts?) exported from src/lib/main.js (or a small module re-exported by src/lib/main.js).
- The seed function uses defineClass, defineProperty, and addIndividual to build a small example ontology including at minimum: classes Animal and Mammal (Mammal subclass of Animal), a property hasName linking individuals to a literal, and at least two individuals (for example dog1, cat1).
- seedOntology writes persisted JSON-LD files using the persistence API (save) into dir (defaults to data/). When running under Node, files are written; in browser environments the function returns the intended file manifest and summaries without performing filesystem writes.
- The seed output must be deterministic and idempotent: repeated runs with the same target dir produce identical file contents (no timestamps or non-deterministic metadata).
- The CLI command seed should delegate to seedOntology so the same code path is used for programmatic and command-line seeding.

API

- seedOntology(dir?: string, opts?: object) -> Promise<summary>
  - dir defaults to data/ when not provided.
  - opts may include: { overwrite: boolean } to control overwriting an existing dataset and { version?: string } to write modelVersion in output.
  - The returned summary includes at minimum: { ok: boolean, filesWritten: string[], counts: { classes, properties, individuals }, errors?: [] }

Determinism and format requirements

- Files must be valid JSON-LD and include an @context or reference context.jsonld in the same dir.
- File ordering and JSON serialisation must be stable (canonical key ordering) to avoid noisy diffs across runs.
- Seed data should include a modelVersion marker so migrations can be applied in later cycles.

Idempotence and safety

- By default seedOntology should be idempotent: running it multiple times without opts.overwrite should be a no-op if the existing dataset matches the canonical seed (returns ok: true and filesWritten: []).
- When opts.overwrite is true the seed should replace the target dataset atomically (write to a temporary directory and rename or write a manifest to indicate completion).

# Acceptance Criteria

- A named export seedOntology is available from src/lib/main.js and is documented in README with usage examples.
- The CLI seed command uses seedOntology rather than containing an independent seed sequence.
- Running seedOntology into a temporary directory produces a deterministic set of JSON-LD files: a context.jsonld and one Class-{kebab-case}.jsonld per class, plus any manifest or modelVersion markers when opts.version is provided.
- Unit test tests/unit/seed.test.js programmatically calls seedOntology(tempDir) and asserts:
  - The summary.ok is true and filesWritten list matches expected file names.
  - The saved files parse as JSON and contain an @context.
  - stats() loaded from the saved dataset equals expected { classes: >=2, properties: >=1, individuals: >=2 } and matches a load(tempDir) round-trip.
  - Running seedOntology(tempDir) a second time without opts.overwrite results in no changes (filesWritten empty or unchanged checksums).
- The website build (src/web/) can load data/ after seeding and the demo UI shows at least the seeded classes and individuals; an integration test or behaviour test should exercise the website loading of the seeded dataset.

# Testing recommendations

- Implement tests/unit/seed.test.js that use mkdtempSync to create a temporary directory; run seedOntology(dir); assert files exist and load correctly using load(dir); then run seedOntology(dir) again and assert idempotence.
- Add a small behaviour test that seeds into a test fixtures directory used by the web demo, runs the site build step (or the web loader function) and asserts the page lists seeded classes and individuals. Mark web test as optional in CI if environment lacks headless browser dependencies.
- Where possible compute a stable checksum of written files (for example canonical JSON string) to assert determinism rather than relying on file timestamps.

# Implementation notes

- Implement the canonical seed sequence as a small module (for example src/seed/index.js) that imports the public library API. Re-export seedOntology from src/lib/main.js so single public entrypoint exists.
- Avoid embedding timestamps or machine-specific metadata in seed output. Use stable serialization and sorted keys when writing JSON-LD files.
- Implement atomic writes by writing to a temporary directory and moving or writing a manifest; this prevents partially written datasets being consumed by other processes.
- Use the persistence API save(dir, { validate: true, version: opts.version }) to ensure saved seed data validates cleanly.
- Ensure the CLI handler for seed invokes the same seedOntology(dir, opts) function and prints the returned summary as machine-friendly JSON when invoked with --quiet.

# Related features

- PERSISTENCE (save/load, validate, modelVersion)
- DEFINE_CLASS
- DEFINE_PROPERTY
- INDIVIDUAL_MANAGEMENT
- CLI (seed command should delegate to this feature)

# Status

- PARTIALLY_IMPLEMENTED: a seed sequence exists in the codebase and the CLI exposes a seed command, but the repository does not currently export a reusable seedOntology function and lacks deterministic idempotent guarantees and unit tests verifying idempotence. This feature spec formalises what is required to complete and test the seed generator.

# Migration guidance

- If existing seed logic is embedded in the CLI handler, extract it into a small module and re-export it as seedOntology from src/lib/main.js; add unit tests against the extracted module before changing CLI behavior.

# Acceptance checklist (for reviewers)

- seedOntology exported and documented
- seed writes deterministic JSON-LD with @context and modelVersion marker
- seed is idempotent by default; overwrite option exists
- tests/unit/seed.test.js added and passing
- CLI seed command delegates to seedOntology
- Web demo loads seeded dataset successfully
