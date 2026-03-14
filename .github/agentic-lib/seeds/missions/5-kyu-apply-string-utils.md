# Mission

A JavaScript library of string utility functions. This is a bag-of-functions problem — each function is independent.

## Required Capabilities

The library must provide these 10 string operations, exported as named functions from `src/lib/main.js`:

- **Slugify** — convert to URL-friendly slug (lowercase, hyphens, strip non-alphanumeric)
- **Truncate** — truncate with suffix (default "…"), don't break mid-word
- **camelCase** — convert to camelCase
- **kebabCase** — convert to kebab-case
- **titleCase** — capitalise first letter of each word
- **wordWrap** — soft wrap text at word boundaries. Never break a word. If a single word exceeds `width`, place it on its own line unbroken. Line separator is `\n`.
- **stripHtml** — remove HTML tags, decode common entities
- **escapeRegex** — escape special regex characters
- **Pluralize** — basic English pluralisation. Rules: words ending in s/x/z/ch/sh add "es"; consonant+"y" changes to "ies"; "f"/"fe" changes to "ves"; all others add "s". Irregular plurals (mouse/mice, child/children) are out of scope.
- **Levenshtein distance** — compute edit distance between two strings

## Requirements

- Handle edge cases: empty strings, null/undefined (return empty string), Unicode characters.
- No external runtime dependencies.
- Comprehensive unit tests for each function including edge cases.
- README with usage examples for each function.

## Acceptance Criteria

- [ ] All 10 functions are exported and work correctly
- [ ] Slugifying `"Hello World!"` produces `"hello-world"`
- [ ] Truncating `"Hello World"` to length 8 produces `"Hello…"`
- [ ] camelCase of `"foo-bar-baz"` produces `"fooBarBaz"`
- [ ] Levenshtein distance between `"kitten"` and `"sitting"` is `3`
- [ ] Edge cases (empty string, null, Unicode) handled gracefully
- [ ] All unit tests pass
- [ ] README documents all functions with examples
