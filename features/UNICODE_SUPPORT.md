# UNICODE_SUPPORT

Purpose

Describe optional Unicode and formatting behaviour for outputs. This feature ensures the library can be safely used in environments that handle Unicode strings and that outputs remain plain strings (not special objects).

Behavior

- All return values must be JavaScript strings containing ASCII or Unicode characters as appropriate.
- The library must not add non-printable control characters.
- When called in locales that display digits differently, the library still returns ASCII digits for numeric results.

Tests and Acceptance Criteria

- Calling fizzBuzzSingle for a non-substitution number (e.g. 7) returns the ASCII string "7" (no Unicode digit variants).
- Outputs contain only printable characters; tests confirm no control characters are present in results for fizzBuzz(20).
- Library usage in README examples must show plain string outputs (no special markup or escapes).

Notes

This feature documents expectations for string outputs and prevents subtle platform-dependent differences from creeping into test assertions.