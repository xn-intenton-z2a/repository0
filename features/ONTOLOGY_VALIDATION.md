# ONTOLOGY_VALIDATION

Summary

Add a validation feature that checks the in-memory ontology for structural consistency and simple semantic errors. The validation feature exposes a validate(options?) function that returns a validation report listing errors and warnings (missing class declarations, undeclared properties, domain/range violations, duplicate IDs, and malformed JSON-LD shapes). This allows library consumers, the CLI, and the web example to assert ontology quality before saving or publishing.

Rationale

A lightweight validator increases confidence in round-trip persistence and prevents common mistakes in seed or programmatic data creation. It complements existing persistence and query features by catching issues early and enabling tests that assert ontology correctness.

Design

- API: export a new named function validate({ severity?: 'error'|'warning'|'info' } = {}) from src/lib/main.js. It accepts an options object and returns an object: { valid: boolean, errors: [{ code, message, path, severity, hint }], warnings: [...] }.
- Checks performed:
  - Undefined class usage: an individual has rdf:type referring to a class that hasn't been declared with defineClass.
  - Undeclared property usage: a property used on an individual hasn't been declared with defineProperty.
  - Domain/Range inconsistency: a property assertion links individuals whose classes do not match declared domain/range (best-effort checks using direct class names and subclass relationships).
  - Duplicate individual IDs: same id used for two different individuals within the loaded graph.
  - JSON-LD shape validation: required JSON-LD keywords missing (e.g., @id for named resources), and property values with incorrect literal vs IRI shape where determinable.
- Behavior: validate runs synchronously against the current in-memory graph and performs best-effort reasoning over subclass edges. It does not perform full OWL reasoning (beyond direct subclass traversal).
- Errors vs Warnings: By default, missing classes or properties are errors; domain/range mismatches are warnings (configurable via options).

API Contract

- validate(options?): Promise<{ valid, errors, warnings }> or synchronous return (either is acceptable; prefer sync for simplicity and tests).
- Example result entry: { code: 'UNDECLARED_CLASS', message: 'Individual ex:Fido references undeclared class Dog', path: ['individuals','ex:Fido','rdf:type'], severity: 'error', hint: 'Call defineClass("Dog") before adding this individual.' }
- Integration points: the CLI and web example may call validate() before save() or when loading seeds to show user-facing diagnostics.

Tests

- Unit tests to cover each validation rule using the animal seed as baseline plus crafted malformed graphs:
  - Missing class: add an individual typed as UnknownClass and assert validate returns UNDECLARED_CLASS error.
  - Undeclared property: use property hasTail without defineProperty and assert UNDECLARED_PROPERTY.
  - Domain/Range: create a property eats declared with domain Bird and range Animal, then assert using it on Dog->Bird yields a DOMAIN_RANGE_WARNING (or error depending on options).
  - Duplicate IDs: add two individuals with same @id and assert DUPLICATE_ID error.
  - JSON-LD shape: an individual without @id should produce MALFORMED_NODE warning/error.
- Tests must assert validate().valid flag and presence of appropriate codes/messages.

Acceptance Criteria

- validate is exported as a named function from src/lib/main.js and callable programmatically.
- validate detects the listed error types and returns a structured report with codes and messages.
- Unit tests exist and cover at least one positive and one negative case for each check.
- README updated to mention validate() and a short example of using it before save().

Compatibility Notes

- The validator is intentionally lightweight — it performs best-effort checks suitable for small ontologies and is not a full OWL reasoner.
- Keep implementation restricted to src/lib/main.js so it can be realised in a single source file, and ensure the web example and CLI can import and call it without additional dependencies.
