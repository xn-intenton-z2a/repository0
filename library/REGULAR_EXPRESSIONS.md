REGULAR_EXPRESSIONS

Normalised extract

Table of contents:
1. Syntax & construction
2. Flags and exact semantics
3. Pattern components (character classes, assertions, groups)
4. Quantifiers and greediness
5. Methods & return values (RegExp and String APIs)
6. State and lastIndex behaviour
7. Unicode features and ES2018+ additions
8. Best practices and pitfalls

Detailed information

1. Syntax & construction
- Constructor: RegExp(pattern[, flags]) where pattern is a string or RegExp; flags is a string containing zero or more of: g, i, m, s, u, y.
- Literal form: /pattern/flags

2. Flags and exact semantics
- g (global): affects search/replace and RegExp.prototype.exec/test when used repeatedly — causes RegExp.lastIndex to be used and updated.
- i (ignoreCase): case-insensitive matching per Unicode case folding rules when combined with u flag.
- m (multiline): ^ and $ match start/end of lines rather than whole string boundaries.
- s (dotAll): dot (.) matches newline characters as well.
- u (unicode): treat pattern as a sequence of Unicode code points; enables Unicode escapes and property escapes; required for \p{...} and astral code point handling.
- y (sticky): match only at lastIndex; similar to global but requires the match to start exactly at lastIndex.

3. Pattern components
- Character classes: [abc], ranges [a-z], negation [^...]; predefined classes: \d (digits), \w (word), \s (space); uppercase forms are negations (\D, \W, \S).
- Dot: . matches any code unit except line terminators (unless s flag is set).
- Assertions: ^ start, $ end (or line boundaries with m); \b word boundary; lookahead: (?=...), (?!...); lookbehind (positive and negative): (?<=...), (?<!...) (ES2018+ support in modern engines).
- Groups and captures: ( ... ) numbered capture groups with indices; named captures: (?<name>...) accessible via match.groups.name on result.

4. Quantifiers and greediness
- Greedy: *, +, ?, {n,m}; lazy forms add ? (e.g. *? +? ?? {n,m}?); JavaScript does not support possessive quantifiers natively.

5. Methods & return values
- RegExp.prototype.exec(string) -> Array|null. When a match occurs returns an array where index is the start index, input is the original string, and captured groups are at numeric indices; for named groups, result.groups is an object of groupName->value.
- RegExp.prototype.test(string) -> boolean. Returns true if pattern matches.
- String.prototype.match(regexp) -> if regexp has g flag: array of matches (strings) or null; otherwise returns result array like exec.
- String.prototype.replace(pattern, replacement) -> string. If replacement is a string, supports $& $1 $<name> tokens; if function, receives (match, p1,..., offset, string, groups).
- String.prototype.search(regexp) -> index or -1.
- String.prototype.split(regexp, limit) -> array of substrings.

6. State and lastIndex behavior
- For RegExp objects with g or y flags, RegExp.prototype.exec and RegExp.prototype.test use and update lastIndex. After a successful match lastIndex becomes index + matchedLength.
- Zero-length matches: engines increment lastIndex to avoid infinite loops when a zero-length match is found with g or y.
- For non-global patterns, exec always searches from start; lastIndex is ignored.

7. Unicode features and ES2018+ additions
- Unicode property escapes: \p{Property=Value} and \P{Property=Value} require the u flag; used for matching Unicode categories and scripts.
- Named capture groups: (?<name>...), access via match.groups.
- Lookbehind assertions: (?<=...) and (?<!...) supported in modern engines (since ES2018).

8. Best practices and pitfalls
- Escape user input before building a RegExp from dynamic strings (escape special characters: . ^ $ * + ? ( ) [ ] { } | \ / ).
- Prefer using the u flag when dealing with Unicode text containing astral characters.
- Avoid relying on lastIndex semantics across different RegExp instances; reset lastIndex = 0 before reusing in different contexts.
- For repeated matching, prefer String.prototype.matchAll (if available) over manual exec loops.

Reference details (API specifications)
- Constructor: RegExp(pattern: string|RegExp, flags?: string) -> RegExp
- exec(string: string) -> Array|null. Result array properties: index: number, input: string, groups?: Object.
- test(string: string) -> boolean
- Important String APIs: match, matchAll, replace, search, split — see above for return shapes and tokens.

Detailed digest
- Source: MDN Web Docs — Regular expressions - JavaScript guide
- URL: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions
- Retrieved: 2026-03-15
- Data obtained during crawling: 221150 bytes (HTML fetch size)

Attribution
MDN Web Docs (Mozilla) — Regular expressions (JavaScript Guide)
