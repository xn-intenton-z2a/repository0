# WEB_EXAMPLE

Summary

Provide a small, self-contained web example page and usage specification that demonstrates the library loading JSON-LD from data/, rendering basic stats, listing classes and individuals, and running two common queries via a minimal client-side UI under src/web/. The example should be easy to run with the repository's existing build/start scripts and be usable as both a documentation artifact and a manual test harness for the library.

Rationale

The mission requires the library to be demonstrable in the website in src/web/. A lightweight web example makes it easier for consumers to explore the ontology interactively, supports manual verification of persistence and query features, and provides a simple smoke-test for CI when paired with the existing build:web script.

Design

- Location: specify the example lives conceptually at src/web/examples/ontology-demo.html (implementer chooses exact file placement in src/web/); the feature spec does not create files in src/web/ but documents what to add and how to wire it into the existing build process.
- Behaviour: the page loads the library from src/lib/main.js (ES module import), calls load() against the repository data/ directory (or loads the provided example JSON-LD graph), then renders:
  - stats(): counts of classes, properties, individuals
  - A class list with expandable individuals
  - A simple query form with two examples: findInstances(ClassName) and findByProperty(propertyName, value)
- API contract: the example expects the library to export named functions: defineClass, defineProperty, addIndividual, query, findInstances, findByProperty, load, save, stats. The example uses only load, stats, findInstances, and findByProperty.
- UX: minimal HTML UI with three sections: Overview (stats), Classes (list), Query (form + results). No styling required beyond basic readable layout.
- Data: the example should use the existing animal seed under data/ (animals taxonomy) and must work if that seed is present.

Tests

- Unit test to ensure example script can be imported and the exported example helper function runs without throwing. This test sits in tests/unit/ and imports the example helper (or, if the example is implemented as a module under src/web/, imports it as a module) and asserts that invoking its run() function returns an object with keys: stats, classes, queries.
- An end-to-end behaviour test (optional) may be added to playwright to load the built docs page and assert the stats text contains expected counts from the animal seed.

Acceptance Criteria

- Documentation in README updated to describe the example page's purpose and how to open it via npm run start (the build:web step will copy src/web into docs/ so start serves the docs).
- The example can be implemented using only a single new JS/HTML module under src/web/ and the repository build/start scripts require no changes to run it.
- A small unit test exists that imports the example module and asserts the example run helper returns an object with stats, classes and queries keys.
- The example works with the existing animal seed data in data/ and demonstrates findInstances('Dog') returning Fido and findByProperty('hasColor','brown') returning Fido.
