# VALIDATION_ERRORS

# Summary

Improve cron expression validation by introducing structured, testable error types and clearer messages. Parsing errors should include the field name, offending token, and a short error code to make programmatic handling and tests straightforward. In addition, provide and export a machine-readable JSON Schema for the parsed cron object so callers and tests can validate the parser's output structure.

# Motivation

Users and calling programs need precise, machine-readable feedback when an expression is invalid so they can show helpful UI messages or bail out early. Tests also benefit from stable error codes instead of matching free-form strings. A published JSON Schema for the parsed representation enables quick integration with validators, typed documentation, and deterministic tests that assert structure as well as values.

# Specification

1. Error Types
   - Export a CronSyntaxError class from the library. The error object must include at least these properties:
     - code: a short uppercase token (e.g., INVALID_FIELD, INVALID_RANGE, UNEXPECTED_TOKEN, INVALID_STEP)
     - field: one of seconds|min|hour|day|month|weekday or special for shortcuts
     - message: human readable description
     - token?: the substring that caused the error (when applicable)
   - CronSyntaxError must be a proper Error subclass so it can be caught via instanceof.

2. Behaviour
   - parseCron(expression) performs strict validation and throws CronSyntaxError for invalid input.
   - nextRun/nextRuns/matches must validate the expression on entry and surface the same CronSyntaxError when appropriate.
   - Validation must detect common mistakes: out-of-range values (e.g., minute 60), malformed ranges (5--7), invalid step values (*/0), unknown special strings (e.g., @foo), and incorrect field count.

3. Parsed-cron JSON Schema
   - Provide and export a stable JSON Schema object PARSED_CRON_SCHEMA from the library (named export) describing the shape of parseCron output. The schema should cover:
     - top-level object with keys for fields: seconds (optional), minute, hour, dayOfMonth, month, dayOfWeek, and special (optional)
     - each field represented as an object containing:
       - original: the original token string for that field
       - values: array of integers representing the expanded set of values (e.g., [0,15,30,45])
       - type: one of 'wildcard', 'list', 'range', 'step', 'single'
     - special: when present contains the shortcut string (e.g., "@daily") and the expanded cron string
   - The schema must be concise and expressive so tests can assert parseCron output conforms to it without depending on ordering of properties.
   - The schema must be included in README examples and exported as PARSED_CRON_SCHEMA from src/lib/main.js so consumers can import and use it.

4. Tests
   - Unit tests assert parseCron throws CronSyntaxError for invalid expressions and inspect error.code and error.field.
   - Unit tests assert parseCron("*/15 * * * *") returns an object that validates against PARSED_CRON_SCHEMA.
   - Tests cover representative parsed objects for special shortcuts (e.g., @daily) and for 6-field expressions with seconds.
   - Tests for schema validity should use a lightweight in-test structural validator (no new dependency required — implement a small assertion helper) to avoid adding external packages.

5. Documentation
   - README section documents CronSyntaxError usage with a short code example showing try/catch and inspecting error.code and error.field.
   - README documents the PARSED_CRON_SCHEMA shape and shows an example of validating parseCron output against it.

# Acceptance Criteria

- parseCron("60 * * * *") throws CronSyntaxError with code INVALID_FIELD and field minute.
- parseCron("*@foo * * * *") throws CronSyntaxError with code UNEXPECTED_TOKEN.
- CronSyntaxError is an Error subclass and is exported by the library.
- PARSED_CRON_SCHEMA is exported by the library and describes the shape of parseCron output (fields: seconds?, minute, hour, dayOfMonth, month, dayOfWeek, special?).
- Unit tests validate that parseCron("*/15 * * * *") conforms to PARSED_CRON_SCHEMA and that special strings produce schema-compliant parsed objects.
- README updated with examples for catching CronSyntaxError and validating parseCron output against PARSED_CRON_SCHEMA.

# Implementation notes

- Keep changes local to src/lib/main.js and tests. Export CronSyntaxError and PARSED_CRON_SCHEMA as named exports alongside existing functions.
- Avoid adding runtime dependencies: implement a small schema-check helper in tests instead of adding a JSON Schema validator dependency.
- Ensure the schema remains stable across minor parser refactors; only change schema with a documented migration note.

# Testable outcomes

- Clear, programmatic error handling for invalid cron expressions in library APIs.
- A stable, testable description of parsed cron objects enabling consumers and tests to validate parser output reliably.

# Notes

This feature complements the existing validation improvements by making the output structure first-class and testable without adding external validation dependencies. It remains achievable within a single repository and requires only additions to src/lib/main.js, tests/unit, and README as specified.
