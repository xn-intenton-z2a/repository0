# CUSTOM_CHARSET

Summary

Allow users to create a custom encoding instance from a provided charset string. The factory validates the charset and returns an object that implements encode/decode and provides metadata.

Behaviour and validation

- Input: charset string containing unique printable characters. Optionally accept an options object with name and omitAmbiguous boolean (defaults to true).
- Validation rules:
  - Charset length must be at least 2 and at most the number of allowed printable characters.
  - All characters must be printable (no control characters) and unique.
  - When omitAmbiguous is true, filter out the characters 0, O, 1, l, I if present and return an error if the final charset would be too small.
  - Provide clear error messages for invalid input.

Factory output

- Returns an encoding object with properties: name, charset (string), charsetSize (integer), bitsPerChar (float), encode(input: Uint8Array) -> string, decode(input: string) -> Uint8Array.
- encode/decode must satisfy round-trip property for a wide range of buffers and provide deterministic behaviour for partial-block handling.

# ACCEPTANCE CRITERIA

- createEncoding factory is exported and tested.
- createEncoding rejects charsets with duplicate characters or control characters.
- createEncoding supports omitAmbiguous option and documents the final charset used in the returned metadata.
- Unit tests validate round-trip correctness for custom charsets of sizes representative of base62, base85 and printable94.
- Errors are thrown for invalid charset inputs and are asserted in tests.
