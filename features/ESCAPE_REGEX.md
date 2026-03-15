# ESCAPE_REGEX

Overview
escapeRegex prepares arbitrary text for safe insertion into a regular expression by escaping all regex metacharacters so the returned string can be used literally inside a RegExp.

API
escapeRegex(input) -> string

Behavior
- Null or undefined returns empty string.
- Escape characters that have special meaning in RegExp: . * + ? ^ $ { } ( ) | [ ] \ / and similar, by prefixing them with a backslash.

Acceptance criteria
- escapeRegex(hello.world) -> hello\.world
- escapeRegex([a-z]) -> \[a\-z\]
- escapeRegex(null) -> empty string

Testing notes
Include inputs containing slashes, backslashes, brackets, braces, parentheses, pipes, plus signs, and punctuation to ensure correct escaping.