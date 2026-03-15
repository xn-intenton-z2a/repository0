LEVENSHTEIN

Normalised extract

Table of contents:
1. Definition
2. Dynamic programming algorithm (standard)
3. Pseudocode and exact recurrence
4. Time/space complexity and optimisations
5. Variants (Damerau-Levenshtein, weighted costs)
6. Use-cases and best practices

Detailed information

1. Definition
- The Levenshtein distance between two strings a (length m) and b (length n) is the minimum number of single-character edits (insertions, deletions or substitutions) required to change a into b.

2. Dynamic programming algorithm (standard)
- Construct a matrix d of size (m+1) by (n+1).
- Initialize: for i from 0..m: d[i][0] = i. For j from 0..n: d[0][j] = j.
- For i from 1..m:
  For j from 1..n:
    cost = (a[i-1] == b[j-1]) ? 0 : 1
    d[i][j] = min(
      d[i-1][j] + 1,      // deletion
      d[i][j-1] + 1,      // insertion
      d[i-1][j-1] + cost  // substitution
    )
- The Levenshtein distance is d[m][n].

3. Pseudocode and exact recurrence
- Recurrence: d[i][j] = min( d[i-1][j] + 1, d[i][j-1] + 1, d[i-1][j-1] + (a[i-1]==b[j-1] ? 0 : 1) ) with boundary d[i][0]=i, d[0][j]=j.
- Memory-optimised variant: only keep two rows (previous and current) to compute next row; this reduces space to O(min(m,n)) while time remains O(m*n).

4. Time/space complexity and optimisations
- Time complexity: O(m * n) for lengths m and n.
- Space: O(m * n) for full matrix; O(min(m, n)) for two-row optimisation.
- Optimisations: early exit when absolute length difference > threshold; thresholded/limited-distance implementations compute only a diagonal band of width 2*threshold+1 for bounded distance use-cases.

5. Variants
- Damerau–Levenshtein: allows transposition of adjacent characters as an edit operation; standard dynamic-programming variant adjusts recurrence to include transposition checks when i>1 and j>1 and a[i-1]==b[j-2] and a[i-2]==b[j-1].
- Weighted costs: substitution/insertion/deletion can have non-uniform costs; recurrence replaces +1 with +cost(op).
- Normalised distance: distanceNormalized = distance / max(m, n) yields value in [0,1]; similarity can be 1 - distanceNormalized.

6. Use-cases and best practices
- Use for fuzzy string matching, spell-check suggestions, approximate search, and clustering similar strings.
- For long strings or large-scale matching prefer phonetic algorithms or n-gram/token-based similarity; Levenshtein is O(mn) and becomes expensive for many comparisons.
- When implementing for Unicode text, operate on code points (not UTF-16 code units) to handle astral symbols correctly.

Reference details (implementation signature)
- Typical API: function levenshtein(a: string, b: string): number
- Returns: integer distance >= 0

Detailed digest
- Source: Wikipedia — Levenshtein distance
- URL: https://en.wikipedia.org/wiki/Levenshtein_distance
- Retrieved: 2026-03-15
- Data obtained during crawling: 233290 bytes (HTML fetch size)

Attribution
- Wikipedia — Levenshtein distance (retrieved 2026-03-15)
