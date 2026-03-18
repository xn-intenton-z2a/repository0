# HAMMING_WEB_UI

Status: IMPLEMENTED

Purpose
Provide an interactive web demo that exercises the library in the browser so users can experiment with string and integer Hamming distances.

Scope
- src/web/index.html and src/web/lib.js wire the Hamming functions and display results for demo inputs.
- The page exposes demo result elements with ids: hamming-string-result, hamming-int-result, hamming-bigint-result, hamming-mix-result, hamming-large-result, hamming-unicode-result.
- The page also shows library identity and a mission-status area.

Acceptance Criteria
- src/web/index.html contains elements with ids hamming-mode (if present), hamming-input-a, hamming-input-b (optional for interactive controls) and hamming-result identifiers used by the demo.
- The demo computes and displays the example values ("karolin" vs "kathrin" => 3; 1 vs 4 => 2; 0n vs 3n => 2).
- Behaviour tests (tests/unit/web.test.js or tests/behaviour) assert the demo renders and shows the expected computed values.
