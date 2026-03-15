SLUGIFY

Normalised extract

Table of contents:
1. Purpose
2. Signature
3. Options (complete list)
4. Behavior details
5. Examples
6. Implementation notes

Detailed information

Purpose
- Convert arbitrary strings into URL/file-system-safe slugs by mapping and removing characters and joining words with a replacement character (default '-').

Signature
- slugify(input: string, options?: object) -> string

Options (from package README)
- replacement: string | default '-'. Replacement used between words.
- remove: RegExp | default undefined. A regex for characters to remove from the result (character-class regex recommended, e.g. /[*+~.()'"!:@]/g).
- lower: boolean | default false. Convert result to lower-case if true.
- strict: boolean | default false. When true, strip special characters except replacement.
- locale: string | optional locale code for locale-specific mappings.
- trim: boolean | default true. Trim leading and trailing replacement characters.

Behavior details
- Performs transliteration/canonical mapping of non-ASCII characters to ASCII equivalents according to the package charMap.
- If remove is a RegExp, it is applied after transliteration and replacement.
- If lower is true, entire result is lowercased (recommended for URLs).

Examples
- slugify('some string') -> 'some-string'
- slugify('some string', '_') -> 'some_string'
- slugify('a * b', {remove: /[*+~.()'"!:@]/g}) -> 'a-b'

Reference details (API specifications)
- Function: slugify(string, options?) -> string
- Options: see list above with default values.

Detailed digest
- Source: slugify README (npm registry and package repository)
- Registry fetched: https://registry.npmjs.org/slugify (full package metadata)
- README length: 4173 characters
- Registry JSON size fetched: 101530 bytes
- Retrieved: 2026-03-15

Attribution
- slugify (simov) README via npm registry and GitHub repository
