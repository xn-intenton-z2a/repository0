# PLURALIZE

Overview
pluralize applies simple English pluralisation rules: words ending in s, x, z, ch, sh add es; words ending in consonant + y change y to ies; words ending in f or fe change to ves; otherwise append s. Irregular plurals are out of scope. Null or undefined returns empty string.

API
pluralize(word) -> string

Behavior
- Trim input and match rules case-insensitively for detection; return the plural in the same case as input is not required for this library; implementations may return lowercase to keep behaviour predictable but tests should assert exact expected output.
- If input is empty or null return empty string.

Acceptance criteria
- pluralize("box") -> "boxes"
- pluralize("baby") -> "babies"
- pluralize("knife") -> "knives"
- pluralize("car") -> "cars"
- pluralize(null) -> "" (empty string)

Testing notes
Add tests for uppercase inputs, punctuation, words that already end in common suffixes, and short words.