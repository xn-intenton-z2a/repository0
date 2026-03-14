# SEED_DATA

# Summary

Provide a deterministic, idempotent seed generator that builds a canonical example ontology (an animal taxonomy) using the public library API and persists it as JSON-LD into the data/ directory. The seed function must be usable programmatically, via the CLI, and from the web demo (browser-friendly mode) and must produce stable, testable output suitable for CI and automated transforms.

# Motivation

Seed data demonstrates the library in action, powers the website demo, and provides repeatable fixtures for unit and behaviour tests. Making the seed generator deterministic and idempotent reduces noisy diffs across transform cycles and enables automated migrations and dataset diffs.

# Specification

API

- seedOntology(dir?: string, opts?: object) -> Promise<summary>
  - dir defaults to data/ when not provided.
  - opts may include:
    - overwrite: boolean (default false) — when true, overwrite target dataset atomically.
    - version: string — optional modelVersion to record in the saved dataset.
    - canonicalize: boolean (default true) — instruct save to canonicalize outputs for deterministic files.
  - The returned summary is an object: { ok: boolean, counts: { classes, properties, individuals }, filesWritten: string[], errors?: [] }

Behavior

- seedOntology constructs the ontology using defineClass, defineProperty and addIndividual and then persists the model using the existing persistence API (save) so the same persistence contract is used by seed and other writers.
- When running under Node the function writes files to disk; when running in a browser environment the function returns the intended file manifest and file contents without performing filesystem writes.
- The seed sequence must be deterministic: given the same version and options the produced file contents are identical across runs (canonical ordering, stable ids, no timestamps or machine-specific metadata).
- By default seedOntology is idempotent: if the target dir already contains an identical canonical dataset, seedOntology returns ok: true and filesWritten: [] (no writes). When overwrite: true the dataset is replaced atomically.
- Atomic writes: when overwrite is true or when creating a new dataset seedOntology writes into a temporary directory and then atomically moves or writes a final manifest to indicate completion to avoid partial datasets.

Seed contents

- The canonical seed must include at minimum:
  - Classes: Animal, Mammal (Mammal rdfs:subClassOf Animal)
  - Properties: hasName (domain: Animal, range: literal)
  - Individuals: at least two individuals (for example dog1 of class Mammal and cat1 of class Mammal or Animal) with literal properties demonstrating property values and at least one reference property if relevant
  - context.jsonld: a deterministic JSON-LD context file at the data root defining prefixes used by the seed files
  - modelVersion marker: written into either a manifest.json or included in saved files when opts.version provided

Idempotence and determinism rules

- Deterministic id generation: when seed requires generating ids, use stable, human-readable ids (for example dog1, cat1) or deterministic algorithms seeded by the provided opts.version rather than random UUIDs.
- No timestamps or environment-specific metadata are embedded in files written by seedOntology.
- When canonicalize is true the save() call is invoked with canonicalize enabled so blank nodes, ordering, and key sorting are deterministic.

CLI and web integration

- The CLI seed command must delegate directly to seedOntology so the same codepath is used for CLI and programmatic usage.
- The web demo must call seedOntology in browser-friendly mode: generate the same in-memory model and return a file manifest and contents for download instead of attempting filesystem writes.

Acceptance Criteria

- A named export seedOntology is available from src/lib/main.js and documented in README with usage examples.
- Running seedOntology into a temporary directory produces a deterministic set of JSON-LD files: context.jsonld and one Class-{kebab-case}.jsonld per class, plus an optional manifest or modelVersion marker when opts.version is provided.
- Unit test tests/unit/seed.test.js programmatically calls seedOntology(tempDir) and asserts:
  - summary.ok is true and counts reflect at least 2 classes, 1 property and 2 individuals
  - filesWritten lists expected file names and those files parse as JSON and contain an @context
  - Running seedOntology(tempDir) a second time without opts.overwrite results in no changes (filesWritten empty or identical checksums)
- The CLI seed command prints the summary as machine-friendly JSON when invoked with --quiet and uses exit codes to indicate success/failure.
- The web demo can obtain the seed manifest and display seeded classes and individuals without filesystem writes; a behaviour-level test demonstrates the UI showing the seeded classes and at least the seeded individuals.

Testing Recommendations

- Unit test: tests/unit/seed.test.js
  - Use mkdtempSync to create a temporary directory, run seedOntology(dir, { version: '0.1.0' }), assert files exist and saved counts match expected values, load the saved dataset with load(dir) and assert stats() match.
  - Run seedOntology(dir) again and assert idempotence by comparing file contents or checksums.

- Integration test: tests/behaviour/seed-web.spec.js (Playwright optional)
  - Start the demo in a predictable environment, call the web adapter's seed function, and assert the UI lists Animal and Mammal and shows the seeded individuals. Mark these tests optional in CI where browsers are unavailable.

- Edge case tests:
  - Test overwrite: run seedOntology(dir) then seedOntology(dir, { overwrite: true }) and assert files are replaced but final load(dir) yields the same stats.
  - Test browser mode: call seedOntology with a browser flag or simulated non-Node environment and assert no writes occur and a manifest with file contents is returned.

Implementation Notes

- Implement the canonical seed generator as a small module that imports the public library API and returns a single exported function seedOntology; re-export it from src/lib/main.js to keep a single public surface.
- Use save(dir, { canonicalize: true, validate: true, version: opts.version }) to persist files and leverage existing persistence and validation code paths.
- Ensure seedOntology does not depend on external network resources and that all required IRIs and prefixes are local to the repo to keep the seed self-contained.
- Keep the seed code small and declarative: construct class and property declarations then add individuals with fixed ids and property values; avoid runtime-randomness.

# Status

- Status: PARTIALLY_IMPLEMENTED — seed logic exists in the repository but must be refactored into a reusable seedOntology export, be made idempotent and canonical, and covered with the unit tests described above.
