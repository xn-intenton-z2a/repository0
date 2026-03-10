# VALIDATION_ERRORS

# Summary

Improve cron expression validation by introducing structured, testable error types and clearer messages. Parsing errors should include the field name, offending token, and a short error code to make programmatic handling and tests straightforward.

# Motivation

Users and calling programs need precise, machine-readable feedback when an expression is invalid so they can show helpful UI messages or bail out early. Tests also benefit from stable error codes instead of matching free-form strings.

# Specification

1. Error Types
   - Introduce a CronSyntaxError class (or plain object shape) exported by the library. The error must include at least:
     - code: a short uppercase token (e.g., INVALID_FIELD, INVALID_RANGE, UNEXPECTED_TOKEN)
     - field: one of seconds|min|hour|day|month|weekday or special for shortcuts
     - message: human readable description
     - token?: the substring that caused the error

2. Behaviour
   - parseCron throws CronSyntaxError on invalid syntax instead of a generic Error.
   - nextRun/nextRuns/matches should validate expressions on entry and raise the same structured error when the expression is invalid.

3. Tests
   - Unit tests assert that invalid expressions throw CronSyntaxError and inspect code and field.
   - Tests cover common mistakes: out-of-range values, malformed ranges (5--7), invalid step values (*/0), and invalid special strings.

# Acceptance Criteria

- parseCron("60 * * * *") throws CronSyntaxError with code INVALID_FIELD and field minute.
- parseCron("*@foo * * * *") throws CronSyntaxError with code UNEXPECTED_TOKEN.
- Errors include token when available and have stable codes used by unit tests.
- README documents the error type and shows an example of catching and inspecting CronSyntaxError.