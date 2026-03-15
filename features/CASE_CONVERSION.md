# CASE_CONVERSION

Overview
Provide three conversion utilities: camelCase, kebabCase, and titleCase. Each function splits input on non-alphanumeric separators, normalizes whitespace, and returns the requested casing. Null or undefined input returns an empty string.

API
camelCase(input) -> string
kebabCase(input) -> string
titleCase(input) -> string

Behavior
- camelCase: first word lowercased, subsequent words capitalized then concatenated.
- kebabCase: all lowercase, words joined by single hyphens.
- titleCase: first letter of each word capitalized, words separated by single spaces.
- Treat numbers as tokens and preserve them in resulting output.

Acceptance criteria
- camelCase(foo-bar-baz) -> fooBarBaz
- kebabCase(Hello World!) -> hello-world
- titleCase(hello world) -> Hello World
- Null or empty input returns empty string

Testing notes
Include inputs with underscores, mixed separators, numeric tokens, and Unicode characters.