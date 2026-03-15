# WORD_WRAP

Overview
wordWrap(text, width) soft-wraps text at word boundaries using the newline character as the line separator. It never breaks words across lines; if a single word is longer than width it is placed on its own line unbroken.

API
wordWrap(text, width) -> string

Behavior
- Null or undefined returns empty string.
- Lines are assembled by adding words separated by single spaces; do not include trailing spaces at line ends.
- If a single word length is greater than width, the word appears alone on its line without splitting.
- Use the newline character as the sole line separator.

Acceptance criteria
- wordWrap("The quick brown fox", 10) -> "The quick\nbrown fox"
- wordWrap("supercalifragilistic", 5) -> "supercalifragilistic"
- wordWrap(null, 10) -> "" (empty string)

Testing notes
Test multiple consecutive spaces, leading/trailing spaces, very long words, and mixed Unicode whitespace characters.