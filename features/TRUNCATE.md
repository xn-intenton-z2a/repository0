# TRUNCATE

Overview
Truncate shortens text to a maximum total length and appends a suffix (default is the single-character ellipsis). Truncation prefers not to break words: when possible it will cut at the last whitespace before the limit; if the first word itself exceeds the available space, the function will truncate mid-word to fit and append the suffix.

API
truncate(input, maxLength, suffix = …) -> string

Behavior
- Null or undefined input returns an empty string.
- If input length is less than or equal to maxLength, return input unchanged.
- When truncating, find the longest prefix that ends at a word boundary such that prefix length plus suffix length is less than or equal to maxLength. If no such boundary exists, truncate the first maxLength minus suffix length characters and append suffix.

Acceptance criteria
- truncate("Hello World", 8) -> "Hello…"
- truncate("Hello", 5) -> "Hello"
- truncate(null, 10) -> "" (empty string)
- When the first word is longer than available space, result length equals maxLength and ends with the suffix; for example truncate("Supercalifragilistic", 5) -> "Supe…"

Testing notes
Unit tests should assert returned length does not exceed maxLength, verify behaviour with multiple spaces, Unicode text, and custom suffix values.