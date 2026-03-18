# HAMMING_WEB_UI

Status: ARCHIVED (implemented; web demo deployed in src/web/)

Purpose
Provide a minimal interactive web demo that exercises the library and demonstrates core vectors so users can visually verify behaviour and copy example inputs.

Scope
- The demo is located under src/web/ and consumes the library built for the browser.
- The page displays example results for several preset inputs and exposes simple interactive controls for ad-hoc inputs.
- Demo result element ids used by tests: hamming-string-result, hamming-int-result, hamming-bigint-result, hamming-mix-result, hamming-large-result, hamming-unicode-result

Acceptance Criteria
- The web demo computes and displays the example values: karolin vs kathrin => 3; 1 vs 4 => 2; 0n vs 3n => 2
- The demo exposes at least minimal interactive controls to enter two strings and two integers and shows computed results
- Behaviour tests assert demo renders and shows expected computed values for the canonical vectors

Notes
- Keep the demo focused on demonstration and not full-featured configuration; link to README for authoritative usage examples.
