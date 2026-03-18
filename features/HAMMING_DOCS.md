# HAMMING_DOCS

Status: PARTIALLY_IMPLEMENTED

Purpose
Maintain repository documentation, README examples, and small companion scripts so library behaviour is discoverable and demonstrable. Add explicit documentation for Unicode normalization behavior and a simple benchmark script proposal.

Scope
- Update README.md to include:
  - Hamming distance API examples for strings and integers (including BigInt).
  - CLI usage examples for --version, --identity, string and bits subcommands.
  - A section describing Unicode normalization behavior and the optional normalize parameter and examples showing normalized vs non-normalized comparisons.
- Add an examples/benchmark.js script that measures and prints timings for hammingDistanceInt and (optionally) long-string hammingDistanceString runs.
- Keep docs concise and machine-friendly where appropriate.

Unicode normalization proposal
- Default behaviour remains comparing code points without normalization.
- Provide opt-in normalize option: hammingDistanceString(a, b, { normalize: true }) which applies NFC normalization to both inputs before comparison.

Acceptance Criteria
- README.md contains an API examples section showing:
  - hammingDistanceString("karolin", "kathrin") => 3
  - hammingDistanceInt(1, 4) => 2
  - BigInt example: hammingDistanceInt(1n, 4n) => 2
  - Example showing normalized vs non-normalized comparison for composed vs decomposed e acute.
- README documents CLI usage and expected outputs for --version and --identity and demonstrates string/bits subcommands.
- examples/benchmark.js exists, executes with node examples/benchmark.js, prints labelled timing lines such as: hammingDistanceInt, size=..., elapsedMs=...
- JSDoc and README document the optional normalize parameter and its default value.

Notes
- Keep docs authoritative and minimal; the web demo and tests should reference README examples.
