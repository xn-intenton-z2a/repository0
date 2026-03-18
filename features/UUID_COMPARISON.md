# UUID_COMPARISON

Status: Done

Overview

Generator script examples/generate-uuid-comparison.js should emit a deterministic markdown comparison table of encoded UUIDs for a set of sample UUIDs and all registered encodings. The table is used by README/docs and CI tests.

Acceptance criteria

1. examples/generate-uuid-comparison.js exists and when run with --stdout prints a valid markdown table whose header matches listEncodings() ordered by bitsPerChar descending.
2. Each cell equals encodeUUIDShorthand(sampleUuid, encodingName) and the displayed length equals the encoded string length; unit tests compare live API outputs to the generated table.
3. Output is deterministic across runs with identical inputs and registry state.

Implementation notes

Keep the script dependency-free and use Node built-ins only; prefer --stdout in tests to avoid filesystem writes.
