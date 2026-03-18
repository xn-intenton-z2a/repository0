# ENCODINGS_BENCHMARK

Status: Planned

Overview

Measure encoding density and runtime performance (encode/decode) across all registered encodings to inform design choices and document trade-offs.

Goals

- Provide a reproducible Node script examples/benchmark-encodings.js that benchmarks encode and decode throughput for several payload sizes and reports encoded-length statistics for UUID-sized inputs.
- Produce machine-readable JSON output suitable for CI assertions and human-readable summaries for docs.

Requirements

- Script path: examples/benchmark-encodings.js
- CLI flags: --sizes (comma-separated sizes in bytes, default: 1,16,1024,16384), --samples (number of repetitions per size, default 100), --json (emit JSON), --stdout (print to stdout)
- Output JSON schema: { runId: string, timestamp: ISO, settings: {...}, encodings: [ { name, charsetSize, bitsPerChar, samples: [{size, encodeMeanMs, decodeMeanMs, encodeStdMs, decodeStdMs}] , uuidSamples: [{uuid, encoded, len}] } ] }

Acceptance criteria (testable)

1. Node script examples/benchmark-encodings.js exists and exits 0 when invoked with --json; stdout is valid JSON parseable by JSON.parse.
2. The JSON contains an encodings array whose length equals listEncodings().length and contains entries with numeric fields encodeMeanMs and decodeMeanMs for each requested size.
3. For the standard sample UUIDs (sample canonical UUID, all-zero, all-0xFF), the script reports encoded lengths and at least one encoding with length < 22 characters (verify densest encodings meet mission density requirement).
4. The script runs without third-party deps (Node built-ins only) and completes within a reasonable time in CI for default sample counts (e.g., < 30s on CI runners with default samples reduced if necessary).

Implementation notes

- Use performance.now() or process.hrtime.bigint() for timing; discard first N warmup runs.
- Keep sample counts configurable so CI can run a quick smoke (samples=10) while local runs may be higher.
- The script must use the public library API (import { listEncodings, encode, decode, encodeUUIDShorthand } from '../../src/lib/main.js') so results reflect the live registry.

Rationale

Benchmarks clarify real-world trade-offs between density and CPU cost, and provide CI-assertable metrics to avoid regressions in future encoding implementations.
