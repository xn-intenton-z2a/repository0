# Encoding Metadata and Discovery

## Overview

Provide comprehensive metadata about all available encodings to help users choose the right encoding for their use case and compare efficiency.

## Metadata API

Export this function:

listEncodings() - Return array of encoding metadata objects

## Metadata Structure

Each encoding metadata object contains:
- name: string - encoding identifier for use with encode/decode
- charset: string - complete character set used by encoding  
- bitDensity: number - bits per character (log2 of charset length)
- uuidLength: number - encoded length for a 128-bit UUID
- description: string - human-readable description
- builtin: boolean - true for built-in encodings, false for custom

## Built-in Encoding Metadata

Provide rich descriptions for built-in encodings:
- base62: "URL-safe alphanumeric encoding (0-9a-zA-Z)"
- base85: "High-density Z85 encoding, avoids quotes and backslashes"  
- base91: "Maximum density printable encoding, ~6.5 bits/char"

## Sorting and Organization

Return encodings sorted by bit density descending:
- Highest density encodings first
- Help users find most compact options easily
- Consistent ordering across calls

## UUID Length Calculation

Calculate exact encoded length for 128-bit UUIDs:
- Use precise mathematical calculation, not approximation
- Account for padding and encoding algorithm specifics
- Enable direct comparison between encodings

## Performance Information

Include performance hints where relevant:
- Note encoding/decoding speed characteristics
- Mention memory usage patterns
- Highlight compatibility considerations

## Filtering and Selection

Provide guidance for encoding selection:
- Recommend base62 for maximum compatibility
- Suggest base85 or base91 for density-critical applications
- Note character set safety for different contexts

## Dynamic Updates

Reflect custom encodings in real-time:
- Include user-registered encodings in results
- Update metadata when custom encodings are added
- Maintain consistent format between built-in and custom

## Acceptance Criteria

- listEncodings function exported from main.js
- Metadata includes all required fields for each encoding
- Results sorted by bit density descending
- UUID length calculations are mathematically correct
- Custom encodings appear in results with proper metadata
- Built-in encoding descriptions are informative and accurate
- Unit tests verify metadata accuracy and completeness