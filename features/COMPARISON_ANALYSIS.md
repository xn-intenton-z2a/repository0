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