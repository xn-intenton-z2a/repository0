# Encoding Metadata and Comparison

## Purpose

Provide comprehensive metadata about available encodings including bit density calculations and performance characteristics to enable informed encoding selection.

## Specification

The listEncodings function returns detailed information about all available encodings including built-in encodings and any custom encodings created via createEncoding.

Metadata includes encoding name, character set, theoretical bit density, practical UUID length, and performance characteristics.

The system maintains a comparison framework enabling users to evaluate trade-offs between density, performance, and compatibility.

## Requirements

The listEncodings function must return an array or object containing metadata for each available encoding including:
- Encoding name and description
- Character set string and size
- Theoretical bits per character (log2 of charset size)
- Actual UUID encoding length in characters
- Performance metrics where applicable
- Compatibility notes

UUID comparison functionality should demonstrate the encoding density benchmark by showing actual encoded lengths for a reference v7 UUID across all encodings.

The metadata system must update automatically when custom encodings are created, ensuring the information remains current and accurate.

## Acceptance Criteria

- listEncodings returns metadata for all available encodings
- Metadata includes charset, bit density, and UUID length
- UUID comparison shows actual encoded lengths
- Automatic updates when custom encodings are created
- Performance metrics included where measurable
- Clear comparison of density vs compatibility trade-offs
- README includes comparison table generated from metadata
- Function exported as named export from src/lib/main.js
- Metadata format suitable for programmatic analysis