# COMPARISON_ANALYSIS

Summary

Provide programmatic and human-readable comparison and benchmark tools that evaluate encoding density, correctness and performance across all available encodings. This feature surfaces the shortest printable representations for a v7 UUID, compares them against base64, and returns structured data for display in the website demo and CLI.

Motivation

Demonstrate and validate the library's core mission by producing objective, reproducible comparisons and metrics that show which encodings produce the shortest UUID and how close they approach theoretical density.

Scope

- Implement compareEncodings(buffer) returning an array of results with encoded string, length, bitsPerChar, charsetSize, efficiency, timing, and encoding name.
- Implement benchmarkUUID(uuid) returning per-encoding results for the UUID and a highlighted shortest result.
- Implement getEncodingStats(name) returning theoretical and measured stats for a named encoding.
- Ensure results are consumable by src/web/ demo and the CLI entrypoint.

Public API

- compareEncodings(buffer)
- benchmarkUUID(uuid)
- getEncodingStats(name)

Acceptance criteria

- compareEncodings accepts arbitrary binary buffers and returns structured per-encoding results including encoded string and metrics.
- benchmarkUUID returns results for every registered encoding and indicates the shortest encoding by length.
- getEncodingStats returns theoretical bitsPerChar and measured bitsPerChar for sample inputs.
- All returned data is JSON-serializable and suitable for display in src/web/ and CLI.
- Unit tests cover empty buffer, single byte, all-zero, all-0xFF, and a canonical UUID, asserting round-trip decode correctness and length comparisons against base64.
- Integration test ensures the web demo and CLI can call benchmarkUUID and display the shortest result.

Notes

Keep implementation small and deterministic; measurements should run fast enough for unit tests and the demo page.
