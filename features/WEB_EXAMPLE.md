# WEB_EXAMPLE

Summary

Provide a small, self-contained web example page and a companion CLI usage specification that demonstrates the library loading JSON-LD from data/, rendering basic stats, listing classes and individuals, and running two common queries via a minimal client-side UI under src/web/, and a lightweight CLI under src/cli/ to run queries and export results. The example should be easy to run with the repository's existing build/start scripts and be usable as both a documentation artifact and a manual test harness for the library.

Rationale

The mission requires the library to be demonstrable both in-browser and from the command line so authors and CI systems can verify behaviour. A small web UI helps human users explore the graph interactively; a CLI helps automation, reproducible queries in CI, and makes start:cli useful for quick inspection.

Design

- Location: the web example lives conceptually at src/web/examples/ontology-demo.html and its JS helper at src/web/examples/ontology-demo.js. The CLI helper is a tiny executable module under src/cli/query.js (the feature spec documents what to add; no files are created by this spec).
- Behaviour (web): the page imports the library from src/lib/main.js as an ES module, calls load() against the repository data/ directory (or loads the provided example JSON-LD graph), then renders:
  - stats(): counts of classes, properties, individuals
  - A class list with expandable individuals showing id and property values
  - A simple query form with two examples: findInstances(ClassName) and findByProperty(propertyName, value)
  - Results area that displays matched individuals as JSON-friendly objects
- Behaviour (CLI): the CLI script imports the same library, accepts arguments to run either:
  - stats  -> prints JSON { classes: N, properties: M, individuals: K }
  - findInstances <ClassName> -> prints JSON array of individuals
  - findByProperty <propertyName> <value> -> prints JSON array of matching individuals
  The CLI should load data/ by default and accept a --data <dir> option.
- API contract: the example and CLI expect the library to export named functions: defineClass, defineProperty, addIndividual, query, findInstances, findByProperty, load, save, stats. The web example uses load, stats, findInstances, and findByProperty; the CLI uses load, stats, findInstances and findByProperty.
- UX: web UI is minimal with three sections: Overview (stats), Classes (list), Query (form + results). CLI prints machine-readable JSON and sets exit code 0 on success, non-zero on errors.
- Data: the example and CLI use the existing animal seed under data/ (animals taxonomy) and must work if that seed is present.

Implementation guidance

- Keep browser code dependency-free (vanilla JS) so build:web can copy it directly into docs/.
- The CLI entry module should be CommonJS-compatible or have a tiny runner under package.json scripts (start:cli already exists and may be used to invoke node src/lib/main.js; prefer adding a lightweight src/cli/query.js that can be executed by node).
- Ensure consistent JSON shapes between web helper and CLI to make automated checks simple.

Tests

- Unit test for the web example: import the example helper module (or the exported helper function), run its runExample() function in Node (mocking DOM is not required; the helper should expose a run() that returns an object with keys: stats, classes, queries) and assert the returned object contains expected keys and values for the animal seed.
- Unit test for the CLI: require the CLI module and invoke its main function programmatically with a mocked argv, asserting it returns the expected JSON (or writes to a provided output stream). Tests should verify findInstances('Dog') returns Fido and findByProperty('hasColor','brown') returns Fido.
- Integration test suggestion: npm run build:web then open docs/examples/ontology-demo.html in a headless Playwright test to assert the stats area contains the expected counts (optional).

Acceptance Criteria

- README updated to document both the web example and the CLI usage with examples for stats, findInstances, and findByProperty.
- The web example can be implemented using a single JS/HTML pair under src/web/ and requires no build changes to be served by npm run start.
- The CLI module accepts the commands and prints JSON output; it is callable via node src/cli/query.js or via the existing start:cli script when wired.
- Unit tests exist for both the web helper and the CLI and assert the example run helper returns an object with stats, classes and queries keys and that CLI findInstances('Dog') returns Fido and findByProperty('hasColor','brown') returns Fido.
- The example and CLI work with the existing animal seed data in data/ and are documented in README.
