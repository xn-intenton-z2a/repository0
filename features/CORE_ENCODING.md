# Core Binary Encoding Functions

## Overview

Implement the fundamental encode/decode API for converting arbitrary binary data to printable text and back using configurable character sets.

## Core API

The library must export these functions as named exports:

- encode(buffer, encoding) - Convert Uint8Array or ArrayBuffer to string using named encoding
- decode(str, encoding) - Convert encoded string back to Uint8Array using named encoding

## Input Validation

- buffer parameter accepts Uint8Array, ArrayBuffer, or Node.js Buffer
- encoding parameter must be a valid registered encoding name
- Throw TypeError for invalid buffer types
- Throw RangeError for unknown encoding names
- Empty buffer encodes to empty string
- Empty string decodes to empty buffer

## Round-trip Guarantee

For any valid binary input and any encoding:
decode(encode(x, enc), enc) must equal x

This property must hold for:
- All-zero bytes
- All 0xFF bytes  
- Single byte inputs
- Random binary data
- Edge case patterns

## Error Handling

- Invalid encoding names throw descriptive RangeError
- Malformed encoded strings throw descriptive DecodeError
- Preserve original binary data exactly through encode/decode cycle

## Performance Requirements

- Encoding should handle buffers up to 1MB efficiently
- Decoding should validate input characters only once
- No unnecessary memory allocations during processing

## Acceptance Criteria

- encode and decode functions exported from main.js
- Round-trip property verified for all built-in encodings
- Edge cases handled correctly (empty, single byte, large buffers)
- Comprehensive error messages for invalid inputs
- Unit tests cover all error conditions and edge cases