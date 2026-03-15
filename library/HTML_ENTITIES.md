HTML_ENTITIES

Normalised extract

Table of contents:
1. Purpose
2. API summary
3. he.encode: options and exact semantics
4. he.decode: options and exact semantics
5. Error modes and strict behaviour
6. Implementation notes

Detailed information

Purpose
- The `he` library encodes and decodes HTML character references robustly and in accordance with the HTML Standard, handling named and numeric references and edge cases such as ambiguous ampersands and astral symbols.

API summary
- he.version -> string
- he.encode(text, options?) -> string
- he.decode(html, options?) -> string

he.encode(text, options) — options and semantics
- Purpose: replace characters with character references according to options.
- Important options (defaults indicated):
  - useNamedReferences: boolean (default false). When true, prefer named references (e.g. &copy;) where available; otherwise use numeric escapes (hex by default or decimal if decimal is true).
  - decimal: boolean (default false). When true, use decimal numeric escapes (e.g. &#169;) instead of hexadecimal (e.g. &#xA9;).
  - encodeEverything: boolean (default false). When true, encode every symbol in the input, including printable ASCII; takes precedence over allowUnsafeSymbols.
  - strict: boolean (default false). When true, throw on invalid input code points; when false, operate in error-tolerant mode.
  - allowUnsafeSymbols: boolean (default false). Controls handling of some symbols; overridden by encodeEverything if that is true.
- Behavior: If useNamedReferences and decimal are both true, named references are used where available and decimal for others; otherwise numeric hex escapes are used for characters without named references.

he.decode(html, options) — options and semantics
- Purpose: decode named and numeric character references into their characters following the HTML spec tokenization algorithm.
- Important options:
  - isAttributeValue: boolean (default false). When true, treat input as if it were an attribute value (different parsing rules for character references in attribute values).
  - strict: boolean (default false). When true, throw on parse errors; otherwise be tolerant and try to recover.
- Behavior: decodes named references and numeric references according to HTML spec section on character references.

Error modes and strict behaviour
- Both encode and decode accept a strict option that changes behavior from tolerant to throwing on invalid input.

Implementation notes
- Handles astral symbols and all standardized named character references per the HTML spec.
- Exposes a stable API for Node and browsers.

Reference details (API specifications)
- he.encode(text: string, options?: { useNamedReferences?: boolean, decimal?: boolean, encodeEverything?: boolean, strict?: boolean, allowUnsafeSymbols?: boolean }) -> string
- he.decode(html: string, options?: { isAttributeValue?: boolean, strict?: boolean }) -> string
- he.version -> string

Detailed digest
- Source: he README (mathiasbynens/he)
- Registry fetched: https://registry.npmjs.org/he
- README length: 14030 characters
- Registry JSON size fetched: 58773 bytes
- Retrieved: 2026-03-15

Attribution
- he — HTML entities library (mathiasbynens) README via npm registry
