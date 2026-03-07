# DEMO_UI

# Feature name
DEMO_UI

# Summary
Provide an interactive demonstration interface for the dense encoding library that exposes encode/decode and UUID benchmarking through both a lightweight web demo (src/web/) and a CLI example. The demo should make the library's density advantages tangible: allow users to paste or upload binary/UUID inputs, select encodings (including custom encodings), and view encoded output, lengths, and comparisons side-by-side.

# Motivation
A discoverable, hands-on demo accelerates adoption and validates the mission by letting users see shortest-printable UUID results immediately. It supports library testing and manual verification (round-trip checks) and complements automated comparisons produced by compareEncodings and benchmarkUUID.

# Scope
- Add UI controls and examples in src/web/ to demonstrate encode/decode, encodeUUID/decodeUUID, listEncodings, and benchmarkUUID outputs. The web assets already present in src/web/ should be extended with a minimal interactive page where possible.
- Provide a small CLI subcommand or usage example in src/lib/main.js that can be run via npm run start:cli to encode/decode a UUID or raw hex, show encoding lengths, and assert round-trip correctness.
- Keep implementation self-contained: no new external dependencies beyond existing package.json.

# Public API surface demonstrated
- encode(buffer, encoding)
- decode(str, encoding)
- encodeUUID(uuid)
- decodeUUID(str)
- listEncodings()
- compareEncodings(buffer) (from comparison analysis)
- benchmarkUUID(uuid) (from comparison analysis)

# Web demo requirements
- Input: text area for hex/binary/UUID input and file upload for small binary files.
- Encoding selector: list built-in encodings and any custom encodings created at runtime.
- Output: show encoded string, length, bits/char, and a small visual comparison against base64 and other encodings.
- Round-trip action: a button to decode back and assert equality with original input, reporting success/failure.
- Example UUID mode: single-click example UUID that shows shortest encoding found by benchmarkUUID and a decode link that returns to canonical UUID.
- No server required: demo runs entirely as static JavaScript in src/web/ and uses the library entrypoint.

# CLI demo requirements
- A short usage printed when run with --help.
- Commands:
  - encode-uuid <uuid> [--encoding=name]  — prints encoded result and metadata
  - decode-uuid <str>  — prints canonical UUID or an error
  - compare-uuid <uuid>  — prints encodings for all available encodings with lengths and highlights the shortest
- Exit codes: 0 on success; non-zero on validation/decode errors.
- Should be runnable via npm run start:cli and use the module's exported functions.

# UX and portability constraints
- Avoid characters that break JSON, URLs, or common terminals in default web/CLI displays.
- Provide copy-to-clipboard buttons and a small permalink generator (client-side only) that encodes the demo state in the URL fragment.
- Keep UI lightweight (no heavy frameworks) and accessible.

# Tests and acceptance criteria
- Unit tests demonstrating round-trip from web/CLI example inputs using existing test harnesses.
- A new unit test can simulate CLI calls to node src/lib/main.js to assert expected stdout for sample inputs.

Acceptance criteria
- Demo page in src/web/ displays inputs and results for encode/decode and shows benchmarkUUID shortest result.
- CLI commands described above function using library exports and return meaningful exit codes.
- Both web and CLI demos use listEncodings() and show accurate encoding metadata.
- Documentation updated (README or docs) includes quick instructions to run the demo locally.

# Integration notes
- The demo should import and use the same named exports from src/lib/main.js so it exercises the actual library code paths and keeps coverage high.
- Keep implementation changes limited to src/web/ assets and the optional small CLI entry path already referenced by package.json start:cli.

# Backwards-compatibility
- No changes to existing encode/decode signatures; only add demonstration harnesses and lightweight glue.

# Original Comparison Analysis (preserved)

# Encoding Comparison and Analysis

Provide comprehensive comparison tools and analysis capabilities to evaluate encoding performance and demonstrate the library's density advantages.

## Overview

This feature adds analytical capabilities that help users understand the performance characteristics of different encodings and demonstrates the library's achievement in creating the shortest possible printable UUID representations.

## Analysis Functions

The main.js module must export these analysis functions:

- compareEncodings(buffer) — Return encoding results for all available encodings with length and efficiency metrics
- benchmarkUUID(uuid) — Specifically analyze UUID encoding across all available methods
- getEncodingStats(encoding) — Return detailed statistics about a specific encoding

## Comparison Metrics

For each encoding comparison, provide:
- Encoded string length
- Character count reduction compared to base64
- Bit density (bits per character)
- Character set size
- Encoding efficiency percentage
- Performance timing for encode/decode operations

## UUID Benchmark Results

The benchmarkUUID function must demonstrate that the library achieves its core mission by:
- Showing UUID representations in all available encodings
- Highlighting the shortest representation achieved
- Comparing against standard base64 UUID encoding (22 characters)
- Displaying actual character count savings
- Proving that the densest encoding produces fewer than 24 characters

## Statistical Analysis

Provide aggregate statistics across encoding methods:
- Theoretical maximum bit density for each character set size
- Actual achieved density in practice
- Efficiency ratings compared to theoretical maximums
- Character set utilization analysis

## Performance Benchmarking

Include timing analysis for:
- Encode/decode speed comparisons across all encodings
- Memory usage patterns
- Throughput measurements for batch operations
- Scaling behavior with different input sizes

## Export and Display

Results should be formatted for easy consumption:
- Structured data objects for programmatic use
- Human-readable summary tables
- JSON export capability for integration with other tools
- README table generation for documentation

## Integration with Web Interface

Analysis results should be displayable on the website in src/web/ to demonstrate the library's capabilities:
- Interactive encoding comparison tool
- Live UUID encoding demonstration
- Performance visualization charts
- Character set density analysis

## Acceptance Criteria

- compareEncodings() provides comprehensive analysis for arbitrary binary data
- benchmarkUUID() proves the library achieves sub-24-character UUID encoding
- Analysis functions return structured data suitable for display and further processing
- Performance benchmarks demonstrate encoding/decoding speed characteristics
- Results clearly show density improvements over standard base64 encoding
- Functions work with both built-in and custom encodings
- All analysis functions exported as named exports from src/lib/main.js
- Website integration showcases the library's density achievements
