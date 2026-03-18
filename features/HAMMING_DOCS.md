# HAMMING_DOCS

Status: PARTIALLY_IMPLEMENTED

Purpose
Maintain authoritative documentation that explains API usage, Unicode considerations, BigInt behaviour, optional normalization, and CLI examples so consumers can use the library correctly.

Scope
- README.md must contain canonical examples for hammingDistanceString and hammingDistanceInt (including BigInt examples) and a small CLI usage section for --version and --identity and subcommands string and bits.
- Document Unicode normalization behaviour and an opt-in normalize option for string comparisons.
- Provide a small examples/benchmark.js script for local benchmarking; the benchmark is optional but documented.

Unicode normalization behaviour
- Default comparison compares code points without automatic normalization.
- Provide an opt-in parameter to normalize both inputs using NFC before comparing; document trade-offs and examples.

Acceptance Criteria
- README.md contains an API examples section showing the canonical vectors: karolin vs kathrin => 3; empty vs empty => 0; and integer example 1 vs 4 => 2; BigInt example 1n vs 4n => 2
- README documents CLI usage for --version and --identity and demonstrates string and bits subcommands with expected outputs
- README documents that normalization is opt-in and shows a short example comparing composed and decomposed e-acute variants
- examples/benchmark.js exists and prints labelled timing lines when run with node examples/benchmark.js
- JSDoc and README document the optional normalize parameter and its default (disabled)

Notes
- Keep documentation concise and avoid duplicating test vectors across multiple files; link to tests where appropriate.
