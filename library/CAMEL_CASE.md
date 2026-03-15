CAMEL_CASE

Normalised extract

Table of contents:
1. Purpose and behaviour
2. Signature and usage
3. Word boundary rules
4. Edge cases and examples
5. Implementation notes

Detailed information

Purpose and behaviour
- _.camelCase converts input into lowerCamelCase: words are joined with no separators, first word lowercased, subsequent words capitalized at their first character; separators and punctuation are removed.

Signature and usage
- lodash function: _.camelCase([string='']) -> string
- Accepts values coercible to string (null/undefined -> '' via toString conversion used by lodash internals).

Word boundary rules
- Splits on spaces, punctuation, underscores, hyphens and other non-alphanumeric separators; treats sequences of separators as single boundary.
- Converts each word to lower case and capitalizes the first letter of each following word.

Edge cases and examples
- 'Foo Bar' -> 'fooBar'
- '--foo-bar--' -> 'fooBar'
- '__FOO_BAR__' -> 'fooBar'
- Handles Unicode letters and diacritics; behaviour depends on lodash deburr (if used) or engine Unicode handling.

Implementation notes
- There are no options; import or require lodash and call _.camelCase.
- For minimal bundle size, import only the camelCase method (lodash/camelCase) or implement small utility for specific needs.

Reference details
- Method path: lodash.camelCase(string) -> string
- Specific behaviour: lower-case first word, uppercase initial char of subsequent words, strip non-letter/number characters between words.

Detailed digest
- Source: Lodash documentation — camelCase (4.17.15)
- URL: https://lodash.com/docs/4.17.15#camelCase
- Retrieved: 2026-03-15
- Data obtained during crawling: 549929 bytes (HTML fetch size)

Attribution
Lodash documentation (lodash.com) — camelCase
