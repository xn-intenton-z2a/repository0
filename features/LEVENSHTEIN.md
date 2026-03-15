# LEVENSHTEIN

Overview
levenshtein computes the edit distance between two strings using the standard dynamic programming algorithm. Null or undefined inputs are treated as empty strings.

API
levenshtein(a, b) -> number

Behavior
- Return the minimum number of single-character insertions, deletions, or substitutions required to transform a into b.
- Treat null and undefined as empty string.
- Operate on Unicode code points so that surrogate pairs and combined characters are handled correctly where possible.

Acceptance criteria
- levenshtein("kitten", "sitting") -> 3
- levenshtein("", "") -> 0
- levenshtein(null, "a") -> 1
- levenshtein("a", "") -> 1

Testing notes
Include tests with Unicode characters, empty strings, identical strings, and larger inputs to validate algorithm correctness and performance.